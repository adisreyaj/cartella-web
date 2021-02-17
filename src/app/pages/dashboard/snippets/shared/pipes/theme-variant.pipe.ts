import { Pipe, PipeTransform } from '@angular/core';
import { ThemesSupported } from '@app/config/snippets.config';

@Pipe({
  name: 'themeVariant',
})
export class ThemeVariantPipe implements PipeTransform {
  transform(value: ThemesSupported[], isDarkMode = false): unknown {
    if (value?.length > 0) {
      return value.filter(
        ({ type }) => type === (isDarkMode ? 'dark' : 'light')
      );
    }
    return [];
  }
}
