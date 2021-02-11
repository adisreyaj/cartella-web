import { FeatureType } from '@app/interfaces/general.interface';
import { Bookmark } from '../../../bookmarks/shared/interfaces/bookmarks.interface';
import { Package } from '../../../packages/shared/interfaces/packages.interface';
import { Snippet } from '../../../snippets/interfaces/snippets.interface';

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
