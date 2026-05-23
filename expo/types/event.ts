import type { CameraStyleId, EventTypeId, TimeOfDayId } from "@/constants/templates";
import type { TemplateId } from "@/constants/templates";

export type RsvpStatus = "yes" | "no" | "maybe";

export interface Rsvp {
  id: string;
  name: string;
  status: RsvpStatus;
  guests: number;
  note?: string;
  createdAt: number;
}

export interface Photo {
  id: string;
  uri: string;
  guestName: string;
  takenAt: number;
  filter?: "none" | "warm" | "cool" | "bw" | "sepia";
  style?: CameraStyleId;
  flagged?: boolean;
}

export interface ScheduleItem {
  id: string;
  time: string;
  title: string;
}

export interface Event {
  id: string;
  name: string;
  type: EventTypeId;
  customLabel?: string;
  timeOfDay?: TimeOfDayId;
  cover: string;
  date: number; // epoch ms
  venue: string;
  message: string;
  dressCode?: string;
  schedule: ScheduleItem[];
  template: TemplateId;
  hostName: string;
  // camera rules
  shotsPerGuest: number;
  revealAt: number; // epoch ms
  isPrivate: boolean;
  // data
  rsvps: Rsvp[];
  photos: Photo[];
  invited: number;
  views: number;
  premium?: boolean;
}
