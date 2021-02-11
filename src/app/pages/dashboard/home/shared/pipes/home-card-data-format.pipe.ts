import { Pipe, PipeTransform } from '@angular/core';
import { FeatureType } from '@app/interfaces/general.interface';
import { Bookmark } from '../../../bookmarks/shared/interfaces/bookmarks.interface';
import { Package } from '../../../packages/shared/interfaces/packages.interface';
import { Snippet } from '../../../snippets/interfaces/snippets.interface';
import { HomeCardInput, HomeItems } from '../interfaces/home.interface';

@Pipe({
  name: 'homeCardDataFormat',
})
export class HomeCardDataFormatPipe implements PipeTransform {
  transform(value: HomeItems): null | HomeCardInput {
    let formatted: HomeCardInput = null;
    if (value) {
      const { type, data, views } = value;
      switch (type) {
        case FeatureType.BOOKMARK: {
          const {
            id,
            name,
            description,
            updatedAt,
            ...bookmarkData
          } = data as Bookmark;
          formatted = {
            data: bookmarkData,
            label: name,
            type,
            updatedAt,
            description,
            views,
          };
        }
        case FeatureType.SNIPPET: {
          const {
            id,
            name,
            description,
            updatedAt,
            ...snippetData
          } = data as Snippet;
          formatted = {
            data: snippetData,
            label: name,
            type,
            updatedAt,
            description,
            views,
          };
        }
        case FeatureType.PACKAGE: {
          const {
            id,
            name,
            description,
            updatedAt,
            ...packageData
          } = data as Package;
          formatted = {
            data: packageData,
            label: name,
            type,
            updatedAt,
            description,
            views,
          };
        }
      }
    }
    return formatted;
  }
}
