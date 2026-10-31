import http from 'k6/http';
import { check } from 'k6';

export const options = {
  scenarios: {
    load_test_1000: {
      executor: 'shared-iterations',
      vus: 20,
      iterations: 1000,
      maxDuration: '2m',
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.01'], // less than 1% failures
  },
};

export default function () {
  const url = 'http://localhost:8080/scholarships?limit=10';
  const res = http.get(url, {
    headers: {
      'Accept': 'application/json',
    },
  });

  check(res, {
    'status is 200': (r) => r.status === 200,
    'has instance header': (r) => r.headers['X-Backend-Instance'] !== undefined,
  });
}
