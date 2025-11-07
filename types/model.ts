export interface ModelStats {
  weight: string;
  height: string;
  hips: string;
  waist: string;
  bust?: string;
  shoeSize?: string;
  hairColor?: string;
  eyeColor?: string;
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
  bio?: string;
  stats: ModelStats;
  instagram?: string;
  featuredImage: string;
  gallery: ModelMedia[];
  video?: string;
}

