// data.js — everything that is "content" lives here, so adding a faith,
// theme or template never requires touching the UI code.

export const uid = () => Math.random().toString(36).slice(2, 9);

/** A5 portrait. All page content is sized in em, so the layout scales with --fit. */
export const PAGE_MM = { w: 148, h: 210 };
export const PAGE_PX = { w: (148 * 96) / 25.4, h: (210 * 96) / 25.4 };

export const GOOGLE_FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Allura&family=Amiri:wght@400;700" +
  "&family=Cinzel:wght@400;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600" +
  "&family=Crimson+Text:ital@0;1&family=Dancing+Script:wght@500&family=EB+Garamond:ital@0;1" +
  "&family=Great+Vibes&family=Josefin+Sans:wght@300;400;600&family=Lato:wght@300;400;700" +
  "&family=Lora:ital,wght@0,400;0,600;1,400&family=Marcellus&family=Montserrat:wght@400;500;600;700" +
  "&family=Noto+Serif+Gurmukhi&family=Pinyon+Script&family=Playfair+Display:ital,wght@0,400;0,600;1,400" +
  "&family=Tiro+Devanagari+Hindi:ital@0;1&display=swap";

/** Fonts used for the invocation line, chosen by script. */
export const SCRIPT_FONTS = {
  latin: null,
  deva: "'Tiro Devanagari Hindi', serif",
  arabic: "'Amiri', serif",
  gurmukhi: "'Noto Serif Gurmukhi', serif",
};

export const FONT_SETS = {
  classic: { label: "Classic Royal Script", display: "'Great Vibes', cursive", heading: "'Cinzel', serif", body: "'Cormorant Garamond', serif" },
  elegant: { label: "Regency Elegance", display: "'Pinyon Script', cursive", heading: "'Playfair Display', serif", body: "'Lora', serif" },
  romantic: { label: "Romantic Heritage", display: "'Allura', cursive", heading: "'Marcellus', serif", body: "'EB Garamond', serif" },
  rustic: { label: "Rustic Garden", display: "'Dancing Script', cursive", heading: "'Josefin Sans', sans-serif", body: "'Crimson Text', serif" },
  modern: { label: "Modern Editorial", display: "'Playfair Display', serif", heading: "'Montserrat', sans-serif", body: "'Lato', sans-serif" },
  artdeco: { label: "Art Deco Grandeur", display: "'Cinzel', serif", heading: "'Marcellus', serif", body: "'Cormorant Garamond', serif" },
  editorial: { label: "Haute Couture", display: "'Playfair Display', serif", heading: "'Cinzel', serif", body: "'Montserrat', sans-serif" },
};

