import { Bookmark } from '@cartella/bookmarks';
import { FeatureType } from '@cartella/interfaces/general.interface';
import { Package } from '@cartella/packages';
import { Snippet } from '@cartella/snippets';

export interface SharePopupPayload {
  entity: FeatureType;
  item: Bookmark | Snippet | Package;
}
