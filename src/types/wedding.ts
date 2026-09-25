export type WeddingStatus = "draft" | "published";
export type MessageMode = "auto" | "approval";
export type AttendanceStatus = "pending" | "attending" | "not_attending";
export type MessageStatus = "pending" | "approved" | "hidden";

export interface Wedding {
  id: string;
  userId: string;
  slug: string;
  templateId: string;
  templateVersion: string;
  status: WeddingStatus;
  messageMode: MessageMode;
  publishedAt: Date | null;
  expiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  couple?: Couple | null;
  events?: Event[];
  stories?: Story[];
  galleries?: Gallery[];
  musics?: Music[];
  guests?: Guest[];
  giftAccounts?: GiftAccount[];
  template?: { id: string; slug: string; name: string; version: string };
  isDemo?: boolean;
  user?: { id?: string; name?: string | null; email?: string; plan?: string };
}

export interface Couple {
  id: string;
  weddingId: string;
  groomName: string;
  groomNickname: string;
  groomPhoto: string | null;
  groomFather: string;
  groomMother: string;
  groomInstagram: string;
  brideName: string;
  brideNickname: string;
  bridePhoto: string | null;
  couplePhoto?: string | null;
  brideFather: string;
  brideMother: string;
  brideInstagram: string;
}

export interface Event {
  id: string;
  weddingId: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string | null;
  venue: string;
  address: string;
  mapsUrl: string;
  description: string;
  sortOrder: number;
}

export interface Story {
  id: string;
  weddingId: string;
  title: string;
  date: string;
  description: string;
  image: string | null;
  sortOrder: number;
}

export interface Gallery {
  id: string;
  weddingId: string;
  imageUrl: string;
  caption: string;
  sortOrder: number;
}

export interface Music {
  id: string;
  weddingId: string;
  title: string;
  fileUrl: string;
  duration: number | null;
  isActive: boolean;
}

export interface Guest {
  id: string;
  weddingId: string;
  name: string;
  slug: string;
  phone: string;
  address?: string | null;
  category: string;
  guestCount: number;
  tableNumber?: string | null;
  sessionName?: string | null;
  qrCode?: string | null;
  attendanceStatus: AttendanceStatus;
  checkedIn?: boolean;
  checkedInAt?: Date | null;
  checkedInPax?: number;
  souvenirTaken?: boolean;
  giftType?: string | null;
  checkInNotes?: string | null;
  openedAt: Date | null;
  rsvp?: Rsvp | null;
  messages?: GuestMessage[];
}

export interface Rsvp {
  id: string;
  weddingId: string;
  guestId: string;
  attendanceStatus: string;
  guestCount: number;
  submittedAt: Date;
}

export interface GuestMessage {
  id: string;
  weddingId: string;
  guestId: string;
  message: string;
  status: MessageStatus;
  isPinned: boolean;
  createdAt: Date;
  guest?: { name: string };
}

export interface GiftAccount {
  id: string;
  weddingId: string;
  bankName: string;
  accountName: string;
  accountNo: string;
  type: string;
  qrisUrl: string | null;
  sortOrder: number;
}
