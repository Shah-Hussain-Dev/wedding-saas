export type PreviewFaith = "universal" | "hindu" | "muslim";

export interface FaithContentConfig {
  faith: PreviewFaith;
  label: string;
  badge: string;
  weddingType: string;
  sacredInvocation: string;
  bismillah: string;
  tagline: string;
  titlePrefix: string;
  groomName: string;
  brideName: string;
  groomFullName: string;
  brideFullName: string;
  groomParents: string;
  brideParents: string;
  invitationMessage: string;
  culturalGreeting: string;
  storyMessage: string;
  secondaryDate: string;
  hashtag: string;
  dressCodeText: string;
  verse: {
    arabic: string;
    translation: string;
    reference: string;
    propheticDua: string;
    propheticDuaTranslation: string;
  };
  sacred: {
    invocation: string;
    mantra: string;
    shloka: string;
    shlokaTranslation: string;
    tagline: string;
  };
  events: Array<{
    id?: string;
    name: string;
    date: string;
    time: string;
    venue: string;
    location?: string;
    dressCode?: string;
    dress?: string;
    description: string;
    detail?: string;
    enabled: boolean;
  }>;
}

export const FAITH_VARIANTS: Record<PreviewFaith, FaithContentConfig> = {
  muslim: {
    faith: "muslim",
    label: "Muslim",
    badge: "Sacred Nikah",
    weddingType: "Nikah",
    sacredInvocation: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    bismillah: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    tagline: "In The Name Of Allah, The Most Gracious, The Most Merciful",
    titlePrefix: "Sacred Nikah & Walima Celebration",
    groomName: "Shaan",
    brideName: "Diya",
    groomFullName: "Shaan Rafiq Memon",
    brideFullName: "Diya Fatima Siddiqui",
    groomParents: "Mr. & Mrs. Rafiq Usman Memon",
    brideParents: "Mr. & Mrs. Shakeel Ahmed Siddiqui",
    invitationMessage:
      "With the divine grace of Almighty Allah (SWT) and the cherished prayers of our beloved parents and elders, we request the honour of your gracious presence as our children unite in the sacred bond of Nikah.",
    culturalGreeting:
      "Aapki pur-khuloos shirkat aur duayein hamari khushiyon ko dobala karengi.",
    storyMessage:
      "Like delicate rose petals blooming in morning dew, Allah (SWT) destined our hearts to unite in affection, tranquil peace, and barakah. Surrounded by the heartfelt prayers of our parents and elders, we begin this blessed journey of togetherness.",
    secondaryDate: "14 Shawwal 1448 AH",
    hashtag: "#ShaanWedsDiya",
    dressCodeText: "Dusty Rose & Ivory Traditional Zari / Royal Modest Formals",
    verse: {
      arabic: "وَخَلَقْنَاكُمْ أَزْوَاجًا",
      translation: "And We created you in pairs.",
      reference: "Surah An-Naba · 78:8",
      propheticDua: "بَارَكَ اللَّهُ لَكَ وَبَارَكَ عَلَيْكَ وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ",
      propheticDuaTranslation:
        "May Allah bless you, and shower His blessings upon you, and unite you both in goodness and eternal love.",
    },
    sacred: {
      invocation: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
      mantra: "بَارَكَ اللَّهُ لَكَ وَبَارَكَ عَلَيْكَ وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ",
      shloka:
        "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً",
      shlokaTranslation:
        "And among His signs is that He created for you mates that you may dwell in tranquility with them, and placed between you affection and mercy.",
      tagline: "Sacred Nikah & Walima Celebrations",
    },
    events: [
      {
        id: "dholki-mehendi",
        name: "Jashn-e-Dholki & Phoolon Ki Mehendi",
        date: "Friday, 19 March 2027",
        time: "06:00 PM",
        venue: "The Courtyard Pavilion",
        location: "The Rosewood Palace Estate, Mehrauli",
        dressCode: "Pastel Festive Lehengas & Kurtas",
        dress: "Pastel Festive Lehengas & Kurtas",
        description:
          "An enchanting rose-scented evening with traditional dholak beats, fragrant jasmine motiya garlands, and vibrant floral henna amidst joyful laughter and elders' blessings.",
        detail:
          "An enchanting rose-scented evening with traditional dholak beats, fragrant jasmine motiya garlands, and vibrant floral henna amidst joyful laughter and elders' blessings.",
        enabled: true,
      },
      {
        id: "sacred-nikah",
        name: "The Sacred Nikah Ceremony (Ijab-o-Qubool)",
        date: "Saturday, 20 March 2027",
        time: "04:30 PM",
        venue: "The Golden Floral Gazebo",
        location: "The Rosewood Palace Estate, Mehrauli",
        dressCode: "Dusty Rose & Ivory Traditional Zari",
        dress: "Dusty Rose & Ivory Traditional Zari",
        description:
          "The sacred covenant of Nikah solemnized under divine prayers, sealed with Quranic recitation, Ijab-o-Qubool, and lifelong promises.",
        detail:
          "The sacred covenant of Nikah solemnized under divine prayers, sealed with Quranic recitation, Ijab-o-Qubool, and lifelong promises.",
        enabled: true,
      },
      {
        id: "walima-reception",
        name: "Rukhsati & Royal Dawat-e-Walima Banquet",
        date: "Sunday, 21 March 2027",
        time: "07:30 PM",
        venue: "The Grand Rose Ballroom",
        location: "The Rosewood Palace Estate, Mehrauli",
        dressCode: "Evening Formal / Black Tie & Zari",
        dress: "Evening Formal / Black Tie & Zari",
        description:
          "Tender parental prayers under the holy Quran followed by an exquisite royal banquet celebrating the blessed new journey of two families under starlit skies.",
        detail:
          "Tender parental prayers under the holy Quran followed by an exquisite royal banquet celebrating the blessed new journey of two families under starlit skies.",
        enabled: true,
      },
    ],
  },
  hindu: {
    faith: "hindu",
    label: "Hindu",
    badge: "Shubh Vivah",
    weddingType: "Vivah",
    sacredInvocation: "॥ श्री गणेशाय नमः ॥",
    bismillah: "॥ श्री गणेशाय नमः ॥",
    tagline: "|| मङ्गलम् भगवान विष्णुः मङ्गलम् गरुडध्वजः ||",
    titlePrefix: "Auspicious Shubh Vivah & Grand Reception",
    groomName: "Shubham",
    brideName: "Ananya",
    groomFullName: "Shubham Verma",
    brideFullName: "Ananya Sharma",
    groomParents: "Mrs. Meenakshi & Mr. Alok Verma",
    brideParents: "Mrs. Sunita & Mr. Rajesh Sharma",
    invitationMessage:
      "With the divine blessings of Lord Ganesha, our revered Kuldevta, and the affectionate prayers of our beloved parents, we solicit your esteemed presence to grace the Shubh Vivah of our children.",
    culturalGreeting:
      "Aapki upasthiti aur aashirwad hamare is vivah utsav ko mangalmay banayenge.",
    storyMessage:
      "Two souls united under the sacred fire, bound by cosmic grace, shared dreams, and deep devotion. Guided by the divine blessings of Lord Ganesha and our elders, we take our sacred seven steps into an eternity of companionship.",
    secondaryDate: "Shukla Paksha Ekadashi · Vikram Samvat 2083",
    hashtag: "#ShubhamWedsAnanya",
    dressCodeText: "Royal Traditional & Festive Indian Attire (Rich Silk, Banarasi, Rani Pink & Imperial Gold)",
    verse: {
      arabic: "मङ्गलम् भगवान विष्णुः मङ्गलम् गरुडध्वजः",
      translation:
        "May the Divine Lord bless our sacred union with eternal harmony, righteousness, and boundless joy.",
      reference: "Vedic Mangalacharan",
      propheticDua: "वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ । निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥",
      propheticDuaTranslation:
        "O Lord Ganesha of colossal form, remove all obstacles from our sacred path and illuminate our journey with eternal grace.",
    },
    sacred: {
      invocation: "॥ श्री गणेशाय नमः ॥",
      mantra: "ॐ श्री गणेशाय नमः",
      shloka: "वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ। निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥",
      shlokaTranslation:
        "O Lord Ganesha, of colossal form and radiance of a million suns, remove all obstacles from our sacred journey forever.",
      tagline: "Shubh Vivah & Grand Reception",
    },
    events: [
      {
        id: "ganesh-haldi",
        name: "Shree Ganesh Sthapana & Haldi Ceremony",
        date: "Friday, 19 March 2027",
        time: "10:30 AM",
        venue: "The Lotus Pool Courtyard",
        location: "The Rosewood Palace Estate, Mehrauli",
        dressCode: "Sun-Kissed Yellows & Festive Florals",
        dress: "Sun-Kissed Yellows & Festive Florals",
        description:
          "Seeking divine blessings from Lord Ganesha for an auspicious start, followed by joyful turmeric blessings, marigold showers, and traditional folk melodies.",
        detail:
          "Seeking divine blessings from Lord Ganesha for an auspicious start, followed by joyful turmeric blessings, marigold showers, and traditional folk melodies.",
        enabled: true,
      },
      {
        id: "mehendi-sangeet",
        name: "Rang-e-Mehendi & Sangeet Raas",
        date: "Friday, 19 March 2027",
        time: "07:00 PM",
        venue: "The Starlight Pavilion",
        location: "The Rosewood Palace Estate, Mehrauli",
        dressCode: "Indo-Western Glitz & Regal Silks",
        dress: "Indo-Western Glitz & Regal Silks",
        description:
          "A dazzling night of intricate bridal henna, energetic family dance performances, dandiya beats, and celebration under glittering fairy lights.",
        detail:
          "A dazzling night of intricate bridal henna, energetic family dance performances, dandiya beats, and celebration under glittering fairy lights.",
        enabled: true,
      },
      {
        id: "shubh-vivah",
        name: "Baraat, Shubh Vivah & Saat Phere",
        date: "Saturday, 20 March 2027",
        time: "04:30 PM",
        venue: "The Sacred Mandap & Gazebo",
        location: "The Rosewood Palace Estate, Mehrauli",
        dressCode: "Royal Banarasi, Silk Sarees & Sherwanis",
        dress: "Royal Banarasi, Silk Sarees & Sherwanis",
        description:
          "The groom's grand royal procession, exchange of varmala, Vedic mantras, and seven sacred vows around the holy Agni.",
        detail:
          "The groom's grand royal procession, exchange of varmala, Vedic mantras, and seven sacred vows around the holy Agni.",
        enabled: true,
      },
      {
        id: "grand-reception",
        name: "Grand Royal Wedding Reception",
        date: "Sunday, 21 March 2027",
        time: "07:30 PM",
        venue: "The Grand Rose Ballroom",
        location: "The Rosewood Palace Estate, Mehrauli",
        dressCode: "Formal Western / Royal Evening Zari",
        dress: "Formal Western / Royal Evening Zari",
        description:
          "An opulent celebratory banquet welcoming the newlyweds, featuring gourmet heritage dining, champagne toasts, and live musical orchestra.",
        detail:
          "An opulent celebratory banquet welcoming the newlyweds, featuring gourmet heritage dining, champagne toasts, and live musical orchestra.",
        enabled: true,
      },
    ],
  },
  universal: {
    faith: "universal",
    label: "Universal",
    badge: "Wedding Celebration",
    weddingType: "Wedding",
    sacredInvocation: "✦ TWO HEARTS · ONE JOURNEY ✦",
    bismillah: "✦ TWO HEARTS · ONE JOURNEY ✦",
    tagline: "Together with our families, we invite you to celebrate",
    titlePrefix: "The Wedding Celebration & Gala Reception",
    groomName: "Kabir",
    brideName: "Tara",
    groomFullName: "Kabir Malhotra",
    brideFullName: "Tara Kapoor",
    groomParents: "Mrs. Sunaina & Mr. Vikram Malhotra",
    brideParents: "Mrs. Neena & Mr. Arvind Kapoor",
    invitationMessage:
      "Together with our beloved families, we invite you to share in our happiness as we exchange our wedding vows and celebrate the beginning of our new life together.",
    culturalGreeting:
      "Aapki upasthiti aur aashirwad hamari khushiyon ko dobala karenge.",
    storyMessage:
      "What started as serendipitous conversations evolved into an extraordinary adventure of laughter, deep companionship, and mutual respect. We cannot wait to celebrate this milestone surrounded by those who mean the world to us.",
    secondaryDate: "Spring Season · Twilight Hours",
    hashtag: "#KabirWedsTara",
    dressCodeText: "Cocktail & Black-Tie Optional / Elegant Evening Attire",
    verse: {
      arabic: "✦ FOREVER & ALWAYS ✦",
      translation:
        "Two lives, two hearts, joined together in friendship, united forever in love.",
      reference: "Celebration of Love",
      propheticDua: "Whatever our souls are made of, his and mine are the same.",
      propheticDuaTranslation:
        "May our journey be filled with boundless joy, enduring kindness, and timeless memories.",
    },
    sacred: {
      invocation: "✦ Two Hearts · One Journey ✦",
      mantra: "Love · Trust · Companionship",
      shloka: "Two lives, two hearts, joined together in friendship, united forever in love.",
      shlokaTranslation:
        "A celebration of love, commitment, and the extraordinary adventure ahead.",
      tagline: "Wedding Celebration & Gala Reception",
    },
    events: [
      {
        id: "welcome-cocktails",
        name: "Welcome Cocktails & Twilight Soirée",
        date: "Friday, 19 March 2027",
        time: "06:30 PM",
        venue: "The Glasshouse Conservatory",
        location: "The Rosewood Palace Estate, Mehrauli",
        dressCode: "Smart Casual & Garden Chic",
        dress: "Smart Casual & Garden Chic",
        description:
          "An intimate twilight gathering with handcrafted cocktails, acoustic live music, and warm reunions as our wedding weekend begins.",
        detail:
          "An intimate twilight gathering with handcrafted cocktails, acoustic live music, and warm reunions as our wedding weekend begins.",
        enabled: true,
      },
      {
        id: "wedding-ceremony",
        name: "The Wedding Ceremony & Exchange of Vows",
        date: "Saturday, 20 March 2027",
        time: "04:30 PM",
        venue: "The Sunken Rose Amphitheatre",
        location: "The Rosewood Palace Estate, Mehrauli",
        dressCode: "Cocktail Attire / Elegant Neutrals",
        dress: "Cocktail Attire / Elegant Neutrals",
        description:
          "The heartfelt exchange of marriage vows and rings in an enchanting botanical sanctuary, surrounded by close friends and family.",
        detail:
          "The heartfelt exchange of marriage vows and rings in an enchanting botanical sanctuary, surrounded by close friends and family.",
        enabled: true,
      },
      {
        id: "gala-reception",
        name: "Dinner Gala & Starlight Dancing",
        date: "Sunday, 21 March 2027",
        time: "07:00 PM",
        venue: "The Grand Rose Ballroom",
        location: "The Rosewood Palace Estate, Mehrauli",
        dressCode: "Black-Tie Optional / Evening Formal",
        dress: "Black-Tie Optional / Evening Formal",
        description:
          "A celebratory multi-course culinary dinner, champagne toasts, cutting of the cake, and a lively celebration on the dance floor into the night.",
        detail:
          "A celebratory multi-course culinary dinner, champagne toasts, cutting of the cake, and a lively celebration on the dance floor into the night.",
        enabled: true,
      },
    ],
  },
};

