import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";
import { uploadAudioToCloudinary } from "@/lib/cloudinary";
import { getCommunityTracks, saveCommunityTrack, findCommunityTrackByVideoId } from "@/lib/audio-store";

function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();

  // If it's already an 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  const regExp = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))([\w-]{11})/i;
  const match = trimmed.match(regExp);
  return match ? match[1] : null;
}

export async function GET() {
  try {
    const communityTracks = getCommunityTracks();
    return NextResponse.json({
      success: true,
      tracks: communityTracks,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load community tracks" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url, storage: requestedStorage } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { success: false, error: "Please provide a valid YouTube URL" },
        { status: 400 }
      );
    }

    const videoId = extractYouTubeId(url);
    if (!videoId) {
      return NextResponse.json(
        { success: false, error: "Could not recognize a valid YouTube video ID from the provided link." },
        { status: 400 }
      );
    }

    // ──────────────────────────────────────────────
    // 0. DUPLICATE CHECK: Avoid re-downloading or re-uploading
    // ──────────────────────────────────────────────
    const existingTrack = findCommunityTrackByVideoId(videoId);
    if (existingTrack && existingTrack.audioUrl) {
      return NextResponse.json({
        success: true,
        isDuplicate: true,
        message: "This song has already been imported! You can select and use it directly.",
        audioUrl: existingTrack.audioUrl,
        title: existingTrack.title,
        artist: existingTrack.artist,
        videoId: existingTrack.videoId,
        thumbnail: existingTrack.thumbnail,
        storage: existingTrack.storage || "local",
        track: existingTrack,
      });
    }

    // Determine storage target based on environment or explicit request
    const isCloudinaryConfigured = Boolean(
      (process.env.CLOUDINARY_URL || (process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET))
    );
    const shouldUseCloudinary =
      isCloudinaryConfigured &&
      (requestedStorage === "cloudinary" ||
        process.env.NODE_ENV === "production" ||
        process.env.AUDIO_STORAGE === "cloudinary" ||
        process.env.STORAGE_DRIVER === "cloudinary" ||
        Boolean(process.env.VERCEL));

    // Fetch video metadata via YouTube oEmbed (fast, lightweight, no API key required)
    let title = "YouTube Wedding Song";
    let artist = "YouTube Audio";
    let thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

    try {
      const oembedRes = await fetch(
        `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
        { next: { revalidate: 3600 } }
      );
      if (oembedRes.ok) {
        const oembedData = await oembedRes.json();
        if (oembedData.title) title = oembedData.title;
        if (oembedData.author_name) artist = oembedData.author_name;
        if (oembedData.thumbnail_url) thumbnail = oembedData.thumbnail_url;
      }
    } catch (e) {
      console.warn("oEmbed fetch warning:", e);
    }

    const outputFileName = `yt-${videoId}.mp3`;

    // ──────────────────────────────────────────────
    // 1. LOCAL STORAGE STRATEGY (Local Dev)
    // ──────────────────────────────────────────────
    if (!shouldUseCloudinary) {
      const publicAudioDir = path.join(process.cwd(), "public", "audio");
      const targetFilePath = path.join(publicAudioDir, outputFileName);
      const localAudioUrl = `/audio/${outputFileName}`;

      if (!fs.existsSync(publicAudioDir)) {
        fs.mkdirSync(publicAudioDir, { recursive: true });
      }

      // Check if already downloaded locally
      if (fs.existsSync(targetFilePath) && fs.statSync(targetFilePath).size > 50000) {
        const savedTrack = saveCommunityTrack({
          id: `yt-${videoId}`,
          videoId,
          title,
          artist,
          audioUrl: localAudioUrl,
          thumbnail,
          category: "universal",
          categoryLabel: "Community Imported",
          flag: "▶️",
          tag: "COMMUNITY",
          duration: "Full Audio",
          description: `Imported song: ${title}`,
          storage: "local",
        });

        return NextResponse.json({
          success: true,
          audioUrl: localAudioUrl,
          title,
          artist,
          videoId,
          thumbnail,
          storage: "local",
          cached: true,
          track: savedTrack,
        });
      }

      // Download directly to local storage
      const pythonExe = process.platform === "win32" ? "python" : "python3";
      const ytDlpArgs = [
        "-m",
        "yt_dlp",
        "-f",
        "ba/b",
        "--extractor-args",
        "youtube:player_client=ios,android,web",
        "--max-filesize",
        "35M",
        "--force-overwrites",
        "-o",
        targetFilePath,
        `https://www.youtube.com/watch?v=${videoId}`,
      ];

      const downloadSuccess = await new Promise<boolean>((resolve) => {
        const proc = spawn(pythonExe, ytDlpArgs, {
          timeout: 45000,
          stdio: ["ignore", "pipe", "pipe"],
        });

        let errOutput = "";
        proc.stderr.on("data", (data) => {
          errOutput += data.toString();
        });

        proc.on("close", (code) => {
          if (code === 0 && fs.existsSync(targetFilePath) && fs.statSync(targetFilePath).size > 50000) {
            resolve(true);
          } else {
            console.error(`yt-dlp local process failed (code ${code}):`, errOutput);
            resolve(false);
          }
        });

        proc.on("error", (err) => {
          console.error("Failed to start yt-dlp process:", err);
          resolve(false);
        });
      });

      if (!downloadSuccess) {
        return NextResponse.json(
          {
            success: false,
            error: "Unable to extract audio from this YouTube video. It may be private, age-restricted, or a live stream.",
          },
          { status: 500 }
        );
      }

      const savedTrack = saveCommunityTrack({
        id: `yt-${videoId}`,
        videoId,
        title,
        artist,
        audioUrl: localAudioUrl,
        thumbnail,
        category: "universal",
        categoryLabel: "Community Imported",
        flag: "▶️",
        tag: "COMMUNITY",
        duration: "Full Audio",
        description: `Imported song: ${title}`,
        storage: "local",
      });

      return NextResponse.json({
        success: true,
        audioUrl: localAudioUrl,
        title,
        artist,
        videoId,
        thumbnail,
        storage: "local",
        track: savedTrack,
      });
    }

    // ──────────────────────────────────────────────
    // 2. PRODUCTION CLOUDINARY STORAGE STRATEGY
    // ──────────────────────────────────────────────
    const tempFilePath = path.join(os.tmpdir(), `temp-${outputFileName}`);

    const pythonExe = process.platform === "win32" ? "python" : "python3";
    const ytDlpArgs = [
      "-m",
      "yt_dlp",
      "-f",
      "ba/b",
      "--extractor-args",
      "youtube:player_client=ios,android,web",
      "--max-filesize",
      "35M",
      "--force-overwrites",
      "-o",
      tempFilePath,
      `https://www.youtube.com/watch?v=${videoId}`,
    ];

    const downloadSuccess = await new Promise<boolean>((resolve) => {
      const proc = spawn(pythonExe, ytDlpArgs, {
        timeout: 45000,
        stdio: ["ignore", "pipe", "pipe"],
      });

      let errOutput = "";
      proc.stderr.on("data", (data) => {
        errOutput += data.toString();
      });

      proc.on("close", (code) => {
        if (code === 0 && fs.existsSync(tempFilePath) && fs.statSync(tempFilePath).size > 50000) {
          resolve(true);
        } else {
          console.error(`yt-dlp temp download failed (code ${code}):`, errOutput);
          resolve(false);
        }
      });

      proc.on("error", (err) => {
        console.error("Failed to start yt-dlp process:", err);
        resolve(false);
      });
    });

    if (!downloadSuccess) {
      return NextResponse.json(
        {
          success: false,
          error: "Unable to extract audio from this YouTube video for Cloudinary upload.",
        },
        { status: 500 }
      );
    }

    try {
      // Upload to Cloudinary under wedding-saas/audio/yt-[videoId]
      const uploadResult = await uploadAudioToCloudinary(
        tempFilePath,
        "wedding-saas/audio",
        `yt-${videoId}`
      );

      // Clean up temp file
      try {
        if (fs.existsSync(tempFilePath)) {
          fs.unlinkSync(tempFilePath);
        }
      } catch (cleanupErr) {
        console.warn("Temp file cleanup error:", cleanupErr);
      }

      const savedTrack = saveCommunityTrack({
        id: `yt-${videoId}`,
        videoId,
        title,
        artist,
        audioUrl: uploadResult.secure_url,
        thumbnail,
        category: "universal",
        categoryLabel: "Community Imported",
        flag: "☁️",
        tag: "CLOUDINARY",
        duration: uploadResult.duration ? `${Math.floor(uploadResult.duration / 60)}:${Math.floor(uploadResult.duration % 60).toString().padStart(2, "0")}` : "Full Audio",
        description: `Imported song: ${title}`,
        storage: "cloudinary",
      });

      return NextResponse.json({
        success: true,
        audioUrl: uploadResult.secure_url,
        title,
        artist,
        videoId,
        thumbnail,
        storage: "cloudinary",
        publicId: uploadResult.public_id,
        track: savedTrack,
      });
    } catch (uploadErr: any) {
      console.error("Cloudinary audio upload error:", uploadErr);
      // Clean up temp file
      if (fs.existsSync(tempFilePath)) {
        try {
          fs.unlinkSync(tempFilePath);
        } catch (_) {}
      }
      return NextResponse.json(
        {
          success: false,
          error: "Failed to upload audio to Cloudinary: " + (uploadErr.message || "Unknown error"),
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("YouTube Audio API error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