// bg/bg2: page gradient · ink: body text · accent: names & headings
// accent2: secondary/gold · card: event card fill
export const THEMES = {
  // ── Original Classic Palettes ──
  maroonGold: { label: "Maroon & gold", bg: "#fbf6ea", bg2: "#f1e4c8", ink: "#4a3a30", accent: "#6b1d2a", accent2: "#b8923f", card: "rgba(255,255,255,.55)" },
  saffron: { label: "Saffron", bg: "#fff8ec", bg2: "#ffe5bd", ink: "#4a2f1b", accent: "#b93a0c", accent2: "#d99a1e", card: "rgba(255,255,255,.55)" },
  emerald: { label: "Emerald", bg: "#f4f8f2", bg2: "#dbe9dc", ink: "#1f3a2e", accent: "#0f5b45", accent2: "#b8963f", card: "rgba(255,255,255,.6)" },
  midnight: { label: "Midnight & gold", bg: "#14213d", bg2: "#0b1429", ink: "#efe6cf", accent: "#e6c97a", accent2: "#c9a24b", card: "rgba(255,255,255,.07)" },
  ivoryBlush: { label: "Ivory blush", bg: "#fdf9f6", bg2: "#f4e2de", ink: "#4b3b3b", accent: "#a05a55", accent2: "#c9a7a0", card: "rgba(255,255,255,.65)" },
  sage: { label: "Sage garden", bg: "#f6f8f3", bg2: "#dfe8d6", ink: "#37442f", accent: "#52704a", accent2: "#a98f5a", card: "rgba(255,255,255,.6)" },
  royalBlue: { label: "Royal blue", bg: "#f7f9ff", bg2: "#dde6fa", ink: "#1c2b4a", accent: "#1e3a8a", accent2: "#d99a1a", card: "rgba(255,255,255,.65)" },
  rose: { label: "Rose", bg: "#fff5f7", bg2: "#fbdce5", ink: "#5a2a3a", accent: "#b0145a", accent2: "#cf9b6a", card: "rgba(255,255,255,.6)" },
  plum: { label: "Plum", bg: "#faf5fa", bg2: "#e8d9ea", ink: "#3e2a44", accent: "#65286f", accent2: "#c2964d", card: "rgba(255,255,255,.6)" },
  mono: { label: "Monochrome", bg: "#ffffff", bg2: "#efefef", ink: "#222222", accent: "#111111", accent2: "#7a7a7a", card: "rgba(0,0,0,.03)" },

  // ── Luxury 3D Palettes Matched Directly from Your 7 Wedding Templates ──
  sheeshMahal: { label: "Sheesh Mahal Emerald & Gold", bg: "#f5f8f5", bg2: "#d9e8df", ink: "#0b3d31", accent: "#0b4a3b", accent2: "#c9a45c", card: "rgba(255,255,255,.7)" },
  sheeshMahalDark: { label: "Sheesh Mahal Night Palace", bg: "#062a21", bg2: "#03170f", ink: "#f5efe2", accent: "#e6cf98", accent2: "#c9a45c", card: "rgba(255,255,255,.06)" },
  royalMajesty: { label: "Royal Majesty Powder Blue", bg: "#f6f9fc", bg2: "#dbe6ed", ink: "#1c2e3d", accent: "#4e687a", accent2: "#b7a16e", card: "rgba(255,255,255,.75)" },
  royalLotus: { label: "Royal Lotus Mandapam", bg: "#fcf9f2", bg2: "#f5ebd8", ink: "#3a2a1c", accent: "#6e1b2a", accent2: "#c9a227", card: "rgba(255,255,255,.7)" },
  royalHeritage: { label: "Royal Heritage Rajput Arch", bg: "#fbf7f2", bg2: "#ede3d8", ink: "#153e4b", accent: "#315f6b", accent2: "#d95147", card: "rgba(255,255,255,.7)" },
  royalGrace: { label: "Royal Grace Mehndi Sage", bg: "#f7f5ee", bg2: "#e5e2d4", ink: "#2c3022", accent: "#4b4d34", accent2: "#9a7a49", card: "rgba(255,255,255,.7)" },
  royalElegance: { label: "Royal Elegance Crimson Royale", bg: "#fdf8f0", bg2: "#f3e6d3", ink: "#38080f", accent: "#5a0e1a", accent2: "#d4af37", card: "rgba(255,255,255,.75)" },
  roseGoldBlush: { label: "Rose Gold Twilight Navy", bg: "#faf6f4", bg2: "#ede0dc", ink: "#17334f", accent: "#8d5b5c", accent2: "#c5a46a", card: "rgba(255,255,255,.7)" },
  champagneOyster: { label: "Champagne Oyster Pearl", bg: "#fdfbf7", bg2: "#f3ece0", ink: "#3c352d", accent: "#7a5c32", accent2: "#c4a36e", card: "rgba(255,255,255,.7)" },
  artDecoNoir: { label: "Art Deco Noir Gold", bg: "#15171c", bg2: "#0c0e12", ink: "#f2ede4", accent: "#e6c775", accent2: "#b39144", card: "rgba(255,255,255,.07)" },
  celestialMidnight: { label: "Celestial Midnight Navy", bg: "#0d1527", bg2: "#060a14", ink: "#e8effc", accent: "#8eb5f0", accent2: "#d4b358", card: "rgba(255,255,255,.08)" },

  // ── Scenic & Illustrated Themes (Matching Pinterest Collection) ──
  verandaSunset: { label: "Royal Veranda Sunset", bg: "#fdf8f4", bg2: "#f9e7d2", ink: "#3d2214", accent: "#9a3412", accent2: "#d97706", card: "rgba(255,255,255,.7)" },
  lotusPinkGold: { label: "Sacred Lotus Pink & Gold", bg: "#fef8f9", bg2: "#fbe4ec", ink: "#441a24", accent: "#9d174d", accent2: "#c99a2e", card: "rgba(255,255,255,.75)" },
  roseMarbleCream: { label: "Classical Rose & Marble", bg: "#fdfbf7", bg2: "#f6ede2", ink: "#382318", accent: "#7c2d12", accent2: "#b45309", card: "rgba(255,255,255,.7)" },
  templeGoldCrimson: { label: "Temple Gold & Crimson", bg: "#fef9ee", bg2: "#f8e6c4", ink: "#451a03", accent: "#991b1b", accent2: "#d97706", card: "rgba(255,255,255,.75)" },
  azureSkySandstone: { label: "Azure Sky & Sandstone", bg: "#f4f9fd", bg2: "#dcebf7", ink: "#123048", accent: "#1e40af", accent2: "#ca8a04", card: "rgba(255,255,255,.75)" },
};

