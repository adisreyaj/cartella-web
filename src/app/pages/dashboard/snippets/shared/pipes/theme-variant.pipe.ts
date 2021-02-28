import { Pipe, PipeTransform } from '@angular/core';
import { ThemesSupported } from '@app/config/snippets.config';

@Pipe({
  name: 'themeVariant',
})
export class ThemeVariantPipe implements PipeTransform {
  /**
   * Return the possible themes based on if dark mode is enabled or not
   *
   * If Dark mode is enabled, only dark themes are available. For light mode, all themes
   * including both light and dark variants are made available.
   *
   * @param value - themes supported
   * @param isDarkMode - is dark mode enabled
   */
  transform(value: ThemesSupported[], isDarkMode = false): unknown {
    if (value?.length > 0) {
      return value.filter(({ type }) => {
        if (isDarkMode) {
          return type === 'dark';
        }
        return true;
      });
    }
    return [];
  }
}
