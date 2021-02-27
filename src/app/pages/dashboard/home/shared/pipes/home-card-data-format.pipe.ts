import { Pipe, PipeTransform } from '@angular/core';
import { Bookmark } from '@app/bookmarks/shared/interfaces/bookmarks.interface';
import { FeatureType } from '@app/interfaces/general.interface';
import { Package } from '@app/packages/shared/interfaces/packages.interface';
import { Snippet } from '@app/snippets/shared/interfaces/snippets.interface';
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
        case FeatureType.bookmark: {
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
          break;
        }
        case FeatureType.snippet: {
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
          break;
        }
        case FeatureType.package: {
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
          break;
        }
      }
    }
    return formatted;
  }
}
