export interface ModelStats {
  height: string;
  bust: string;
  waist: string;
  hips: string;
  shoeSize: string;
  hairColor: string;
  eyeColor: string;
}

export interface ModelMedia {
  type: "image" | "video";
  src: string;
  alt: string;
  thumbnail?: string;
}

export interface Model {
  id: string;
  slug: string;
  name: string;
  stats: ModelStats;
  instagram?: string;
  booked?: boolean;
  targetLocation?: string;
  /** Custom English bio; empty/unset falls back to auto-generated bio. */
  bioEn?: string;
  /** Custom Bulgarian bio; empty/unset falls back to auto-generated bio. */
  bioBg?: string;
  featuredImage: string;
  featuredImageId?: string;
  board?: "mainboard" | "development";
  gender?: "male" | "female";
  gallery: ModelMedia[];
  digitals?: ModelMedia[];
  video?: string;
}

