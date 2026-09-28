import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const LIMITS = {
  photos: 8 * 1024 * 1024,
  posters: 5 * 1024 * 1024,
  videos: 32 * 1024 * 1024,
} as const;

const ALLOWED: Record<string, readonly string[]> = {
  ".jpg": ["image/jpeg"],
  ".jpeg": ["image/jpeg"],
  ".png": ["image/png"],
  ".webp": ["image/webp"],
  ".gif": ["image/gif"],
  ".mp4": ["video/mp4"],
  ".webm": ["video/webm"],
};

function looksLike(bytes: Buffer, ext: string) {
  if (ext === ".jpg" || ext === ".jpeg") return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (ext === ".png") return bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
  if (ext === ".gif") return bytes.toString("ascii", 0, 3) === "GIF";
  if (ext === ".webp") {
    return bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP";
  }
  if (ext === ".mp4") return bytes.toString("ascii", 4, 8) === "ftyp";
  if (ext === ".webm") return bytes[0] === 0x1a && bytes[1] === 0x45 && bytes[2] === 0xdf && bytes[3] === 0xa3;
  return false;
}

function safeExt(file: File, folder: keyof typeof LIMITS) {
  const fromName = path.extname(file.name || "").toLowerCase();
  const fromType =
    file.type === "image/jpeg"
      ? ".jpg"
      : file.type === "image/png"
        ? ".png"
        : file.type === "image/webp"
          ? ".webp"
          : file.type === "image/gif"
            ? ".gif"
            : file.type === "video/mp4"
              ? ".mp4"
              : file.type === "video/webm"
                ? ".webm"
                : "";
  const ext = ALLOWED[fromName] ? fromName : fromType;
  if (!ext || !ALLOWED[ext]) return null;
  if (folder === "videos" && ext !== ".mp4" && ext !== ".webm") return null;
  if (folder !== "videos" && (ext === ".mp4" || ext === ".webm")) return null;
  if (ALLOWED[ext] && file.type && !ALLOWED[ext].includes(file.type) && file.type !== "application/octet-stream") {
    return null;
  }
  return ext;
}

export async function saveUpload(file: File | null, folder: "photos" | "videos" | "posters") {
  if (!file || file.size === 0) return null;
  if (file.size > LIMITS[folder]) return null;
  const ext = safeExt(file, folder);
  if (!ext) return null;
  const bytes = Buffer.from(await file.arrayBuffer());
  if (!looksLike(bytes, ext)) return null;
  const name = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads", folder);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), bytes);
  return `/uploads/${folder}/${name}`;
}
