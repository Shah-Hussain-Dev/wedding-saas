import fs from "fs";
import path from "path";

export interface CommunityTrackItem {
  id: string;
  videoId: string;
  title: string;
  artist: string;
  audioUrl: string;
  thumbnail?: string;
  category: "indian" | "pakistani" | "sufi" | "classical" | "universal";
  categoryLabel: string;
  flag: string;
  tag?: string;
  duration?: string;
  description?: string;
  storage?: "local" | "cloudinary";
  createdAt: string;
}

const DATA_FILE_PATH = path.join(process.cwd(), "data", "community-tracks.json");

/**
 * Get all community imported tracks
 */
export function getCommunityTracks(): CommunityTrackItem[] {
  try {
    if (!fs.existsSync(DATA_FILE_PATH)) {
      const dataDir = path.dirname(DATA_FILE_PATH);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE_PATH, JSON.stringify([], null, 2), "utf8");
      return [];
    }
    const raw = fs.readFileSync(DATA_FILE_PATH, "utf8");
    return JSON.parse(raw) as CommunityTrackItem[];
  } catch (error) {
    console.error("Error reading community tracks:", error);
    return [];
  }
}

/**
 * Find an existing imported track by its YouTube video ID
 */
export function findCommunityTrackByVideoId(videoId: string): CommunityTrackItem | null {
  const tracks = getCommunityTracks();
  return tracks.find((t) => t.videoId === videoId || t.id === `yt-${videoId}`) || null;
}

/**
 * Save or update a community imported track
 */
export function saveCommunityTrack(track: Omit<CommunityTrackItem, "createdAt">): CommunityTrackItem {
  try {
    const tracks = getCommunityTracks();
    const existingIndex = tracks.findIndex(
      (t) => t.id === track.id || t.videoId === track.videoId || t.audioUrl === track.audioUrl
    );

    const fullTrack: CommunityTrackItem = {
      ...track,
      createdAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      tracks[existingIndex] = {
        ...tracks[existingIndex],
        ...fullTrack,
      };
    } else {
      // Prepend so the newest imported tracks appear first
      tracks.unshift(fullTrack);
    }

    const dataDir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(tracks, null, 2), "utf8");
    return fullTrack;
  } catch (error) {
    console.error("Error saving community track:", error);
    return {
      ...track,
      createdAt: new Date().toISOString(),
    };
  }
}
