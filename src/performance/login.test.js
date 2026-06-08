import http from "k6/http";
import { check, sleep } from "k6";

export let options = {
  stages: [
    { duration: "30s", target: 10 },
    { duration: "1m", target: 50 },
    { duration: "1m", target: 100 },
    { duration: "30s", target: 0 },
  ],

  thresholds: {
    http_req_duration: ["p(95)<2000"],
    http_req_failed: ["rate<0.1"],
  },
};

// cache token per VU
let token;

function login() {
  const baseUrl = __ENV.BASE_URL;
  const url = `${baseUrl}/auth/login`;

  const payload = JSON.stringify({
    email: __ENV.K6_EMAIL,
    password: __ENV.K6_PASSWORD,
  });

  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = http.post(url, payload, params);

  const success = check(res, {
    "login success": (r) => r.status === 200 && r.json("token"),
  });

  if (!success) {
    console.error(`Login failed: ${res.status} - ${res.body}`);
    return null;
  }

  return res.json("token");
}

export default function () {
  // login sekali per VU
  if (!token) {
    token = login();
  }

  if (!token) {
    return;
  }

  // simulate user behavior delay
  sleep(Math.random() * 2 + 1);

  // optional: reuse token request (contoh protected API)
  const baseUrl = __ENV.BASE_URL;

  const res = http.get(`${baseUrl}/postPekerjaan/getPostAllPostingan`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  check(res, {
    "status 200": (r) => r.status === 200,
    "response time < 2s": (r) => r.timings.duration < 2000,
  });

  sleep(Math.random() * 3 + 1);
}