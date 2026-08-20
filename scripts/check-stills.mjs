import { existsSync, readFileSync, readdirSync } from "node:fs";

const ep = JSON.parse(readFileSync("episodes/ep01.json", "utf8"));

function fail(message) {
  console.error(message);
  process.exit(1);
}

const PACK = [
  "01-intro-this-is-cairn.png",
  "01-intro-little-stack-of-rocks.png",
  "01-intro-lives-in-a-room.png",
  "01-intro-not-your-teacher.png",
  "02-tuesday-the-keyboard-was-just-a-keyboard.png",
  "02-tuesday-it-was-on-the-desk.png",
  "02-tuesday-cairn-walked-in.png",
  "02-tuesday-nobody-texted-him.png",
  "02-tuesday-he-played-until-it-got-dark.png",
  "02-tuesday-didnt-check-the-time.png",
  "02-tuesday-didnt-owe-the-chair.png",
  "02-tuesday-left-when-the-song-was-done.png",
  "03-he-books-it-thats-the-fun-part.png",
  "03-he-books-it-then-he-got-serious.png",
  "03-he-books-it-opened-his-calendar.png",
  "03-he-books-it-wrote-keys.png",
  "03-he-books-it-yellow-square.png",
  "03-he-books-it-put-the-room-in-the-invite.png",
  "03-he-books-it-he-was-proud.png",
  "04-wednesday-checked-the-square-twice.png",
  "04-wednesday-told-a-friend.png",
  "04-wednesday-walked-past-the-keyboard.png",
  "04-wednesday-he-had-a-block-tomorrow.png",
  "05-thursday-the-square-actually-hit.png",
  "05-thursday-clock-hits-seven.png",
  "05-thursday-chairs-already-out.png",
  "05-thursday-cairn-sits-down.png",
  "05-thursday-hands-on-the-keys.png",
  "05-thursday-he-does-not-want-it.png",
  "05-thursday-same-keyboard-same-room.png",
  "05-thursday-hands-know-what-to-do.png",
  "05-thursday-hes-watching-the-clock.png",
  "05-thursday-plays-the-whole-hour.png",
  "05-thursday-block-ends.png",
  "05-thursday-closes-the-lid.png",
  "06-friday-walks-past-the-desk.png",
  "06-friday-keyboard-looking-at-him.png",
  "06-friday-he-makes-coffee.png",
  "06-saturday-just-looks.png",
  "06-saturday-used-to-want-it.png",
  "06-saturday-puts-his-mug-down.png",
  "07-the-name-writing-board.png",
  "07-the-name-thats-the-walk.png",
  "07-the-name-work-brain.png",
  "07-the-name-calendar-mindset.png",
  "07-the-name-he-has-the-yellow-square.png",
  "08-the-move-deletes-tuesday-at-seven.png",
  "08-the-move-square-is-gone.png",
  "08-the-move-walks-over.png",
  "08-the-move-walks-past.png",
  "08-the-move-night-test.png",
  "08-the-move-walks-over-at-four.png",
  "08-the-move-plays-one-song.png",
  "08-the-move-one-stone.png",
  "08-the-move-keyboard-just-a-keyboard.png",
  "08-the-move-booked-it-like-a-standup.png",
  "09-cta.png",
];

const NIGHT_CUT = [
  "01-intro-full-body.png",
  "02-tue-keyboard-day.png",
  "03-tue-walk-in.png",
  "04-tue-play-dusk.png",
  "05-keys-square.png",
  "06-keys-deleted.png",
  "07-thu-clock-seven.png",
  "08-thu-meeting-sit.png",
  "09-thu-lid-close.png",
  "10-fri-walk-mug.png",
  "11-want-vs-homework.png",
  "12-one-stone.png",
  "13-cta-quiet.png",
];

const names = new Set();
for (const scene of ep.scenes) {
  names.add(scene.still);
  if (scene.altStill) {
    names.add(scene.altStill);
  }
  for (const extra of scene.holdStills ?? []) {
    names.add(extra);
  }
}
for (const beat of ep.shorts.hook) {
  names.add(beat.still);
  if (beat.altStill) {
    names.add(beat.altStill);
  }
  for (const extra of beat.holdStills ?? []) {
    names.add(extra);
  }
}
names.add(ep.thumbStill);

for (const name of names) {
  if (NIGHT_CUT.includes(name)) {
    fail(`encode still points at night-cut ${name}`);
  }
  const path = `public/ep01-stills/${name}`;
  if (!existsSync(path)) {
    fail(`missing ${path}`);
  }
  if (!PACK.includes(name)) {
    fail(`still ${name} is not in the 57-shot pack`);
  }
}

for (const name of PACK) {
  if (!existsSync(`public/ep01-stills/${name}`)) {
    fail(`required still missing: ${name}`);
  }
}

const onDisk = readdirSync("public/ep01-stills").filter((name) =>
  name.endsWith(".png"),
);
if (onDisk.length !== PACK.length) {
  fail(`expected ${PACK.length} pack stills, found ${onDisk.length}`);
}

console.log(`${names.size} stills on disk from the 57-shot pack`);
console.log("stills check ok");