/** Frame/ornament families. Each is an SVG drawn in pages.jsx. */
export const LAYOUTS = {
  royal: "Royal double border",
  arch: "Mandap arch",
  geometric: "Geometric stars",
  floral: "Floral corners",
  minimal: "Minimal line",
  banner: "Colour bands",
  artdeco: "Art Deco Gatsby",
  celestial: "Celestial starlight",
  botanical: "Botanical olive vines",
  baroque: "Baroque heritage scroll",
  palaceArch: "Mughal palace jharokha",
  modernEdge: "Modern architectural edge",
  // ── 3D Architectural Layouts ──
  sheeshMirror: "Sheesh Mahal 3D Mirror Jharokha",
  lotusTemple: "Royal Lotus 3D Mandapam Arch",
  majestyBezel: "Royal Majesty 3D Regency Bevel",
  heritageSandstone: "Royal Heritage 3D Rajput Lattice",
  graceMehndi: "Royal Grace 3D Olive Cartouche",
  crimsonGoldCrest: "Royal Elegance 3D Gold Crest",
  twilightRose: "Rose Gold 3D Twilight Seal",
  // ── Scenic Illustrated Layouts ──
  scenicVeranda: "Royal Veranda Sunset Mandap",
  lotusJharokha: "Sacred Lotus Marble Jharokha",
  functionVignettes: "Functions Itinerary & Vignettes",
  chhatriGrove: "Royal Chhatri Umbrella Grove",
  rosePavilion: "Classical Rose Marble Pavilion",
  templeBells: "Swinging Temple Bells & Havelis",
};

export const MOTIFS = {
  lotus: "Lotus",
  star: "Eight-point star",
  cross: "Cross",
  diamond: "Diamond",
  monogram: "Couple monogram crest",
  sunburst: "Art Deco sunburst",
  olive: "Olive branch laurel",
  crescent: "Celestial crescent & star",
  peacock: "Peacock royal plume",
  knot: "Sacred infinity knot",
  none: "None",
};

// Universal constant guaranteeing all religions and secular weddings can use universal templates
export const ALL_FAITHS = ["universal", "hindu", "muslim", "christian", "sikh", "interfaith"];

/**
 * Ready-made starting points. Every single template defaults to either 2 or 3 pages maximum!
 * structure: "2-page" (Cover + Integrated Celebration & Venue)
 * structure: "3-page" (Cover + Families & Events + Venue & Blessings)
 */
