export interface SheeshMahalVenue {
  name: string;
  address: string;
  mapUrl?: string;
  valet?: string;
  nearestLandmark?: string;
}

export interface SheeshMahalEvent {
  id: string;
  name: string;
  date: string;
  time: string;
  venue: string;
  address?: string;
  dressCode?: string;
  mapUrl?: string;
  isoTarget?: string;
  description?: string;
  enabled?: boolean;
}

export interface SheeshMahalSacred {
  bismillah?: string;
  bismillahAria?: string;
  bismillahTranslation?: string;
  quranSurah?: string;
  quranArabic?: string;
  surahArRum?: string;
  familyDua?: string;
  familyReference?: string;
  closingDua?: string;
  urduBlessing?: string;
}

export interface SheeshMahalDressCodeColor {
  name: string;
  color: string;
}

export interface SheeshMahalDressCode {
  title?: string;
  description?: string;
  palette?: SheeshMahalDressCodeColor[];
}

export interface SheeshMahalCouple {
  brideName: string;
  groomName: string;
  brideFullName?: string;
  groomFullName?: string;
  fullTitle?: string;
  brideParents?: string;
  groomParents?: string;
  tagline?: string;
  invitationMessage?: string;
  urduGreeting?: string;
}

export interface SheeshMahalData {
  templateId?: string;
  name?: string;
  religion?: string;
  couple?: SheeshMahalCouple;
  brideName: string;
  groomName: string;
  brideParents?: string;
  groomParents?: string;
  hashtag?: string;
  weddingDate: string;
  dateFormatted?: string;
  venue: SheeshMahalVenue;
  sacred?: SheeshMahalSacred;
  musicTrack?: string;
  dressCode?: SheeshMahalDressCode;
  events: SheeshMahalEvent[];
  eventsJson?: SheeshMahalEvent[];
  rsvpDeadline?: string;
  [key: string]: any;
}

export interface SheeshMahalProps {
  data?: Partial<SheeshMahalData> | any;
}
