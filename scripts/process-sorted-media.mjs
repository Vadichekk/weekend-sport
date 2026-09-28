import { mkdir, readdir, access } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = path.join(root, "media");
const publicRoot = path.join(root, "public", "media", "bases");

const bases = [
  { folder: "База отдыха «Солнечный остров»", slug: "solnechnyy-ostrov" },
  { folder: "Загородный клуб «Пески»", slug: "peski" },
  { folder: "Парк Сказов", slug: "park-skazov" },
  { folder: "Сеть термальных курортов «Баден-Баден»", slug: "baden-baden" },
  { folder: "Территория семейного отдыха «Хрустальная»", slug: "khrustalnaya" },
];

const kinds = [
  { folder: "медиа базы", kind: "place" },
  { folder: "медиа с отдыха на базе", kind: "stay" },
];

const videoLimit = {
  "solnechnyy-ostrov": [
    "IMG_6561.MP4",
    "IMG_1201.MP4",
    "IMG_1268.MP4",
    "IMG_1337.MP4",
    "IMG_1664.MP4",
    "IMG_1758.MP4",
    "IMG_1519.MP4",
    "IMG_4497.MP4",
  ],
  peski: ["IMG_0063.MP4", "IMG_0381.MP4", "IMG_9887.MP4", "IMG_0015.MOV", "IMG_0213.MP4"],
};

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: "inherit", windowsHide: true });
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

function isPhoto(name) {
  return /\.(jpe?g|png|webp)$/i.test(name);
}

function isVideo(name) {
  return /\.(mp4|mov|m4v)$/i.test(name);
}

await mkdir(publicRoot, { recursive: true });

for (const base of bases) {
  for (const kind of kinds) {
    const srcDir = path.join(sourceRoot, base.folder, kind.folder);
    const destDir = path.join(publicRoot, base.slug, kind.kind);
    await mkdir(path.join(destDir, "photos"), { recursive: true });
    await mkdir(path.join(destDir, "videos"), { recursive: true });
    await mkdir(path.join(destDir, "posters"), { recursive: true });

    let files = [];
    try {
      files = await readdir(srcDir);
    } catch {
      continue;
    }

    const allowedVideos = new Set((videoLimit[base.slug] || []).map((name) => name.toLowerCase()));
    let videoCount = 0;

    for (const file of files.sort()) {
      const src = path.join(srcDir, file);
      if (isPhoto(file)) {
        const stem = file.replace(/\.[^.]+$/, "").replace(/[^\w-]+/g, "-").slice(0, 40);
        await sharp(src)
          .rotate()
          .resize({ width: 1600, withoutEnlargement: true })
          .jpeg({ quality: 78, mozjpeg: true })
          .toFile(path.join(destDir, "photos", `${stem}.jpg`));
        console.log("photo", base.slug, kind.kind, file);
        continue;
      }

      if (!isVideo(file)) continue;
      const selected = allowedVideos.size ? allowedVideos.has(file.toLowerCase()) : videoCount < 4;
      if (!selected) continue;
      videoCount += 1;
      const stem = file.replace(/\.[^.]+$/, "").toLowerCase();
      const out = path.join(destDir, "videos", `${stem}.mp4`);
      const poster = path.join(destDir, "posters", `${stem}.jpg`);
      if (!(await exists(out))) {
        await run("ffmpeg", [
          "-y",
          "-i",
          src,
          "-vf",
          "scale='min(960,iw)':-2",
          "-c:v",
          "libx264",
          "-crf",
          "30",
          "-preset",
          "veryfast",
          "-c:a",
          "aac",
          "-b:a",
          "96k",
          "-movflags",
          "+faststart",
          "-t",
          "45",
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
        "-update",
        "1",
        "-q:v",
        "3",
        poster,
      ]);
      console.log("video", base.slug, kind.kind, file);
    }
  }
}

console.log("sorted media processed");
