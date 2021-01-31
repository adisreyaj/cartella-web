import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { DEFAULT_EDITOR_OPTIONS } from '@app/config/snippets.config';
import { DialogRef } from '@ngneat/dialog';
import * as codemirror from 'codemirror';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/keymap/sublime';
import 'codemirror/mode/css/css';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/mode/python/python';
import 'codemirror/mode/sass/sass';
import 'codemirror/mode/shell/shell';
import domtoimage from 'dom-to-image';
import { saveAs } from 'file-saver';
import { ScreenShotDialogPayload } from '../../../interfaces/snippets.interface';

@Component({
  selector: 'app-snippets-screenshot',
  templateUrl: './snippets-screenshot.component.html',
  styleUrls: ['./snippets-screenshot.component.scss'],
})
export class SnippetsScreenshotComponent implements OnInit, AfterViewInit {
  @ViewChild('codeContainerRef') codeContainerRef: ElementRef;
  @ViewChild('editor', { static: true }) editorRef: ElementRef;

  editor: codemirror.EditorFromTextArea;

  constructor(
    public ref: DialogRef<ScreenShotDialogPayload>,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.initializeEditor();
  }
  async exportCode() {
    if (this.codeContainerRef) {
      // this.attachWatermark(this.codeContainerRef.nativeElement);
      this.generateImage(this.codeContainerRef.nativeElement).then((blob) => {
        this.download(blob);
      });
      // setTimeout(() => {
      // }, 100);
    }
  }

  private download(blob: Blob) {
    saveAs(
      blob,
      `cartella-${this.ref.data.name ?? Math.floor(Math.random() * 100000)}.png`
    );
  }
  private async generateImage(node: HTMLElement) {
    return await domtoimage.toBlob(node, {
      width: node.scrollWidth,
      height: node.scrollHeight,
    });
  }

