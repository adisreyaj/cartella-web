import { Bookmark } from '../../../pages/dashboard/bookmarks/shared/interfaces/bookmarks.interface';
import { Package } from '../../../pages/dashboard/packages/shared/interfaces/packages.interface';
import { Snippet } from '../../../pages/dashboard/snippets/shared/interfaces/snippets.interface';
import { FeatureType } from '../../interfaces/general.interface';

export interface SharePopupPayload {
  entity: FeatureType;
  item: Bookmark | Snippet | Package;
}
