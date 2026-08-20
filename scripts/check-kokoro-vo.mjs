import { existsSync, readFileSync } from "node:fs";

const ep = JSON.parse(readFileSync("episodes/ep01.json", "utf8"));
const voice = JSON.parse(readFileSync("public/vo/voice.json", "utf8"));

function fail(message) {
  console.error(message);
  process.exit(1);
}

if (
  voice.engine !== "kokoro" ||
  voice.model !== "hexgrad/Kokoro-82M" ||
  voice.voice !== "am_echo" ||
  voice.speed !== 1.25
) {
  fail("voice.json must be Kokoro-82M am_echo 1.25");
}

const ids = [
  ...ep.scenes.map((scene) => scene.id),
  ...ep.shorts.hook.map((beat) => `short-hook-${beat.id}`),
];

for (const id of ids) {
  const metaPath = `public/vo/${id}.meta.json`;
  if (!existsSync(metaPath)) {
    fail(`missing ${metaPath}`);
  }
  const meta = JSON.parse(readFileSync(metaPath, "utf8"));
  if (
    meta.engine !== "kokoro" ||
    meta.model !== "hexgrad/Kokoro-82M" ||
    meta.voice !== "am_echo" ||
    meta.speed !== 1.25
  ) {
    fail(`${id} is not Kokoro am_echo 1.25`);
  }
}

console.log(`kokoro am_echo 1.25 on ${ids.length} lines`);
console.log("kokoro vo check ok");
