/**
 * startDev - Ensures the backend starts cleanly for local development.
 * Part of DonateBridge - Community Item Donation & Pickup Platform
 *
 * This script checks whether the configured development port is already in use,
 * clears any stale Node processes left behind by earlier runs, and then starts
 * the API with nodemon so the frontend can connect reliably.
 */
import { spawn, execSync } from "node:child_process";

const port = process.env.PORT || 4000;

const killPortProcess = () => {
  try {
    const output = execSync(`netstat -ano | findstr :${port}`, {
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
    });

    const lines = output
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    const pid = lines
      .map((line) => line.split(/\s+/).pop())
      .find((value) => /^\d+$/.test(value));

    if (!pid) return;

    execSync(`taskkill /PID ${pid} /F`, { stdio: "inherit" });
    console.log(`Cleared stale process on port ${port} (PID ${pid}).`);
  } catch {
    // No process is listening on this port.
  }
};

const startServer = () => {
  const child = spawn(process.execPath, ["index.js"], {
    cwd: process.cwd(),
    stdio: "inherit",
    shell: false,
  });

  child.on("exit", (code) => {
    process.exit(code ?? 0);
  });

  child.on("error", (error) => {
    console.error("Failed to start backend development server:", error);
    process.exit(1);
  });
};

killPortProcess();
startServer();
