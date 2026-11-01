import fs from "fs";
import path from "path";

/** Server-only: whether a reel MP4 has been rendered into /public */
export function reelMp4Exists(publicPath: string | undefined): boolean {
  if (!publicPath?.startsWith("/")) return false;
  const filePath = path.join(process.cwd(), "public", publicPath.slice(1));
  try {
    return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
  } catch {
    return false;
  }
}
