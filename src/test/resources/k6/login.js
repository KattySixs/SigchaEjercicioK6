import http from 'k6/http';
import { check } from 'k6';
import { SharedArray } from 'k6/data';
import { Rate } from 'k6/metrics';

// Cargar credenciales desde el CSV
const creds = new SharedArray('credentials', function () {
    return open('../data/entrada.csv')
        .split('\n')
        .slice(1) // quitar encabezado
        .map(l => l.trim())
        .filter(Boolean)
        .map(l => {
            const parts = l.split(',');
            return { user: parts[0].trim(), passwd: parts[1].trim() };
        });
});

// Métrica personalizada para errores esperados/negocios
export let errorRate = new Rate('errors');

// Permitir parametrización vía variables de entorno
const DEFAULT_RATE = 20;
const DEFAULT_TIME_UNIT = '1s';
const DEFAULT_DURATION = '1m';

const RATE = Number(__ENV.RATE) || DEFAULT_RATE;
const TIME_UNIT = __ENV.TIME_UNIT || DEFAULT_TIME_UNIT;
const DURATION = __ENV.DURATION || DEFAULT_DURATION;

export let options = {
    scenarios: {
        login_rps: {
            executor: 'constant-arrival-rate',
            exec: 'loginScenario',
            rate: RATE,           // iteraciones por timeUnit (RPS)
            timeUnit: TIME_UNIT,  // por defecto '1s' => RPS
            duration: DURATION,   // duración (puede ser "1m", "30s", etc.)
            preAllocatedVUs: 50,
            maxVUs: 200,
        },
    },
    thresholds: {
        // Tiempo de respuesta: p95 debe ser menor a 1500ms
        'http_req_duration': ['p(95)<1500'],
        // Tasa de peticiones fallidas (HTTP) menor al 3%
        'http_req_failed': ['rate<0.03'],
        // Umbral para la métrica de errores de negocio que usamos
        'errors': ['rate<0.03'],
    },
};

export function loginScenario() {
    // Selección round-robin de credenciales
    const idx = ( (__ITER || 0) + (__VU || 0) ) % creds.length;
    const cred = creds[idx];

    const url = 'https://fakestoreapi.com/auth/login';
    const payload = JSON.stringify({ username: cred.user, password: cred.passwd });
    const params = {
        headers: { 'Content-Type': 'application/json' },
        timeout: '60s',
    };

    const res = http.post(url, payload, params);

    // Validaciones por petición
    // Parseo seguro del cuerpo
    let body = {};
    try {
        body = JSON.parse(res.body || '{}');
    } catch (e) {
        body = {};
    }

    // Comprobaciones (marcamos explícitamente qué consideramos éxito):
    // - Debe existir un token en el body (este es el criterio principal de éxito)
    // - El tiempo debe ser menor a 1500ms (seguimos midiendo latencia)
    //ks
    check(res, {
        'body has token': () => !!(body && body.token),
        'duration < 1500ms': (r) => r.timings && r.timings.duration < 1500,
    });

    // Consideramos error de negocio cuando NO existe token o el request devolvió un código HTTP de cliente/servidor.
    const httpError = res.status >= 400;
    const hasToken = !!(body && body.token);

    if (!hasToken || httpError) {
        errorRate.add(1);
    } else {
        errorRate.add(0);
    }
}

// Referencias adicionales para evitar advertencias de 'unused' por analizadores estáticos.
// Asignamos a `globalThis.__k6_test_refs` para que las variables queden referenciadas; esto no afecta
// la ejecución de k6 y es una acción segura en entornos JS modernos.
if (typeof globalThis !== 'undefined') {
    globalThis.__k6_test_refs = options;
    // Referencia no operativa para que el analizador marque `loginScenario` como usado.
    void loginScenario;
}