export const TEMPLATES = [
  // ── 7 Signature 3D Templates Directly Matched to Your Wedding Themes ──
  {
    id: "sheesh-mahal-3d",
    name: "Sheesh Mahal 3D Palace",
    structure: "3-page",
    category: "royal",
    faiths: ALL_FAITHS,
    layout: "sheeshMirror",
    themeId: "sheeshMahal",
    fontId: "classic",
    motif: "peacock",
    defaultPages: { cover: true, families: true, venue: true, combined: false },
  },
  {
    id: "royal-majesty-3d",
    name: "Royal Majesty 3D Ballroom",
    structure: "2-page",
    category: "royal",
    faiths: ALL_FAITHS,
    layout: "majestyBezel",
    themeId: "royalMajesty",
    fontId: "elegant",
    motif: "monogram",
    defaultPages: { cover: true, combined: true, families: false, venue: false },
  },
  {
    id: "royal-lotus-3d",
    name: "Royal Lotus 3D Mandapam",
    structure: "3-page",
    category: "royal",
    faiths: ALL_FAITHS,
    layout: "lotusTemple",
    themeId: "royalLotus",
    fontId: "classic",
    motif: "lotus",
    defaultPages: { cover: true, families: true, venue: true, combined: false },
  },
  {
    id: "royal-heritage-3d",
    name: "Royal Heritage 3D Rajputana",
    structure: "3-page",
    category: "royal",
    faiths: ALL_FAITHS,
    layout: "heritageSandstone",
    themeId: "royalHeritage",
    fontId: "romantic",
    motif: "peacock",
    defaultPages: { cover: true, families: true, venue: true, combined: false },
  },
  {
    id: "royal-grace-3d",
    name: "Royal Grace 3D Sage",
    structure: "2-page",
    category: "botanical",
    faiths: ALL_FAITHS,
    layout: "graceMehndi",
    themeId: "royalGrace",
    fontId: "rustic",
    motif: "olive",
    defaultPages: { cover: true, combined: true, families: false, venue: false },
  },
  {
    id: "royal-elegance-3d",
    name: "Royal Elegance 3D Crimson",
    structure: "2-page",
    category: "royal",
    faiths: ALL_FAITHS,
    layout: "crimsonGoldCrest",
    themeId: "royalElegance",
    fontId: "classic",
    motif: "knot",
    defaultPages: { cover: true, combined: true, families: false, venue: false },
  },
  {
    id: "rose-gold-blush-3d",
    name: "Rose Gold 3D Twilight",
    structure: "2-page",
    category: "universal",
    faiths: ALL_FAITHS,
    layout: "twilightRose",
    themeId: "roseGoldBlush",
    fontId: "romantic",
    motif: "crescent",
    defaultPages: { cover: true, combined: true, families: false, venue: false },
  },

  // ── Universal Multi-Faith & Modern Masterpieces (2-3 Pages Max) ──
  {
    id: "art-deco-grandeur",
    name: "Art Deco Grandeur",
    structure: "2-page",
    category: "universal",
    faiths: ALL_FAITHS,
    layout: "artdeco",
    themeId: "artDecoNoir",
    fontId: "artdeco",
    motif: "sunburst",
    defaultPages: { cover: true, combined: true, families: false, venue: false },
  },
  {
    id: "tuscan-botanical",
    name: "Tuscan Botanical",
    structure: "3-page",
    category: "botanical",
    faiths: ALL_FAITHS,
    layout: "botanical",
    themeId: "royalGrace",
    fontId: "rustic",
    motif: "olive",
    defaultPages: { cover: true, families: true, venue: true, combined: false },
  },
  {
    id: "celestial-starlight",
    name: "Celestial Starlight",
    structure: "2-page",
    category: "universal",
    faiths: ALL_FAITHS,
    layout: "celestial",
    themeId: "celestialMidnight",
    fontId: "elegant",
    motif: "crescent",
    defaultPages: { cover: true, combined: true, families: false, venue: false },
  },
  {
    id: "minimalist-editorial",
    name: "Minimalist Editorial",
    structure: "2-page",
    category: "modern",
    faiths: ALL_FAITHS,
    layout: "modernEdge",
    themeId: "mono",
    fontId: "modern",
    motif: "monogram",
    defaultPages: { cover: true, combined: true, families: false, venue: false },
  },
  {
    id: "champagne-monogram",
    name: "Champagne Bespoke",
    structure: "2-page",
    category: "modern",
    faiths: ALL_FAITHS,
    layout: "modernEdge",
    themeId: "champagneOyster",
    fontId: "editorial",
    motif: "monogram",
    defaultPages: { cover: true, combined: true, families: false, venue: false },
  },
  {
    id: "baroque-heritage",
    name: "Baroque Heritage",
    structure: "3-page",
    category: "classic",
    faiths: ALL_FAITHS,
    layout: "baroque",
    themeId: "royalElegance",
    fontId: "romantic",
    motif: "knot",
    defaultPages: { cover: true, families: true, venue: true, combined: false },
  },
  {
    id: "boho-sunburst",
    name: "Boho Golden Hour",
    structure: "2-page",
    category: "universal",
    faiths: ALL_FAITHS,
    layout: "artdeco",
    themeId: "saffron",
    fontId: "rustic",
    motif: "sunburst",
    defaultPages: { cover: true, combined: true, families: false, venue: false },
  },
  {
    id: "coastal-riviera",
    name: "French Riviera",
    structure: "3-page",
    category: "botanical",
    faiths: ALL_FAITHS,
    layout: "floral",
    themeId: "royalMajesty",
    fontId: "elegant",
    motif: "olive",
    defaultPages: { cover: true, families: true, venue: true, combined: false },
  },

  // ── 6 Scenic Illustrated & Vignette Masterpieces (Matching Reference Collection) ──
  {
    id: "scenic-veranda",
    name: "Royal Veranda Reception",
    structure: "2-page",
    category: "scenic",
    faiths: ALL_FAITHS,
    layout: "scenicVeranda",
    themeId: "verandaSunset",
    fontId: "classic",
    motif: "monogram",
    defaultPages: { cover: true, combined: true, families: false, venue: false },
  },
  {
    id: "scenic-lotus-jharokha",
    name: "Sacred Lotus Jharokha",
    structure: "2-page",
    category: "scenic",
    faiths: ALL_FAITHS,
    layout: "lotusJharokha",
    themeId: "lotusPinkGold",
    fontId: "romantic",
    motif: "lotus",
    defaultPages: { cover: true, combined: true, families: false, venue: false },
  },
  {
    id: "scenic-functions-vignette",
    name: "The Functions Itinerary",
    structure: "3-page",
    category: "scenic",
    faiths: ALL_FAITHS,
    layout: "functionVignettes",
    themeId: "royalMajesty",
    fontId: "elegant",
    motif: "peacock",
    defaultPages: { cover: true, families: true, venue: true, combined: false },
  },
  {
    id: "scenic-chhatri-grove",
    name: "Chhatri & Palm Grove",
    structure: "2-page",
    category: "scenic",
    faiths: ALL_FAITHS,
    layout: "chhatriGrove",
    themeId: "saffron",
    fontId: "rustic",
    motif: "sunburst",
    defaultPages: { cover: true, combined: true, families: false, venue: false },
  },
  {
    id: "scenic-rose-pavilion",
    name: "Classical Rose Marble Pavilion",
    structure: "3-page",
    category: "scenic",
    faiths: ALL_FAITHS,
    layout: "rosePavilion",
    themeId: "roseMarbleCream",
    fontId: "classic",
    motif: "knot",
    defaultPages: { cover: true, families: true, venue: true, combined: false },
  },
  {
    id: "scenic-temple-bells",
    name: "Golden Temple Bells & Havelis",
    structure: "2-page",
    category: "scenic",
    faiths: ALL_FAITHS,
    layout: "templeBells",
    themeId: "templeGoldCrimson",
    fontId: "classic",
    motif: "star",
    defaultPages: { cover: true, combined: true, families: false, venue: false },
  },
];

