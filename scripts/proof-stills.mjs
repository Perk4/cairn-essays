import { mkdirSync } from "node:fs";
import { spawnSync } from "node:child_process";

mkdirSync("out/proof", { recursive: true });

const stills = [
  { id: "ep01", frame: 20, out: "out/proof/planted-hook.png" },
  { id: "ep01", frame: 1510, out: "out/proof/hook2-thursday.png" },
  { id: "ep01", frame: 6180, out: "out/proof/spark-in-room.png" },
  { id: "ep01", frame: 6360, out: "out/proof/wall-kills-spark.png" },
  { id: "ep01", frame: 8100, out: "out/proof/s5gap-point.png" },
  { id: "ep01", frame: 9660, out: "out/proof/s3-point.png" },
  { id: "ep01", frame: 11370, out: "out/proof/eggs-drop.png" },
  { id: "ep01", frame: 12480, out: "out/proof/limits-scene.png" },
  { id: "ep01", frame: 13820, out: "out/proof/stone-throw.png" },
  { id: "ep01", frame: 15180, out: "out/proof/end-nod-stone.png" },
  { id: "ep01-hook", frame: 8, out: "out/proof/short-hook-tue.png" },
  { id: "ep01-hook", frame: 280, out: "out/proof/short-hook-thu.png" },
  { id: "ep01-rule", frame: 20, out: "out/proof/short-rule-finish.png" },
  { id: "ep01-rule", frame: 290, out: "out/proof/short-rule-stack.png" },
];

for (const still of stills) {
  const result = spawnSync(
    "npx",
    [
      "remotion",
      "still",
      still.id,
      still.out,
      `--frame=${still.frame}`,
      "--gl=angle",
    ],
    { stdio: "inherit" },
  );
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
