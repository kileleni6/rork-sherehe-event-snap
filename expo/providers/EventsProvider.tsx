import createContextHook from "@nkzw/create-context-hook";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";

import { STOCK_SHOTS, TEMPLATES, type TemplateId } from "@/constants/templates";
import type { Event, Photo, Rsvp, RsvpStatus, ScheduleItem } from "@/types/event";

const STORAGE_KEY = "sherehe.events.v1";
const PROFILE_KEY = "sherehe.profile.v1";

interface Profile {
  name: string;
  premium: boolean;
}

const DEFAULT_PROFILE: Profile = { name: "Host", premium: false };

function seedEvents(): Event[] {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  return [
    {
      id: "e_demo_wedding",
      name: "Amara & Kofi",
      type: "wedding",
      cover:
        "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1600&q=80",
      date: now + 12 * day,
      venue: "The Norfolk Gardens · Nairobi",
      message:
        "Together with our families, we invite you to celebrate our union — a night of love, laughter, and dancing under the stars.",
      dressCode: "Black tie · Rose accents",
      schedule: [
        { id: "s1", time: "4:00 PM", title: "Ceremony" },
        { id: "s2", time: "5:30 PM", title: "Cocktail Hour" },
        { id: "s3", time: "7:00 PM", title: "Reception & Dinner" },
        { id: "s4", time: "10:00 PM", title: "Dancing" },
      ],
      template: "noir",
      hostName: "Amara K.",
      shotsPerGuest: 24,
      revealAt: now + 13 * day,
      revealMode: "plus24h",
      uploadPermission: "all",
      privacy: "private",
      visibility: "all_after_reveal",
      checkInEnabled: true,
      isPrivate: true,
      rsvps: [
        { id: "r1", name: "Zuri Mensah", status: "yes", guests: 2, note: "Can't wait!", createdAt: now - day, passCode: "ZURI24" },
        { id: "r2", name: "Tariq Bello", status: "yes", guests: 1, createdAt: now - day * 2, passCode: "TARI18" },
        { id: "r3", name: "Naledi Okafor", status: "maybe", guests: 1, createdAt: now - day * 3, passCode: "NALE02" },
        { id: "r4", name: "Imani Diallo", status: "yes", guests: 2, createdAt: now - day * 4, passCode: "IMAN77" },
        { id: "r5", name: "Kwame Asante", status: "no", guests: 0, note: "Sending love from Accra ❤️", createdAt: now - day * 5, passCode: "KWAM31" },
      ],
      photos: STOCK_SHOTS.slice(0, 6).map((u, i) => ({
        id: `p${i}`,
        uri: u,
        guestName: ["Zuri", "Tariq", "Imani", "Naledi", "Kojo", "Asha"][i] ?? "Guest",
        takenAt: now - i * 3600_000,
        filter: "warm",
      })),
      invited: 84,
      views: 142,
    },
    {
      id: "e_demo_bday",
      name: "Layla Turns 30",
      type: "birthday",
      cover:
        "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1600&q=80",
      date: now + 3 * day,
      venue: "Skylounge Rooftop · Lagos",
      message: "Thirty, flirty & thriving. Come sip, dance, and celebrate with me!",
      dressCode: "Glam & glitter",
      schedule: [
        { id: "s1", time: "8:00 PM", title: "Welcome cocktails" },
        { id: "s2", time: "9:30 PM", title: "Cake & toasts" },
        { id: "s3", time: "10:00 PM", title: "DJ set til late" },
      ],
      template: "rose",
      hostName: "Layla",
      shotsPerGuest: 20,
      revealAt: now + 4 * day,
      revealMode: "plus24h",
      uploadPermission: "all",
      privacy: "public",
      visibility: "all_after_reveal",
      checkInEnabled: false,
      isPrivate: false,
      rsvps: [
        { id: "r1", name: "Sade", status: "yes", guests: 1, createdAt: now - 86400000, passCode: "SADE10" },
        { id: "r2", name: "Ade", status: "yes", guests: 2, createdAt: now - 86400000, passCode: "ADE220" },
      ],
      photos: [],
      invited: 42,
      views: 67,
    },
  ];
}

