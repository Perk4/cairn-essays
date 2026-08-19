import { mkdirSync } from "node:fs";
import { spawnSync } from "node:child_process";

mkdirSync("out", { recursive: true });

const jobs = [
  { id: "ep01", out: "out/ep01.mp4" },
  { id: "ep01-hook", out: "out/ep01-hook.mp4" },
];

for (const job of jobs) {
  const args = [
    "remotion",
    "render",
    job.id,
    job.out,
    "--concurrency=1",
    "--gl=angle",
  ];

  const result = spawnSync("npx", args, { stdio: "inherit" });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
