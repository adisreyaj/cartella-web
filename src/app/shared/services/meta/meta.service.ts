import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class MetaService {
  constructor(private title: Title, private meta: Meta) {}

  updateTitle(title: string) {
    if (title) {
      this.title.setTitle(title);
    }
  }

  updateOgUrl(url: string) {
    if (url) {
      this.meta.updateTag({ name: 'og:url', content: url });
    }
  }

  updateDescription(desc: string) {
    if (desc) {
      this.meta.updateTag({ name: 'description', content: desc });
    }
  }
}
