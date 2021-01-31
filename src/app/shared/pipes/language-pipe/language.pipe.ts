import { Pipe, PipeTransform } from '@angular/core';
import { LANGUAGES_SUPPORTED } from '@app/config/snippets.config';

@Pipe({
  name: 'language',
})
export class LanguagePipe implements PipeTransform {
  transform(language: string): unknown {
    if (language) {
      const item = LANGUAGES_SUPPORTED.find(({ value }) => language === value);
      if (item) {
        return item.label;
      }
    }
    return null;
  }
}
