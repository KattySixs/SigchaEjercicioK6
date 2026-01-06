import http from 'k6/http';
import { check } from 'k6';

export default function () {
    const res = http.get('https://petstore.swagger.io/v2/pet/1');
    check(res, {
        'status is 200': r => r.status === 200,
    });
}