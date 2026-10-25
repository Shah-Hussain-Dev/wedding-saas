import { CulturalTradition } from "./pdf-theme-tokens";

export type GalleryArtworkCategory = 
  | "anime"
  | "royal"
  | "garden"
  | "starlit"
  | "minimal";

export interface GalleryLibraryItem {
  id: string;
  title: string;
  subtitle: string;
  category: GalleryArtworkCategory;
  categoryLabel: string;
  religion: CulturalTradition | "all";
  traditionLabel: string;
  traditionIcon: string;
  aspectRatio: "3:4" | "1:1" | "4:3";
  url: string;
  thumbnailUrl: string;
  tags: string[];
  description: string;
  isPopular?: boolean;
}

export const GALLERY_COLLECTIONS: { id: string; label: string; icon: string }[] = [
  { id: "all", label: "All Artwork", icon: "✨" },
  { id: "anime", label: "Anime Romance", icon: "🎨" },
  { id: "royal", label: "Royal & Sacred Heritage", icon: "🏰" },
  { id: "garden", label: "Garden & Nature", icon: "🌿" },
  { id: "starlit", label: "Starlit & Celestial", icon: "🌙" },
];

export const GALLERY_TRADITION_FILTERS: { id: CulturalTradition | "all"; label: string; icon: string }[] = [
  { id: "all", label: "All Traditions", icon: "🌐" },
  { id: "universal", label: "Universal & Contemporary", icon: "💫" },
  { id: "muslim", label: "Muslim Sacred Nikah", icon: "☪️" },
  { id: "hindu", label: "Hindu Vedic Vivah", icon: "🕉️" },
];

