import { mkdir, copyFile, access } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const photosDir = path.join(root, "public", "media", "photos");
const videosDir = path.join(root, "public", "media", "videos");
const postersDir = path.join(root, "public", "media", "posters");

const photos = [
  ["photo_1_2026-09-12_19-34-53.jpg", "forest-holi"],
  ["photo_2_2026-09-12_19-34-53.jpg", "diplomas"],
  ["photo_3_2026-09-12_19-34-53.jpg", "lake-pier"],
  ["photo_4_2026-09-12_19-34-53.jpg", "meadow-paint"],
];

const videos = [
  ["IMG_1519.MP4", "weekend-1"],
  ["IMG_4497.MP4", "weekend-2"],
  ["IMG_6561.MP4", "weekend-3"],
];

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: "inherit", shell: false });
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} exited with ${code}`));
    });
  });
}

async function exists(file) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

await mkdir(photosDir, { recursive: true });
await mkdir(videosDir, { recursive: true });
await mkdir(postersDir, { recursive: true });

for (const [srcName, dest] of photos) {
  const src = path.join(root, srcName);
  const jpg = path.join(photosDir, `${dest}.jpg`);
  const webp = path.join(photosDir, `${dest}.webp`);
  const card = path.join(photosDir, `${dest}-card.jpg`);
  const image = sharp(src).rotate();
  await image
    .clone()
    .resize({ width: 1920, withoutEnlargement: true })
    .jpeg({ quality: 78, mozjpeg: true })
    .toFile(jpg);
  await image
    .clone()
    .resize({ width: 1920, withoutEnlargement: true })
    .webp({ quality: 76 })
    .toFile(webp);
  await image
    .clone()
    .resize({ width: 900, withoutEnlargement: true })
    .jpeg({ quality: 76, mozjpeg: true })
    .toFile(card);
  console.log("photo", dest);
}

for (const [srcName, dest] of videos) {
  const src = path.join(root, srcName);
  const out = path.join(videosDir, `${dest}.mp4`);
  const poster = path.join(postersDir, `${dest}.jpg`);
  if (!(await exists(out))) {
    await run("ffmpeg", [
      "-y",
      "-i",
      src,
      "-vf",
      "scale='min(1280,iw)':-2",
      "-c:v",
      "libx264",
      "-crf",
      "28",
      "-preset",
      "veryfast",
      "-c:a",
      "aac",
      "-b:a",
      "96k",
      "-movflags",
      "+faststart",
      out,
    ]);
  }
  await run("ffmpeg", [
    "-y",
    "-ss",
    "00:00:01",
    "-i",
    src,
    "-frames:v",
    "1",
    "-q:v",
    "3",
    poster,
  ]);
  await sharp(poster)
    .resize({ width: 1280, withoutEnlargement: true })
    .jpeg({ quality: 78, mozjpeg: true })
    .toFile(path.join(postersDir, `${dest}-sm.jpg`));
  console.log("video", dest);
}

console.log("media processed");
