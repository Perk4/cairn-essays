import { mkdirSync } from "node:fs";
import { spawnSync } from "node:child_process";

mkdirSync("out", { recursive: true });

const jobs = [
  ["ep01", "out/ep01.mp4"],
  ["ep01-hook", "out/ep01-hook.mp4"],
  ["ep01-rule", "out/ep01-rule.mp4"],
];

for (const job of jobs) {
  const id = job[0];
  const out = job[1];
  if (!id || !out) {
    throw new Error("render job is missing id or path");
  }

  const result = spawnSync(
    "npx",
    [
      "remotion",
      "render",
      id,
      out,
      "--concurrency=1",
      "--gl=angle",
    ],
    { stdio: "inherit" },
  );

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
