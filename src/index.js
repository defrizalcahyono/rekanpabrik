require("dotenv").config();
const app = require("./app");
const chalk = require("chalk");

const PORT = process.env.PORT || 8080;

console.log("PORT ENV =", process.env.PORT);

app.listen(PORT, "0.0.0.0", () => {
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

  if (err) {
    console.error("LISTEN ERROR:", err);
    return;
  }

  console.log(`Listening on ${PORT}`);
});