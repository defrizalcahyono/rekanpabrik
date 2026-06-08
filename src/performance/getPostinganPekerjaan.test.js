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
    http_req_failed: ["rate<0.1"], // <10% error rate
  },
};

// cache token per VU (biar tidak login terus)
let token;

function login() {
  const BASE_URL = __ENV.BASE_URL;

  const res = http.post(
    `${BASE_URL}/auth/login`,
    JSON.stringify({
      email: __ENV.K6_EMAIL,
      password: __ENV.K6_PASSWORD,
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const success = check(res, {
    "login success": (r) =>
      r.status === 200 && r.json("token") !== undefined,
  });

  if (!success) {
    console.log("Login gagal:", res.body);
    return null;
  }

  return res.json("token");
}

export default function () {
  const BASE_URL = __ENV.BASE_URL;

  // login sekali per VU
  if (!token) {
    token = login();
  }

  if (!token) {
    return;
  }

  const res = http.get(
    `${BASE_URL}/postPekerjaan/getPostAllPostingan`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  check(res, {
    "status 200": (r) => r.status === 200,
    "response < 2s": (r) => r.timings.duration < 2000,
  });

  sleep(Math.random() * 2 + 1); // lebih realistic (1–3 detik delay user)
}