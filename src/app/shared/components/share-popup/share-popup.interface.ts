import { Bookmark } from '@cartella/bookmarks/shared/interfaces/bookmarks.interface';
import { Package } from '@cartella/packages/shared/interfaces/packages.interface';
import { Snippet } from '@cartella/snippets';
import { FeatureType } from '../../interfaces/general.interface';

export interface SharePopupPayload {
  entity: FeatureType;
  item: Bookmark | Snippet | Package;
}
