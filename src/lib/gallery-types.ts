/** Client-safe gallery constants and types (no server-only imports). */
export type GalleryCategory =
  | "courtyard"
  | "interior"
  | "food"
  | "coffee"
  | "events"
  | "community";

export const GALLERY_CATEGORIES: { value: GalleryCategory; label: string }[] = [
  { value: "courtyard", label: "Courtyard" },
  { value: "interior", label: "Interior" },
  { value: "food", label: "Food" },
  { value: "coffee", label: "Coffee" },
  { value: "events", label: "Events" },
  { value: "community", label: "People & Community" },
];

export type GalleryPhoto = {
  id: string;
  src: string;
  alt: string;
  category: GalleryCategory;
  width: number;
  height: number;
};
