import http from 'k6/http';
import { check } from 'k6';

export const options = {
  scenarios: {
    failure_sim: {
      executor: 'shared-iterations',
      vus: 15,
      iterations: 600,
      maxDuration: '30s',
    },
  },
};

export default function () {
  const res = http.get('http://localhost:8080/scholarships?limit=5', {
    headers: { 'Accept': 'application/json' },
  });

  check(res, {
    'status is 200': (r) => r.status === 200,
  });
}
