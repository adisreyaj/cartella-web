import { Bookmark } from '@cartella/bookmarks';
import { FeatureType } from '@cartella/interfaces/general.interface';
import { Package } from '@cartella/packages';
import { Snippet } from '@cartella/snippets';

export interface HomeItems {
  type: FeatureType;
  data: Partial<Bookmark | Snippet | Package>;
  views?: number;
}

export interface HomeCardInput {
  label: string;
  description?: string;
  type: FeatureType;
  updatedAt: Date | string;
  views?: number;
  data: Partial<Bookmark | Package | Snippet>;
}

export interface HomeItemCounts {
  bookmarks: number;
  snippets: number;
  packages: number;
}