export const [EventsProvider, useEvents] = createContextHook(() => {
  const qc = useQueryClient();

  const eventsQuery = useQuery({
    queryKey: ["events"],
    queryFn: async (): Promise<Event[]> => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) return JSON.parse(raw) as Event[];
      } catch (e) {
        console.log("[events] load failed", e);
      }
      const seeded = seedEvents();
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
      } catch {}
      return seeded;
    },
  });

  const profileQuery = useQuery({
    queryKey: ["profile"],
    queryFn: async (): Promise<Profile> => {
      try {
        const raw = await AsyncStorage.getItem(PROFILE_KEY);
        if (raw) return JSON.parse(raw) as Profile;
      } catch {}
      return DEFAULT_PROFILE;
    },
  });

  const persist = useCallback(async (next: Event[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      console.log("[events] save failed", e);
    }
  }, []);

  const persistProfile = useCallback(async (p: Profile) => {
    try {
      await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(p));
    } catch {}
  }, []);

  const events = useMemo(() => eventsQuery.data ?? [], [eventsQuery.data]);
  const profile = profileQuery.data ?? DEFAULT_PROFILE;

  const createMutation = useMutation({
    mutationFn: async (draft: Omit<Event, "id" | "rsvps" | "photos" | "invited" | "views">) => {
      const ev: Event = {
        ...draft,
        id: `e_${Date.now()}`,
        rsvps: [],
        photos: [],
        invited: 0,
        views: 0,
      };
      const next = [ev, ...events];
      await persist(next);
      return ev;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["events"] });
    },
  });

  const updateEvent = useCallback(
    async (id: string, patch: Partial<Event>) => {
      const next = events.map((e) => (e.id === id ? { ...e, ...patch } : e));
      await persist(next);
      qc.setQueryData(["events"], next);
    },
    [events, persist, qc]
  );

  const deleteEvent = useCallback(
    async (id: string) => {
      const next = events.filter((e) => e.id !== id);
      await persist(next);
      qc.setQueryData(["events"], next);
    },
    [events, persist, qc]
  );

  const addRsvp = useCallback(
    async (eventId: string, rsvp: Omit<Rsvp, "id" | "createdAt" | "passCode">): Promise<Rsvp> => {
      const id = `r_${Date.now()}`;
      const passCode = (rsvp.name.replace(/[^a-z]/gi, "").slice(0, 4).toUpperCase() || "GUEST")
        + String(Math.floor(Math.random() * 90) + 10);
      const r: Rsvp = { ...rsvp, id, createdAt: Date.now(), passCode, shotsUsed: 0 };
      const next = events.map((e) =>
        e.id === eventId
          ? { ...e, rsvps: [r, ...e.rsvps], invited: Math.max(e.invited, e.rsvps.length + 1) }
          : e
      );
      await persist(next);
      qc.setQueryData(["events"], next);
      return r;
    },
    [events, persist, qc]
  );

  /** Mark a guest checked-in (or undo). Pass `at = 0` to undo. */
  const checkInGuest = useCallback(
    async (eventId: string, rsvpId: string, at: number = Date.now()) => {
      const next = events.map((e) =>
        e.id === eventId
          ? {
              ...e,
              rsvps: e.rsvps.map((r) =>
                r.id === rsvpId ? { ...r, checkedInAt: at > 0 ? at : undefined } : r
              ),
            }
          : e
      );
      await persist(next);
      qc.setQueryData(["events"], next);
    },
    [events, persist, qc]
  );

  const addPhoto = useCallback(
    async (eventId: string, photo: Omit<Photo, "id" | "takenAt">) => {
      const p: Photo = { ...photo, id: `p_${Date.now()}`, takenAt: Date.now() };
      const next = events.map((e) =>
        e.id === eventId ? { ...e, photos: [p, ...e.photos] } : e
      );
      await persist(next);
      qc.setQueryData(["events"], next);
      return p;
    },
    [events, persist, qc]
  );

  const removePhoto = useCallback(
    async (eventId: string, photoId: string) => {
      const next = events.map((e) =>
        e.id === eventId ? { ...e, photos: e.photos.filter((p) => p.id !== photoId) } : e
      );
      await persist(next);
      qc.setQueryData(["events"], next);
    },
    [events, persist, qc]
  );

  const unlockGallery = useCallback(
    async (eventId: string) => {
      await updateEvent(eventId, { revealAt: Date.now() - 1000 });
    },
    [updateEvent]
  );

  const setProfile = useCallback(
    async (p: Partial<Profile>) => {
      const next = { ...profile, ...p };
      await persistProfile(next);
      qc.setQueryData(["profile"], next);
    },
    [profile, persistProfile, qc]
  );

  const upcoming = useMemo(
    () => [...events].sort((a, b) => a.date - b.date),
    [events]
  );

  const findById = useCallback(
    (id: string | undefined): Event | undefined => events.find((e) => e.id === id),
    [events]
  );

  return {
    events,
    upcoming,
    profile,
    loading: eventsQuery.isLoading,
    findById,
    createEvent: createMutation.mutateAsync,
    creating: createMutation.isPending,
    updateEvent,
    deleteEvent,
    addRsvp,
    checkInGuest,
    addPhoto,
    removePhoto,
    unlockGallery,
    setProfile,
  };
});

export function getTemplate(id: TemplateId) {
  return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0];
}

export function rsvpStats(rsvps: Rsvp[]) {
  const yes = rsvps.filter((r) => r.status === "yes");
  const maybe = rsvps.filter((r) => r.status === "maybe");
  const no = rsvps.filter((r) => r.status === "no");
  const attendingCount = yes.reduce((s, r) => s + 1 + r.guests, 0);
  return {
    yes: yes.length,
    maybe: maybe.length,
    no: no.length,
    attendingCount,
    total: rsvps.length,
  };
}

export type { RsvpStatus, ScheduleItem };
