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
  featuredImage: string;
  gallery: ModelMedia[];
  video?: string;
}