/**
 * 3D & Realistic Decorative Elements Library
 * Users can pick, place, drag, scale, and edit these directly in the live preview (Canva-style).
 */
export const ELEMENT_LIBRARY = [
  // ── 1. Temple Bells & Chains ──
  {
    id: "bells-hanging-pair",
    category: "bells",
    name: "Swinging Golden Bells",
    icon: "🔔",
    defaultProps: { x: 50, y: 12, scale: 1, rotate: 0 },
    width: 140,
    height: 60,
  },
  {
    id: "bell-corner-single",
    category: "bells",
    name: "Corner Brass Bell",
    icon: "🔕",
    defaultProps: { x: 18, y: 14, scale: 0.9, rotate: -5 },
    width: 60,
    height: 70,
  },

  // ── 2. Carved Arches & Mandaps ──
  {
    id: "arch-mughal-crest",
    category: "arches",
    name: "Mughal Carved Arch Top",
    icon: "🏛️",
    defaultProps: { x: 50, y: 15, scale: 1, rotate: 0 },
    width: 160,
    height: 70,
  },
  {
    id: "arch-rose-marble-header",
    category: "arches",
    name: "Pink Rose Garland Arch",
    icon: "🌸",
    defaultProps: { x: 50, y: 14, scale: 1.05, rotate: 0 },
    width: 170,
    height: 65,
  },

  // ── 3. Royal Flora & Lotuses ──
  {
    id: "flora-lotus-bloom",
    category: "flora",
    name: "Blooming Pink Lotus",
    icon: "🪷",
    defaultProps: { x: 80, y: 84, scale: 1, rotate: 0 },
    width: 75,
    height: 75,
  },
  {
    id: "flora-lotus-pair-bottom",
    category: "flora",
    name: "Dual Lotus Corner Base",
    icon: "🌺",
    defaultProps: { x: 50, y: 90, scale: 1, rotate: 0 },
    width: 150,
    height: 55,
  },
  {
    id: "flora-marigold-toran",
    category: "flora",
    name: "Marigold Toran Festoon",
    icon: "🌼",
    defaultProps: { x: 50, y: 8, scale: 1, rotate: 0 },
    width: 160,
    height: 38,
  },
  {
    id: "flora-banana-palm",
    category: "flora",
    name: "Tropical Banana Palm",
    icon: "🌴",
    defaultProps: { x: 15, y: 82, scale: 1, rotate: 0 },
    width: 75,
    height: 90,
  },

  // ── 4. Royal Accents & 3D Props ──
  {
    id: "accent-royal-chhatri",
    category: "accents",
    name: "Velvet Royal Chhatri",
    icon: "☂️",
    defaultProps: { x: 50, y: 22, scale: 1, rotate: 0 },
    width: 90,
    height: 80,
  },
  {
    id: "accent-moroccan-lantern",
    category: "accents",
    name: "Hanging Brass Lantern",
    icon: "🏮",
    defaultProps: { x: 82, y: 18, scale: 0.95, rotate: 0 },
    width: 48,
    height: 95,
  },
  {
    id: "accent-royal-peacock",
    category: "accents",
    name: "Royal Golden Peacock",
    icon: "🦚",
    defaultProps: { x: 50, y: 86, scale: 0.95, rotate: 0 },
    width: 95,
    height: 65,
  },
  {
    id: "accent-wax-seal-gold",
    category: "accents",
    name: "3D Gold Monogram Wax Seal",
    icon: "🪙",
    defaultProps: { x: 50, y: 50, scale: 1, rotate: 0 },
    width: 65,
    height: 65,
  },
  {
    id: "accent-diya-glow",
    category: "accents",
    name: "Sacred Brass Diya with Glow",
    icon: "🪔",
    defaultProps: { x: 50, y: 88, scale: 1, rotate: 0 },
    width: 60,
    height: 50,
  },

  // ── 5. Ceremony Vignettes (Illustrated Moments) ──
  {
    id: "vignette-haldi-moment",
    category: "vignettes",
    name: "Haldi Yellow Swing Vignette",
    icon: "💛",
    defaultProps: { x: 50, y: 45, scale: 1, rotate: 0 },
    width: 110,
    height: 90,
  },
  {
    id: "vignette-mehndi-moment",
    category: "vignettes",
    name: "Henna Mehndi Art Vignette",
    icon: "💚",
    defaultProps: { x: 50, y: 45, scale: 1, rotate: 0 },
    width: 110,
    height: 90,
  },
  {
    id: "vignette-sangeet-moment",
    category: "vignettes",
    name: "Sangeet Dance Duo Vignette",
    icon: "💙",
    defaultProps: { x: 50, y: 45, scale: 1, rotate: 0 },
    width: 110,
    height: 90,
  },
  {
    id: "vignette-wedding-moment",
    category: "vignettes",
    name: "Sacred Vivah Mandap Vignette",
    icon: "❤️",
    defaultProps: { x: 50, y: 45, scale: 1, rotate: 0 },
    width: 110,
    height: 90,
  },
];

