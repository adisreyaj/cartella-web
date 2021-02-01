import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';

const scripts = [
  {
    name: 'codemirror',
    path: './vendors/codemirror/codemirror.js',
  },
  {
    name: 'css',
    path: './vendors/codemirror/modes/css.js',
  },
  {
    name: 'dart',
    path: './vendors/codemirror/modes/dart.js',
  },
  {
    name: 'htmlmixed',
    path: './vendors/codemirror/modes/htmlmixed.js',
  },
  {
    name: 'jsx',
    path: './vendors/codemirror/modes/jsx.js',
  },
  {
    name: 'markdown',
    path: './vendors/codemirror/modes/markdown.js',
  },
  {
    name: 'python',
    path: './vendors/codemirror/modes/python.js',
  },
  {
    name: 'sass',
    path: './vendors/codemirror/modes/sass.js',
  },
  {
    name: 'shell',
    path: './vendors/codemirror/modes/shell.js',
  },
  {
    name: 'vue',
    path: './vendors/codemirror/modes/vue.js',
  },
  {
    name: 'yaml',
    path: './vendors/codemirror/modes/yaml.js',
  },
  {
    name: 'scroll',
    path: './vendors/codemirror/addons/simplescrollbars.js',
  },
  {
    name: 'closebrackets',
    path: './vendors/codemirror/addons/closebrackets.js',
  },
  {
    name: 'closetag',
    path: './vendors/codemirror/addons/closetag.js',
  },
];
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
    // scripts.forEach((item) => {
    //   let script = this.renderer.createElement('script');
    //   script.src = item.path;
    //   script.async = false;
    //   this.renderer.appendChild(this.document.body, script);
    // });
  }
}
