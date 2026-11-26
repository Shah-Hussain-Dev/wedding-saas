export interface VideoInvitation {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: 'traditional' | 'watercolor' | 'botanical' | 'floral' | 'cinematic';
  categoryLabel: string;
  tags: string[];
  filename: string;
  posterUrl: string;
  videoUrl: string;
  durationSeconds: number;
  durationFormatted: string;
  aspectRatio: '9:16';
  width: number;
  height: number;
  fileSizeBytes: number;
  fileSizeFormatted: string;
  highlights: string[];
  recommendedFor: string;
  badge?: string;
}

export const VIDEO_CATEGORIES = [
  { id: 'all', label: 'All Collections' },
  { id: 'traditional', label: 'Royal & Traditional' },
  { id: 'watercolor', label: 'Watercolor Romance' },
  { id: 'botanical', label: 'Botanical & Minimal' },
  { id: 'floral', label: 'Floral Elegance' },
  { id: 'cinematic', label: '3D Cinematic Keepsake' },
] as const;

export const VIDEO_INVITATIONS: VideoInvitation[] = [
  {
    id: 'royal-rajputana-heritage',
    title: 'Royal Rajputana Red & Gold Heritage',
    subtitle: 'Grand Traditional Indian Multi-Event Video Invitation',
    description: 'An opulent, regal invitation video steeped in royal Indian aesthetics. Features deep scarlet velvet tones, shimmering gold foil borders, traditional sitar rhythms, and multi-slide choreography perfect for multi-day weddings (Haldi, Mehendi, Sangeet & Vivah).',
    category: 'traditional',
    categoryLabel: 'Royal & Traditional',
    tags: ['Royal Heritage', 'Traditional Vivah', 'Gold Foil', 'Multi-Event', 'Grand'],
    filename: 'Red and Gold Traditional Indian Wedding Invitation Instagram Reel.mp4',
    posterUrl: '/images/video-posters/royal-rajputana-heritage.webp',
    videoUrl: '/api/videos/royal-rajputana-heritage',
    durationSeconds: 144,
    durationFormatted: '2m 24s',
    aspectRatio: '9:16',
    width: 1080,
    height: 1920,
    fileSizeBytes: 75276326,
    fileSizeFormatted: '71.8 MB',
    highlights: ['Multi-Day Event Sequence', 'Intricate Rajasthani Filigree', 'Traditional Auspicious Motifs', 'Instagram Reel & WhatsApp Optimized'],
    recommendedFor: 'Grand Indian Weddings, Multi-Day Celebrations, Royal & Heritage Themes',
    badge: 'Most Popular',
  },
  {
    id: 'beige-cream-watercolor',
    title: 'Beige & Cream Watercolor Serenade',
    subtitle: 'Understated Luxury with Gentle Calligraphy',
    description: 'A serene and timeless aesthetic featuring soft ivory, warm beige textures, and fluid watercolor accents. Clean typography and gentle animations make it ideal for modern destination weddings and intimate celebrations.',
    category: 'watercolor',
    categoryLabel: 'Watercolor Romance',
    tags: ['Warm Beige', 'Watercolor', 'Minimalist Elegance', 'Modern Couple'],
    filename: 'Beige and Cream Watercolor Wedding Invitation Mobile Video.mp4',
    posterUrl: '/images/video-posters/beige-cream-watercolor.webp',
    videoUrl: '/api/videos/beige-cream-watercolor',
    durationSeconds: 35,
    durationFormatted: '35s',
    aspectRatio: '9:16',
    width: 1080,
    height: 1920,
    fileSizeBytes: 17281895,
    fileSizeFormatted: '16.5 MB',
    highlights: ['Handcrafted Watercolor Aesthetics', 'Modern Editorial Typography', 'Effortless Mobile Viewing', 'Soft Atmospheric Soundtrack'],
    recommendedFor: 'Destination Weddings, Intimate Gatherings, Contemporary Celebrations',
    badge: 'Editorial Choice',
  },
  {
    id: 'royal-blue-watercolor',
    title: 'Royal Blue Watercolor Romance',
    subtitle: 'Midnight Indigo Elegance with Gilded Accents',
    description: 'Rich midnight sapphire and indigo watercolor washes complemented by shimmering gold foil lettering. Creates a sophisticated, romantic, and dreamy tone for evening banquets and cocktail receptions.',
    category: 'watercolor',
    categoryLabel: 'Watercolor Romance',
    tags: ['Royal Blue', 'Indigo Wash', 'Gilded Calligraphy', 'Evening Glamour'],
    filename: 'Blue Watercolor Wedding Invitation Mobile Video.mp4',
    posterUrl: '/images/video-posters/royal-blue-watercolor.webp',
    videoUrl: '/api/videos/royal-blue-watercolor',
    durationSeconds: 27,
    durationFormatted: '27s',
    aspectRatio: '9:16',
    width: 1080,
    height: 1920,
    fileSizeBytes: 13357541,
    fileSizeFormatted: '12.7 MB',
    highlights: ['Dramatic Indigo & Gold Palette', 'Fluid Watercolor Bleed Transitions', 'Clear Timeline & Venue Highlights', 'Instant WhatsApp Sharing'],
    recommendedFor: 'Cocktail Evenings, Sangeet Nights, Starlit Receptions',
  },
  {
    id: 'sage-ivory-botanical',
    title: 'Sage & Ivory Botanical Garden',
    subtitle: 'Fresh Eucalyptus Leaves & Organic Minimalist Grace',
    description: 'Subtle eucalyptus sprigs, delicate botanical illustrations, and soothing earthy hues. Designed for nature-inspired garden ceremonies, rustic chic weddings, and environmentally conscious couples.',
    category: 'botanical',
    categoryLabel: 'Botanical & Minimal',
    tags: ['Sage Green', 'Botanical Flora', 'Organic Minimal', 'Garden Wedding'],
    filename: 'Green White Illustrative Elegant Wedding Invitation Video Seluler.mp4',
    posterUrl: '/images/video-posters/sage-ivory-botanical.webp',
    videoUrl: '/api/videos/sage-ivory-botanical',
    durationSeconds: 30,
    durationFormatted: '30s',
    aspectRatio: '9:16',
    width: 1080,
    height: 1920,
    fileSizeBytes: 16580979,
    fileSizeFormatted: '15.8 MB',
    highlights: ['Fine-line Botanical Artistry', 'Natural Sage & Olive Tones', 'Clean Layout with Clear Typography', 'Smooth Fade Transitions'],
    recommendedFor: 'Outdoor Weddings, Eco-Friendly Nuptials, Garden Ceremonies',
  },
  {
    id: 'rose-gold-blush-floral',
    title: 'Rose Gold Blush & Pink Florals',
    subtitle: 'Romantic Garden Blooms with Delicate Pastel Glow',
    description: 'Soft cherry blossoms, watercolor peony wreaths, and shimmering rose-gold dust. Imbued with romantic warmth, perfect for celebrating sweet, poetic love stories.',
    category: 'floral',
    categoryLabel: 'Floral Elegance',
    tags: ['Blush Pink', 'Rose Gold', 'Blooming Peonies', 'Romantic Pastel'],
    filename: 'Pink Floral Wedding Invitation Mobile Video.mp4',
    posterUrl: '/images/video-posters/rose-gold-blush-floral.webp',
    videoUrl: '/api/videos/rose-gold-blush-floral',
    durationSeconds: 26,
    durationFormatted: '26s',
    aspectRatio: '9:16',
    width: 1080,
    height: 1920,
    fileSizeBytes: 9832262,
    fileSizeFormatted: '9.4 MB',
    highlights: ['Gentle Petal Fall Animation', 'Warm Rose Gold Lighting', 'Romantic Acoustic Melody', 'Compact & Fast Loading'],
    recommendedFor: 'Daytime Weddings, Spring & Summer Nuptials, Pastel-Themed Events',
    badge: 'Trending',
  },
  {
    id: 'cinematic-3d-gold-teaser',
    title: 'Cinematic 3D Gold Keepsake Teaser',
    subtitle: 'Dynamic 3D Keepsake Box Unveiling Experience',
    description: 'A striking 3D animation sequence showcasing a ceremonial keepsake box unveiling with reflective metallic gold accents and dynamic camera pans. Perfect for couples who want an unforgettable modern luxury teaser.',
    category: 'cinematic',
    categoryLabel: '3D Cinematic Keepsake',
    tags: ['3D Motion', 'Gold Metallic', 'Keepsake Box', 'Cinematic Teaser'],
    filename: 'Untitled_Scene_11-23_07_12_39_ae8b08a0_t0.3-6.mp4',
    posterUrl: '/images/video-posters/cinematic-3d-gold-teaser.webp',
    videoUrl: '/api/videos/cinematic-3d-gold-teaser',
    durationSeconds: 6,
    durationFormatted: '6s',
    aspectRatio: '9:16',
    width: 720,
    height: 1280,
    fileSizeBytes: 5289945,
    fileSizeFormatted: '5.0 MB',
    highlights: ['3D Spatial Unfolding', 'Reflective Gold Materials', 'High-Impact Announcement Teaser', 'Great for Save-the-Date'],
    recommendedFor: 'Save the Date Teasers, Modern Luxury Unveilings, 3D Fanatics',
    badge: '3D Visual',
  },
];

export const WHATSAPP_CONTACT = {
  phoneNumber: '916394942159',
  displayNumber: '+91 63949 42159',
  defaultGreeting: 'Hi WedInvites! I am interested in your wedding invitation videos. Please share the catalogue and pricing details.',
};

export function getVideoById(id: string): VideoInvitation | undefined {
  return VIDEO_INVITATIONS.find((video) => video.id === id);
}

export function generateVideoWhatsAppUrl(video: VideoInvitation): string {
  const message = `Hi WedInvites! I am interested in your wedding invitation video: "${video.title}". Please share the details and pricing.`;
  return `https://wa.me/${WHATSAPP_CONTACT.phoneNumber}?text=${encodeURIComponent(message)}`;
}

export function generateGenericWhatsAppUrl(): string {
  return `https://wa.me/${WHATSAPP_CONTACT.phoneNumber}?text=${encodeURIComponent(WHATSAPP_CONTACT.defaultGreeting)}`;
}
