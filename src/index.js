require("dotenv").config();
const app = require("../src/app");
const chalk = require("chalk");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(chalk.green.bold("\n🚀 Server is running!\n"));

  console.log(
    chalk.cyan("📍 Base URL: ") +
    chalk.whiteBright(`http://localhost:${PORT}/api/v1`)
  );

  console.log(
    chalk.yellow("📘 Swagger Docs: ") +
    chalk.whiteBright(`http://localhost:${PORT}/api-docs`)
  );

  console.log(
    chalk.magenta("❤️ Environment: ") +
    chalk.whiteBright(process.env.NODE_ENV || "development")
  );

  process.on("uncaughtException", (err) => {
    console.error("🔥 UNCUGHT:", err);
  });

  process.on("unhandledRejection", (err) => {
    console.error("🔥 REJECTION:", err);
  });
});