import { Pipe, PipeTransform } from '@angular/core';
import { Bookmark } from '@cartella/bookmarks';
import { FeatureType } from '@cartella/interfaces/general.interface';
import { Package } from '@cartella/packages';
import { Snippet } from '@cartella/snippets';
import { HomeCardInput, HomeItems } from '../interfaces/home.interface';

@Pipe({
  name: 'homeCardDataFormat',
})
export class HomeCardDataFormatPipe implements PipeTransform {
  transform(value: HomeItems): null | HomeCardInput {
    let formatted: HomeCardInput | null = null;
    if (value) {
      const { type, data, views } = value;
      switch (type) {
        case FeatureType.bookmark: {
          const { id, name, description, updatedAt, ...bookmarkData } = data as Bookmark;
          formatted = {
            data: bookmarkData,
            label: name,
            type,
            updatedAt,
            description: description ?? '',
            views,
          };
          break;
        }
        case FeatureType.snippet: {
          const { id, name, description, updatedAt, ...snippetData } = data as Snippet;
          formatted = {
            data: snippetData,
            label: name,
            type,
            updatedAt,
            description: description ?? '',
            views,
          };
          break;
        }
        case FeatureType.package: {
          const { id, name, description, updatedAt, ...packageData } = data as Package;
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
