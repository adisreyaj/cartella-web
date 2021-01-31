import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CodeEditorService {
  private renderer: Renderer2;
  constructor(
    rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private document
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  injectCustomScripts() {
    // let codemirror = this.renderer.createElement('script');
    // let editorScrollbar = this.renderer.createElement('script');
    // editorScrollbar.src = `./vendors/codemirror/scrollbar.js`;
    // codemirror.src = `https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.59.2/codemirror.min.js`;
    // this.renderer.appendChild(this.document.body, codemirror);
    // this.renderer.appendChild(this.document.body, editorScrollbar);
  }
}
