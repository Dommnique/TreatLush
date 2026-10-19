import { readFileSync } from "node:fs";

const envFile = readFileSync(".env.local", "utf8");

const secretLine = envFile
  .split(/\r?\n/)
  .find((line) => line.startsWith("CRON_SECRET="));

const secret = secretLine?.slice("CRON_SECRET=".length).trim();

if (!secret) {
  console.error("CRON_SECRET was not found in .env.local.");
  process.exit(1);
}

const response = await fetch("http://localhost:3000/api/payment-recovery", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${secret}`,
  },
});

console.log("HTTP status:", response.status);
console.log("Response:", await response.text());