/**
 * Derives default faith from template ID
 */
export function getDefaultFaithForTemplate(templateId: string): PreviewFaith {
  const norm = (templateId || "").toLowerCase();
  if (
    norm.includes("nikah") ||
    norm.includes("qasr") ||
    norm.includes("gul-e-noor") ||
    norm.includes("noor-e-nikah") ||
    norm.includes("azure-nikah") ||
    norm.includes("kitab-e-nikah")
  ) {
    return "muslim";
  }
  if (
    norm.includes("lotus") ||
    norm.includes("crimson") ||
    norm.includes("emerald-noir") ||
    norm.includes("royal-elegance") ||
    norm.includes("modern-minimal")
  ) {
    return "hindu";
  }
  return "universal";
}

/**
 * Transforms any base template dataset to reflect the chosen faith tradition
 */
export function getFaithAdjustedTemplateData(
  baseData: any,
  faith: PreviewFaith,
  templateId: string,
  userCustomizedNames?: { bride?: string; groom?: string }
): any {
  const variant = FAITH_VARIANTS[faith] || FAITH_VARIANTS.universal;
  const isDefaultFaithForTemplate = faith === getDefaultFaithForTemplate(templateId);

  // Preserve user custom names if provided.
  // If the faith matches the template's native faith, preserve the template's own authentic dummy names.
  // If switching away to another faith, use the variant's authentic names for that tradition.
  const brideName =
    userCustomizedNames?.bride?.trim() ||
    baseData?.customBrideName ||
    (isDefaultFaithForTemplate
      ? (baseData?.brideName || baseData?.couple?.brideName || variant.brideName)
      : variant.brideName);

  const groomName =
    userCustomizedNames?.groom?.trim() ||
    baseData?.customGroomName ||
    (isDefaultFaithForTemplate
      ? (baseData?.groomName || baseData?.couple?.groomName || variant.groomName)
      : variant.groomName);

  const brideFullName =
    userCustomizedNames?.bride?.trim() ||
    baseData?.customBrideName ||
    (isDefaultFaithForTemplate
      ? (baseData?.brideFullName || baseData?.couple?.brideFullName || variant.brideFullName)
      : variant.brideFullName);

  const groomFullName =
    userCustomizedNames?.groom?.trim() ||
    baseData?.customGroomName ||
    (isDefaultFaithForTemplate
      ? (baseData?.groomFullName || baseData?.couple?.groomFullName || variant.groomFullName)
      : variant.groomFullName);

  const brideParents =
    isDefaultFaithForTemplate
      ? (baseData?.brideParents || baseData?.couple?.brideParents || variant.brideParents)
      : variant.brideParents;

  const groomParents =
    isDefaultFaithForTemplate
      ? (baseData?.groomParents || baseData?.couple?.groomParents || variant.groomParents)
      : variant.groomParents;

  const dynamicHashtag = `#${groomName}And${brideName}`.replace(/[\s&]+/g, "");

  const merged = {
    ...baseData,
    religion: faith,
    faith: faith,
    weddingType: variant.weddingType,
    sacredInvocation: variant.sacredInvocation,
    bismillah: variant.bismillah,
    title: `${variant.titlePrefix} · ${baseData?.title || baseData?.name || "Luxury Invitation"}`,
    brideName,
    groomName,
    hashtag: dynamicHashtag,
    islamicDate: variant.secondaryDate,
    secondaryDate: variant.secondaryDate,
    storyMessage: variant.storyMessage,
    dressCodeText: variant.dressCodeText,
    dressCode: {
      title: variant.dressCodeText,
      description: variant.dressCodeText,
    },
    verse: variant.verse,
    sacred: variant.sacred,
    events: variant.events,
    eventsJson: variant.events,
    couple: {
      ...baseData?.couple,
      brideName,
      groomName,
      brideFullName,
      groomFullName,
      brideParents,
      groomParents,
      tagline: variant.tagline,
      invitationMessage: variant.invitationMessage,
      urduGreeting: variant.culturalGreeting,
      culturalGreeting: variant.culturalGreeting,
    },
  };

  return merged;
}