/** Tokens {bride} and {groom} in message text are replaced at render time. NO RSVP BLOCKS! */
export const FAITHS = {
  universal: {
    label: "Universal / Contemporary",
    heading: "The Wedding Celebration",
    tagline: "Together with their cherished families",
    invocation: { text: "✦  Two lives, two hearts, joined in friendship, united forever in love  ✦", sub: "", script: "latin", enabled: true },
    brideSide: { title: "Bride's Family", entries: [["Daughter of", "David & Elena Vance"], ["Granddaughter of", "Arthur & Clara Vance"]] },
    groomSide: { title: "Groom's Family", entries: [["Son of", "Marcus & Sophia Sterling"], ["Grandson of", "William & Grace Sterling"]] },
    familiesTitle: "The Families",
    eventsTitle: "Order of Events",
    venueTitle: "The Venue & Celebration",
    greeting: "Dear Family & Friends,",
    message: "Together with our families, we invite you to join us in celebrating the wedding of {bride} and {groom}. Your love, presence, and blessings will make our special day complete.",
    events: [
      { title: "Welcome Dinner & Cocktails", offset: -1, time: "6:30 PM", venue: "The Terrace Pavilion" },
      { title: "The Wedding Ceremony", offset: 0, time: "4:00 PM", venue: "@venue" },
      { title: "Dinner & Dancing Reception", offset: 0, time: "6:30 PM", venue: "@venue", note: "Formal Attire" },
    ],
    blocks: [
      { type: "text", title: "With Warmest Gratitude", subtitle: "Our heartfelt thanks to our dear families", lines: ["David & Elena Vance", "Marcus & Sophia Sterling", "Reception to follow ceremony"] },
    ],
  },
  hindu: {
    label: "Hindu",
    heading: "Shubh Vivah",
    tagline: "Together with their families",
    invocation: { text: "॥ श्री गणेशाय नमः ॥", sub: "Om Shri Ganeshaya Namah", script: "deva" },
    brideSide: { title: "Dulhan (Bride)", entries: [["Daughter of", "Mr. & Mrs. Mehta"], ["Granddaughter of", "Late Shri Dinesh Mehta"]] },
    groomSide: { title: "Dulha (Groom)", entries: [["Son of", "Mr. & Mrs. Sharma"], ["Grandson of", "Smt. Kamala Sharma"]] },
    familiesTitle: "The Families",
    eventsTitle: "Mangalik Kshanikayein",
    venueTitle: "Vivah Sthal",
    greeting: "Snehil Swajan,",
    message: "With the blessings of the Almighty and our revered elders, we cordially invite you to bestow your auspicious blessings upon {bride} and {groom} on their wedding celebration.",
    events: [
      { title: "Tel Pujan & Haldi", offset: -1, time: "10:30 AM", venue: "Family Residence" },
      { title: "Mehndi & Sangeet", offset: -1, time: "6:30 PM", venue: "Family Residence" },
      { title: "Shubh Vivah", offset: 0, time: "7:00 PM", venue: "@venue", note: "Baraat arrives at 6:00 PM" },
    ],
    blocks: [
      { type: "list", title: "Darshanabhilashi", subtitle: "With best compliments from family", lines: ["Aarav", "Kabir", "Ishaan", "Dev", "Vivaan", "Reyansh"] },
      { type: "text", title: "Nimantran Karta", subtitle: "Cordially inviting you", lines: ["Shri & Smt. Sharma", "Shri & Smt. Mehta"] },
    ],
  },
  muslim: {
    label: "Muslim",
    heading: "Nikah Invitation",
    tagline: "With the blessings of Allah",
    invocation: { text: "بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ", sub: "In the name of Allah, the Most Gracious, the Most Merciful", script: "arabic" },
    brideSide: { title: "The Bride", entries: [["Daughter of", "Mr. & Mrs. Siddiqui"]] },
    groomSide: { title: "The Groom", entries: [["Son of", "Mr. & Mrs. Khan"]] },
    familiesTitle: "The Families",
    eventsTitle: "Ceremonial Programme",
    venueTitle: "Nikah Venue",
    greeting: "Assalamu Alaikum,",
    message: "With the grace of Allah Subhanah-u-Ta'ala, we request the honour of your presence to celebrate the sacred Nikah of {bride} and {groom}. Your presence and duas will grace the occasion.",
    events: [
      { title: "Mehndi Ki Raat", offset: -1, time: "6:00 PM", venue: "Family Residence" },
      { title: "Nikah Ceremony", offset: 0, time: "4:30 PM", venue: "@venue" },
      { title: "Dawat-e-Walima", offset: 1, time: "7:30 PM", venue: "@venue" },
    ],
    blocks: [
      { type: "text", title: "With Best Compliments", subtitle: "From family & well-wishers", lines: ["Mr. & Mrs. Khan", "Mr. & Mrs. Siddiqui"] },
      { type: "list", title: "Desirous of Your Presence", subtitle: "", lines: ["Zaid", "Omar", "Hamza", "Ayaan"] },
    ],
  },
  christian: {
    label: "Christian",
    heading: "Wedding Invitation",
    tagline: "With joy and God's blessings",
    invocation: { text: "“Therefore what God has joined together, let not man separate.”", sub: "Mark 10:9", script: "latin", enabled: true },
    brideSide: { title: "The Bride", entries: [["Daughter of", "Mr. & Mrs. Fernandes"]] },
    groomSide: { title: "The Groom", entries: [["Son of", "Mr. & Mrs. D'Souza"]] },
    familiesTitle: "Together with their families",
    eventsTitle: "Order of Service",
    venueTitle: "Church & Reception",
    greeting: "Dear Friends and Family,",
    message: "{bride} and {groom} joyfully invite you to witness and celebrate their holy matrimony, and to share in the thanksgiving and reception that follows.",
    events: [
      { title: "Nuptial Mass", offset: 0, time: "11:00 AM", venue: "@venue" },
      { title: "Reception & Toast", offset: 0, time: "6:30 PM", venue: "The Grand Ballroom" },
    ],
    blocks: [
      { type: "text", title: "With Love & Gratitude", subtitle: "Honouring our families", lines: ["Mr. & Mrs. Fernandes", "Mr. & Mrs. D'Souza"] },
    ],
  },
  sikh: {
    label: "Sikh",
    heading: "Anand Karaj",
    tagline: "With the blessings of Waheguru",
    invocation: { text: "ੴ", sub: "Waheguru Ji Ka Khalsa, Waheguru Ji Ki Fateh", script: "gurmukhi" },
    brideSide: { title: "The Bride", entries: [["Daughter of", "S. & Mrs. Kaur"]] },
    groomSide: { title: "The Groom", entries: [["Son of", "S. & Mrs. Singh"]] },
    familiesTitle: "The Families",
    eventsTitle: "Auspicious Functions",
    venueTitle: "Gurdwara Sahib",
    greeting: "Sat Sri Akal,",
    message: "With the boundless grace of Waheguru, we cordially invite you to join us at the auspicious Anand Karaj of {bride} and {groom}, and to shower the new couple with your love and blessings.",
    events: [
      { title: "Maiyan & Sangeet", offset: -1, time: "6:30 PM", venue: "Family Residence" },
      { title: "Anand Karaj", offset: 0, time: "10:30 AM", venue: "@venue" },
      { title: "Celebration Lunch", offset: 0, time: "1:00 PM", venue: "@venue" },
    ],
    blocks: [
      { type: "text", title: "Heartfelt Invitation From", subtitle: "The Singh & Kaur Families", lines: ["S. & Mrs. Singh", "S. & Mrs. Kaur"] },
    ],
  },
  interfaith: {
    label: "Interfaith / Civil",
    heading: "Wedding Invitation",
    tagline: "Together with their families",
    invocation: { text: "✦ Joined in love, united forever ✦", sub: "", script: "latin", enabled: true },
    brideSide: { title: "The Bride", entries: [["Daughter of", "Mr. & Mrs. Rao"]] },
    groomSide: { title: "The Groom", entries: [["Son of", "Mr. & Mrs. Brown"]] },
    familiesTitle: "The Families",
    eventsTitle: "The Celebration",
    venueTitle: "The Wedding Venue",
    greeting: "Dear Friends and Family,",
    message: "Together with our families, we invite you to celebrate the marriage of {bride} and {groom}. We would be deeply honoured by your presence and love.",
    events: [
      { title: "Wedding Vows", offset: 0, time: "4:00 PM", venue: "@venue" },
      { title: "Dinner & Reception", offset: 0, time: "6:30 PM", venue: "@venue" },
    ],
    blocks: [
      { type: "text", title: "With Warmest Wishes", subtitle: "Our dear families", lines: ["The Rao & Brown Families"] },
    ],
  },
};