  private attachWatermark(node: HTMLElement) {
    const div = this.renderer.createElement('div');
    this.renderer.setStyle(div, 'position', 'absolute');
    this.renderer.setStyle(div, 'background', '#f2f2f2');
    this.renderer.setStyle(div, 'padding', '0.1rem 0.3rem');
    this.renderer.setStyle(div, 'border-bottom-right-radius', '4px');
    this.renderer.setStyle(div, 'border-top-left-radius', '4px');
    this.renderer.setStyle(div, 'bottom', '0');
    this.renderer.setStyle(div, 'right', '0');
    this.renderer.setStyle(div, 'display', 'flex');
    this.renderer.setStyle(div, 'align-items', 'center');
    const img = this.renderer.createElement('img');
    const textEl = this.renderer.createElement('p');
    const text = this.renderer.createText('Cartella');
    this.renderer.setStyle(textEl, 'font-size', '12px');
    this.renderer.setStyle(textEl, 'font-family', 'Inter, sans-serif');
    this.renderer.setStyle(textEl, 'margin-left', '2px');
    this.renderer.appendChild(textEl, text);
    const logo = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwMCIgaGVpZ2h0PSIxMDAwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik00ODYuMzg4IDQ3NS45ODdMMTI5Ljk2OSA3NTkuNjg5bDQ1NC4zOTYgNDAuMTEyIDM1Ni43MzMtMjg1LjUzOS00NTQuNzEtMzguMjc1eiIgZmlsbD0iIzNEMjlCRCIvPjxwYXRoIGQ9Ik01MDcuMzQgNTc2LjQ0MUwxNTAuOTIxIDg2MC4xNDNsNDU0LjM5NiA0MC4xMTIgMzU2LjczNC0yODUuNTM5LTQ1NC43MTEtMzguMjc1eiIgZmlsbD0iIzNEMjlCRCIvPjxwYXRoIGQ9Ik01MzAuOTc2IDYyMS4wNjNMMzM0LjA5OSA3NzcuNzc0bDI1MC45OTggMjIuMTU2IDE5Ny4wNTEtMTU3LjcyNS0yNTEuMTcyLTIxLjE0MnoiIGZpbGw9IiMyMjE2NzAiLz48cGF0aCBkPSJNNTMwLjk3NiA2MjEuMDYzTDMzNC4wOTkgNzc3Ljc3NGwyNTAuOTk4IDIyLjE1NiAxOTcuMDUxLTE1Ny43MjUtMjUxLjE3Mi0yMS4xNDJ6IiBmaWxsPSIjMjIxNjcwIi8+PHBhdGggZD0iTTQ1My4zODkgMzQ2Ljk4N0w5Ni45NzEgNjMwLjY4OWw0NTQuMzk2IDQwLjExMkw5MDguMSAzODUuMjYybC00NTQuNzExLTM4LjI3NXoiIGZpbGw9IiMzRDI5QkQiLz48cGF0aCBkPSJNNDk2Ljk4IDQ5Mi4wMDNsLTE5Ni44NzggMTU2LjcxTDU1MS4xIDY3MC44N2wxOTcuMDUxLTE1Ny43MjUtMjUxLjE3MS0yMS4xNDJ6IiBmaWxsPSIjMjIxNjcwIi8+PHBhdGggZD0iTTQ5Ni45OCA0OTIuMDAzbC0xOTYuODc4IDE1Ni43MUw1NTEuMSA2NzAuODdsMTk3LjA1MS0xNTcuNzI1LTI1MS4xNzEtMjEuMTQyeiIgZmlsbD0iIzIyMTY3MCIvPjxwYXRoIGQ9Ik00MjAuMzg5IDIyMS45ODdMNjMuOTcxIDUwNS42ODlsNDU0LjM5NiA0MC4xMTJMODc1LjEgMjYwLjI2MmwtNDU0LjcxMS0zOC4yNzV6IiBmaWxsPSIjM0QyOUJEIi8+PHBhdGggZD0iTTQ2My45OCAzNjcuMDAzbC0xOTYuODc4IDE1Ni43MUw1MTguMSA1NDUuODdsMTk3LjA1MS0xNTcuNzI1LTI1MS4xNzEtMjEuMTQyeiIgZmlsbD0iIzIyMTY3MCIvPjxwYXRoIGQ9Ik00NjMuOTggMzY3LjAwM2wtMTk2Ljg3OCAxNTYuNzFMNTE4LjEgNTQ1Ljg3bDE5Ny4wNTEtMTU3LjcyNS0yNTEuMTcxLTIxLjE0MnoiIGZpbGw9IiMyMjE2NzAiLz48cGF0aCBkPSJNMzg3LjM4OSA5OC45ODdMMzAuOTcxIDM4Mi42OWw0NTQuMzk2IDQwLjExMkw4NDIuMSAxMzcuMjYyIDM4Ny4zODkgOTguOTg3eiIgZmlsbD0iIzNEMjlCRCIvPjxwYXRoIGQ9Ik00MzAuOTggMjQ0LjAwM2wtMTk2Ljg3OCAxNTYuNzFMNDg1LjEgNDIyLjg3bDE5Ny4wNTEtMTU3LjcyNS0yNTEuMTcxLTIxLjE0MnoiIGZpbGw9IiMyMjE2NzAiLz48cGF0aCBkPSJNNDMwLjk4IDI0NC4wMDNsLTE5Ni44NzggMTU2LjcxTDQ4NS4xIDQyMi44N2wxOTcuMDUxLTE1Ny43MjUtMjUxLjE3MS0yMS4xNDJ6IiBmaWxsPSIjMjIxNjcwIi8+PC9zdmc+`;
    this.renderer.setAttribute(img, 'src', logo);
    this.renderer.setStyle(img, 'height', '25px');
    this.renderer.appendChild(div, img);
    this.renderer.appendChild(div, textEl);
    this.renderer.appendChild(node, div);
  }

  private initializeEditor() {
    if (this.editorRef) {
      this.editor = codemirror.fromTextArea(this.editorRef.nativeElement, {
        ...DEFAULT_EDITOR_OPTIONS,
        readOnly: 'nocursor',
        theme: localStorage.getItem('editor-theme') ?? 'one-light',
      });

      if (this.ref.data) {
        const { code, language, theme } = this.ref.data;
        this.editor.setValue(code);
        this.editor.setOption('mode', language.mode);
        this.editor.setOption('theme', theme);
      }
    }
  }
}
