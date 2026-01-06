# Prueba de carga k6 — Login

Resumen
- Script k6: src/test/resources/k6/login.js
- Datos de entrada (CSV): src/test/resources/data/entrada.csv

Descripción
Este proyecto incluye un script de carga con k6 que realiza peticiones POST al endpoint de login de ejemplo:

  https://fakestoreapi.com/auth/login

El CSV debe tener el encabezado y filas con el formato:

  user,passwd

Contenido de ejemplo incluido en: src/test/resources/data/entrada.csv

Ubicación de archivos (colócalos así en el repo):
- Script k6: `src/test/resources/k6/login.js`
- CSV de credenciales: `src/test/resources/data/entrada.csv`

Validaciones y objetivos del ejercicio
- Alcanzar al menos 20 TPS (el script usa un escenario con 20 iteraciones por segundo por defecto).
- Tiempo de respuesta permitido: máximo 1,5 segundos (p95 < 1500ms).
- Tasa de error aceptable: menor al 3% del total de peticiones.

Parámetros configurables
El script soporta parametrización vía variables de entorno de k6:
- RATE: número de iteraciones por unidad de tiempo (por defecto 20)
- TIME_UNIT: unidad de tiempo para RATE (por defecto '1s')
- DURATION: duración del escenario (por defecto '1m')

Ejemplos de ejecución (bash.exe)
- Ejecutar con valores por defecto (20 TPS, 1m):

```bash
k6 run src/test/resources/k6/login.js
```

- Ejecutar 20 TPS por 2 minutos (ejemplo explícito):

```bash
RATE=20 DURATION=2m k6 run src/test/resources/k6/login.js
```

- Ejecutar 50 TPS por 30 segundos:

```bash
RATE=50 DURATION=30s k6 run src/test/resources/k6/login.js
```

Interpretación de resultados
- Revisa el resumen que imprime k6 al final. Busca:
  - `http_req_duration` p(95): debe ser < 1500 ms.
  - `http_req_failed`: rate debe ser < 0.03 (3%).
  - La métrica `errors` que definimos marca fallos de validación en la respuesta (por ejemplo: status != 200 o body sin token).

Notas
- El script carga el CSV con `open('../data/entrada.csv')` usando la ruta relativa desde `src/test/resources/k6`.
- Si tu entorno Windows no interpreta variables antes del comando, puedes exportarlas con `set`/`$env` según la shell, o usar la sintaxis de PowerShell si corresponde.

Siguientes pasos opcionales
- Puedo añadir un pequeño `run_k6.ps1` o `run_k6.sh` para estandarizar ejecuciones y recopilación de resultados. ¿Quieres que lo cree?
