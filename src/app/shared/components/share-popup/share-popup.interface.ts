import { Bookmark } from '@cartella/bookmarks';
import { Package } from '@cartella/packages';
import { Snippet } from '@cartella/snippets';
import { FeatureType } from '../../interfaces/general.interface';

export interface SharePopupPayload {
  entity: FeatureType;
  item: Bookmark | Snippet | Package;
}
