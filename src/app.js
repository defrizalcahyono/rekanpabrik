require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoute = require("./routes/auth");
const pelamarRoute = require("./routes/pelamarRoute");
const adminRoute = require("./routes/adminRoutes");
const perusahaanRoute = require("./routes/perusahaanRoute");
const postingPekerjaanRoute = require("./routes/postPekerjaanRoute");
const melamarRoute = require("./routes/melamarPekerjaanRoute");
const savedJobsRoute = require("./routes/savedJobsRoute");
const pengaduanRoute = require("./routes/pengaduanRoute");

const verifyJWT = require("./middleware/verififyJWT");

const swagger = require("./config/swagger");

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:8000",
      "https://web-admin-rekan-pabrik.up.railway.app"
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use(
  "/api-docs",
  swagger.swaggerUi.serve,
  swagger.swaggerUi.setup(swagger.specs)
);

app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "Backend is running 🚀",
  });
});

const API_PREFIX = "/api/v1";

app.use(`${API_PREFIX}/auth`, authRoute);
app.use(`${API_PREFIX}/pengaduan`, pengaduanRoute);

app.use(`${API_PREFIX}/pelamar`, verifyJWT, pelamarRoute);
app.use(`${API_PREFIX}/admin`, verifyJWT, adminRoute);
app.use(`${API_PREFIX}/perusahaan`, verifyJWT, perusahaanRoute);
app.use(`${API_PREFIX}/jobs`, verifyJWT, postingPekerjaanRoute);
app.use(`${API_PREFIX}/applications`, verifyJWT, melamarRoute);
app.use(`${API_PREFIX}/saved-jobs`, verifyJWT, savedJobsRoute);

module.exports = app;