export const CURATED_GALLERY_LIBRARY: GalleryLibraryItem[] = [
  // ── MUSLIM TRADITIONS & ANIME ──
  {
    id: "muslim-anime-swing",
    title: "Mountain Brook Swing",
    subtitle: "Joyful 3D Anime Romance",
    category: "anime",
    categoryLabel: "Anime Romance",
    religion: "muslim",
    traditionLabel: "Muslim Tradition",
    traditionIcon: "☪️",
    aspectRatio: "3:4",
    url: "/images/gallery-library/anime/muslim-anime-swing.webp",
    thumbnailUrl: "/images/gallery-library/anime/muslim-anime-swing-thumb.webp",
    tags: ["3D Anime", "Nature", "River Swing", "Alpine", "Modest Bridal", "Pixar Style"],
    description: "Whimsical 3D couple seated together on a wooden swing above a sparkling alpine stream, smiling tenderly.",
    isPopular: true,
  },
  {
    id: "ocean-rose-whispers",
    title: "Ocean Whispers & Red Roses",
    subtitle: "2D Manhwa Coastal Romance",
    category: "anime",
    categoryLabel: "Anime Romance",
    religion: "muslim",
    traditionLabel: "Muslim / Universal",
    traditionIcon: "☪️",
    aspectRatio: "3:4",
    url: "/images/gallery-library/anime/ocean-rose-whispers.webp",
    thumbnailUrl: "/images/gallery-library/anime/ocean-rose-whispers-thumb.webp",
    tags: ["2D Anime", "Manhwa", "Beach", "Roses Surprise", "Floral Hijab", "Watercolor"],
    description: "Gentle coastal breeze and pastel watercolor waves as the groom surprises his bride with velvet red roses.",
    isPopular: true,
  },
  {
    id: "sacred-palace-colonnade",
    title: "Sacred Palace Colonnade",
    subtitle: "Illuminated Vows in Marble Arch",
    category: "royal",
    categoryLabel: "Royal & Sacred",
    religion: "muslim",
    traditionLabel: "Muslim Tradition",
    traditionIcon: "☪️",
    aspectRatio: "3:4",
    url: "/images/gallery-library/muslim/sacred-palace-colonnade.webp",
    thumbnailUrl: "/images/gallery-library/muslim/sacred-palace-colonnade-thumb.webp",
    tags: ["Sacred Vows", "Marble Colonnade", "Quran", "Imperial Mosque", "Ivory Silk", "Sunlit Arches"],
    description: "Couple kneeling peacefully on an ornate Persian carpet inside a sunlit marble palace colonnade, reading holy verses.",
    isPopular: true,
  },
  {
    id: "walima-twilight-garden",
    title: "Walima Twilight Promenade",
    subtitle: "Mughal Courtyard & Fountains",
    category: "garden",
    categoryLabel: "Garden & Nature",
    religion: "muslim",
    traditionLabel: "Muslim Tradition",
    traditionIcon: "☪️",
    aspectRatio: "3:4",
    url: "/images/gallery-library/muslim/walima-twilight-garden.webp",
    thumbnailUrl: "/images/gallery-library/muslim/walima-twilight-garden-thumb.webp",
    tags: ["Dawat-e-Walima", "Emerald Sherwani", "Fountains", "Crescent Moon", "Lanterns", "Mughal Garden"],
    description: "Splendid dusk promenade through illuminated palace gardens, fountains, and glowing brass lanterns under a crescent moon.",
    isPopular: false,
  },

  // ── HINDU TRADITIONS & ROYAL COURTS ──
  {
    id: "haveli-royal-vivah",
    title: "Haveli Courtyard Vivah",
    subtitle: "Golden Hour Jaimala Ceremony",
    category: "royal",
    categoryLabel: "Royal & Sacred",
    religion: "hindu",
    traditionLabel: "Hindu Tradition",
    traditionIcon: "🕉️",
    aspectRatio: "3:4",
    url: "/images/gallery-library/hindu/haveli-royal-vivah.webp",
    thumbnailUrl: "/images/gallery-library/hindu/haveli-royal-vivah-thumb.webp",
    tags: ["Royal Haveli", "Jaimala", "Crimson Lehenga", "Safa Turban", "Golden Hour", "Diyas"],
    description: "Regal couple embracing on a Rajasthani palace terrace during golden hour sunset with fragrant rose jaimala garlands.",
    isPopular: true,
  },
  {
    id: "vedic-mandap-ceremony",
    title: "Sacred Vedic Mandap",
    subtitle: "Marigold Canopy & Holy Fire",
    category: "royal",
    categoryLabel: "Royal & Sacred",
    religion: "hindu",
    traditionLabel: "Hindu Tradition",
    traditionIcon: "🕉️",
    aspectRatio: "3:4",
    url: "/images/gallery-library/hindu/vedic-mandap-ceremony.webp",
    thumbnailUrl: "/images/gallery-library/hindu/vedic-mandap-ceremony-thumb.webp",
    tags: ["Vedic Mandap", "Hawan Kund", "Marigolds", "Sacred Agni", "Rani Pink Lehenga", "Blessings"],
    description: "Sacred matrimonial union under an opulent marigold floral canopy with sacred fire offerings and divine chants.",
    isPopular: true,
  },
  {
    id: "lotus-courtyard-sangeet",
    title: "Lotus Courtyard Celebration",
    subtitle: "Joyful Sangeet Dance & Diyas",
    category: "garden",
    categoryLabel: "Garden & Nature",
    religion: "hindu",
    traditionLabel: "Hindu Tradition",
    traditionIcon: "🕉️",
    aspectRatio: "3:4",
    url: "/images/gallery-library/hindu/lotus-courtyard-sangeet.webp",
    thumbnailUrl: "/images/gallery-library/hindu/lotus-courtyard-sangeet-thumb.webp",
    tags: ["Sangeet", "Lotus Diyas", "Mustard Lehenga", "Joyful Dance", "Fairy Lights", "Flower Shower"],
    description: "Exuberant couple dancing in a palace courtyard illuminated by floating lotus lamps, flower showers, and celebration.",
    isPopular: false,
  },

  // ── UNIVERSAL & CONTEMPORARY ROMANCE ──
  {
    id: "starlit-celestial-pier",
    title: "Starlit Pier & Aurora",
    subtitle: "Nocturnal Lake & Lantern Pavilion",
    category: "starlit",
    categoryLabel: "Starlit & Celestial",
    religion: "universal",
    traditionLabel: "Universal",
    traditionIcon: "💫",
    aspectRatio: "3:4",
    url: "/images/gallery-library/universal/starlit-celestial-pier.webp",
    thumbnailUrl: "/images/gallery-library/universal/starlit-celestial-pier-thumb.webp",
    tags: ["Aurora", "Constellations", "Wooden Pier", "Water Lilies", "Lanterns", "Celestial Romance"],
    description: "Breathtaking night scene under aurora borealis and glowing constellations, seated on a tranquil water boardwalk.",
    isPopular: true,
  },
  {
    id: "botanical-glasshouse-promenade",
    title: "Botanical Glasshouse Conservatory",
    subtitle: "Cascading Wisteria & Fairy Lights",
    category: "garden",
    categoryLabel: "Garden & Nature",
    religion: "universal",
    traditionLabel: "Universal",
    traditionIcon: "💫",
    aspectRatio: "3:4",
    url: "/images/gallery-library/universal/botanical-glasshouse-promenade.webp",
    thumbnailUrl: "/images/gallery-library/universal/botanical-glasshouse-promenade-thumb.webp",
    tags: ["Victorian Conservatory", "Wisteria", "White Roses", "Tuxedo", "Lace Gown", "Fairytale"],
    description: "Enchanting couple walking hand-in-hand inside a Victorian botanical glass conservatory draped in purple wisteria.",
    isPopular: true,
  },
];

/**
 * Filter gallery artwork based on selected tradition and category
 */
export function filterGalleryArtwork(
  tradition: CulturalTradition | "all" = "all",
  collection: string = "all",
  searchQuery: string = ""
): GalleryLibraryItem[] {
  let filtered = [...CURATED_GALLERY_LIBRARY];

  // Tradition filter: if not 'all', show items matching tradition OR universal items
  if (tradition !== "all") {
    filtered = filtered.filter(
      (item) => item.religion === tradition || item.religion === "universal" || item.religion === "all"
    );
  }

  // Category collection filter
  if (collection !== "all") {
    filtered = filtered.filter((item) => item.category === collection);
  }

  // Search query filter
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    filtered = filtered.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  return filtered;
}
