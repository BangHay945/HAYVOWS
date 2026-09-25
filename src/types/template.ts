import type { ComponentType } from "react";
import type { Wedding, Guest, GuestMessage } from "./wedding";

export interface WeddingContextData {
  wedding: Wedding;
  guest: Guest | null;
  messages: GuestMessage[];
}

export interface RSVPSubmitData {
  guestId: string;
  weddingId: string;
  attendanceStatus: "attending" | "not_attending";
  guestCount: number;
  message?: string;
}

export interface TemplateComponentProps {
  context: WeddingContextData;
  onRSVPSubmit?: (data: RSVPSubmitData) => Promise<void>;
  onTrack?: (event: string, metadata?: Record<string, unknown>) => void;
}

export interface InvitationTemplate {
  id: string;
  name: string;
  version: string;
  Cover: ComponentType<TemplateComponentProps & { onOpen: () => void; onOpenTicket?: () => void }>;
  Hero?: ComponentType<TemplateComponentProps>;
  Couple?: ComponentType<TemplateComponentProps>;
  Countdown?: ComponentType<TemplateComponentProps>;
  Story?: ComponentType<TemplateComponentProps>;
  Event?: ComponentType<TemplateComponentProps>;
  Gallery?: ComponentType<TemplateComponentProps>;
  RSVP?: ComponentType<TemplateComponentProps>;
  Messages?: ComponentType<TemplateComponentProps>;
  Gift?: ComponentType<TemplateComponentProps>;
  Footer?: ComponentType<TemplateComponentProps>;
  MusicButton?: ComponentType<{ isPlaying: boolean; onToggle: () => void }>;
  Layout: ComponentType<TemplateLayoutProps>;
}

export interface TemplateLayoutProps {
  context: WeddingContextData;
  isOpen: boolean;
  onOpen: () => void;
  onOpenTicket?: () => void;
}
