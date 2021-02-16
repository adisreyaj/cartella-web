import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EditorThemeService {
  constructor(@Inject(DOCUMENT) private document: Document) {
    this.loadUserSavedThemeIfExists();
  }

  loadUserSavedThemeIfExists() {
    const savedTheme = localStorage.getItem('editor-theme');
    if (savedTheme) {
      this.loadTheme(savedTheme);
    }
  }

  loadTheme(name: string) {
    const themeUrl = `assets/styles/themes/${name}.css`;
    const themeLink = this.document.getElementById(
      'editor-theme'
    ) as HTMLLinkElement;
    if (themeLink) {
      themeLink.href = themeUrl;
    } else {
      const style = this.document.createElement('link');
      style.id = 'editor-theme';
      style.rel = 'stylesheet';
      style.href = themeUrl;
      const head = this.document.getElementsByTagName('head')[0];
      head.appendChild(style);
    }
  }
}
