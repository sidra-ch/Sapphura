export interface CloudinaryAsset {
  publicId: string;
  url: string;
  secureUrl: string;
  format?: string;
  width?: number;
  height?: number;
  resourceType: 'image' | 'video';
  createdAt?: string;
}

export interface CloudinaryMediaPayload {
  logo: CloudinaryAsset | null;
  suits: CloudinaryAsset[];
  categories: {
    newCollection: CloudinaryAsset[];
    bangles: CloudinaryAsset[];
    anklets: CloudinaryAsset[];
    earrings: CloudinaryAsset[];
    makeup: CloudinaryAsset[];
  };
  videos: CloudinaryAsset[];
  allAssets: CloudinaryAsset[];
  sourcePrefixes: string[];
}