const pad = (n) => String(n).padStart(2, "0");
export function addDays(iso, n) {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Everything that changes when the faith changes. Names, date and venue are kept. */
export function faithSlice(faithId, date, venueName) {
  const F = FAITHS[faithId] || FAITHS.universal;
  const side = (s) => ({ title: s.title, entries: s.entries.map(([label, name]) => ({ id: uid(), label, name })) });
  return {
    faith: faithId,
    heading: F.heading,
    invocation: { enabled: F.invocation.enabled !== false, text: F.invocation.text, sub: F.invocation.sub, script: F.invocation.script },
    families: { title: F.familiesTitle, brideSide: side(F.brideSide), groomSide: side(F.groomSide) },
    eventsTitle: F.eventsTitle,
    events: F.events.map((e) => ({
      id: uid(), title: e.title, date: addDays(date, e.offset), time: e.time,
      venue: e.venue === "@venue" ? venueName : e.venue, note: e.note || "",
    })),
    message: { greeting: F.greeting, body: F.message },
    blocks: F.blocks.map((b) => ({ id: uid(), ...b, lines: [...b.lines] })),
  };
}

export function applyTemplate(d, t) {
  const defaultPages = t.defaultPages || (t.structure === "2-page" ? { cover: true, combined: true, families: false, venue: false } : { cover: true, families: true, venue: true, combined: false });
  return {
    ...d,
    templateId: t.id,
    structure: t.structure || "3-page",
    layout: t.layout,
    themeId: t.themeId,
    fontId: t.fontId,
    motif: t.motif,
    pages: defaultPages,
    colors: {},
  };
}

export function applyFaith(d, faithId) {
  const F = FAITHS[faithId] || FAITHS.universal;
  const t = TEMPLATES.find((x) => x.faiths.includes(faithId)) || TEMPLATES[0];
  return applyTemplate(
    {
      ...d,
      ...faithSlice(faithId, d.date, d.venue.name),
      couple: { ...d.couple, tagline: F.tagline },
      venue: { ...d.venue, title: F.venueTitle },
    },
    t
  );
}

export function initialState() {
  const date = "2027-02-14";
  const venue = { title: FAITHS.universal.venueTitle, name: "The Grand Pavilion & Resort", address: "Heritage Lake Road, Lucknow\nUttar Pradesh 226001", mapUrl: "", showQr: true, buttonText: "View on Google Maps" };
  const base = {
    colors: {},
    structure: "3-page",
    motif: "peacock",
    pages: { cover: true, families: true, venue: true, combined: false },
    couple: { bride: "Anaya", groom: "Rohan", brideTitle: "", groomTitle: "", groomFirst: false, tagline: FAITHS.universal.tagline },
    date,
    venue,
    elements: [],
  };
  return applyTemplate({ ...base, ...faithSlice("universal", date, venue.name) }, TEMPLATES[0]);
}

export function mapLink(venue) {
  if (venue.mapUrl && venue.mapUrl.trim()) return venue.mapUrl.trim();
  const q = [venue.name, venue.address].filter(Boolean).join(" ").replace(/\s+/g, " ");
  return q ? "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(q) : "";
}

export function setIn(obj, path, val) {
  const keys = Array.isArray(path) ? path : path.split(".");
  const [k, ...rest] = keys;
  const copy = Array.isArray(obj) ? [...obj] : { ...obj };
  copy[k] = rest.length ? setIn(obj?.[k] ?? {}, rest, val) : val;
  return copy;
}
