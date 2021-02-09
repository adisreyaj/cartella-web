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
  type: FeatureType;
  updatedAt: string;
  views?: number;
}
