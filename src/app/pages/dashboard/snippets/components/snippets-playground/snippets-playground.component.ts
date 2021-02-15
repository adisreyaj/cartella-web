import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { DeletePromptComponent } from '@app/components/delete-prompt/delete-prompt.component';
import {
  DEFAULT_EDITOR_OPTIONS,
  THEMES_SUPPORTED,
} from '@app/config/snippets.config';
import { Technology } from '@app/interfaces/technology.interface';
import { EditorThemeService } from '@app/services/theme/editor-theme.service';
import { DialogService } from '@ngneat/dialog';
import { Store } from '@ngxs/store';
import codemirror from 'codemirror';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/closetag';
import 'codemirror/keymap/sublime';
import 'codemirror/mode/css/css.js';
import 'codemirror/mode/dart/dart';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/jsx/jsx';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/mode/python/python';
import 'codemirror/mode/sass/sass';
import 'codemirror/mode/shell/shell';
import 'codemirror/mode/vue/vue';
import 'codemirror/mode/yaml/yaml';
import { has } from 'lodash-es';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import screenfull from 'screenfull';
import { SubSink } from 'subsink';
import { Snippet, SNIPPET_MODES } from '../../interfaces/snippets.interface';
import { CodeEditorService } from '../../services/code-editor/code-editor.service';
import { SnippetsService } from '../../services/snippet/snippets.service';
import {
  DeleteSnippet,
  SetActiveSnippet,
  UpdateSnippet,
} from '../../store/actions/snippets.action';
import { SnippetsScreenshotComponent } from '../modals/snippets-screenshot/snippets-screenshot.component';

@Component({
  selector: 'app-snippets-playground',
  templateUrl: './snippets-playground.component.html',
  styleUrls: ['./snippets-playground.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SnippetsPlaygroundComponent
  implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @Input() activeSnippet: Snippet;
  @Input() technologies: Technology[] = [];
  @Input() isLargeScreen = true;
  @Input() mode = SNIPPET_MODES.EXPLORER;

  @Output() modeChanged = new EventEmitter<SNIPPET_MODES>();

  @ViewChild('editor', { static: true }) editorRef: ElementRef;
  @ViewChild('playground') playgroundRef: ElementRef;
  @ViewChild('snippetNameRef') snippetNameRef: ElementRef;

  availableThemes = THEMES_SUPPORTED;
  editor: codemirror.EditorFromTextArea;
  languageFormControl = new FormControl('javascript');
  themeFormControl = new FormControl(
    localStorage.getItem('editor-theme') ?? 'one-light'
  );
  fullScreen$ = new BehaviorSubject(false);

  snippetNameFormControl = new FormControl('');
  private subs = new SubSink();
  constructor(
    private editorThemeService: EditorThemeService,
    private snippetService: SnippetsService,
    private renderer: Renderer2,
    private dialog: DialogService,
    private store: Store,
    private codeEditorService: CodeEditorService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (this.isLargeScreen) {
      this.initializeEditor();
    }
    this.listenToLanguageChanges();
    this.listenToThemeChanges();
    this.listenToSnippetChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (has(changes, 'activeSnippet')) {
      const data: Snippet = changes.activeSnippet.currentValue;
      if (data) {
        this.activeSnippet = data;
        if (this.editor) {
          this.populateEditorData(data);
        }
      }
    }
    if (has(changes, 'mode') && !this.editor && !this.isLargeScreen) {
      this.initializeEditor();
      if (this.activeSnippet) {
        this.populateEditorData(this.activeSnippet);
      }
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
    (screenfull as screenfull.Screenfull).off(
      'change',
      this.handleFullscreenChange
    );
  }

  emptyFunction() {}

  get currentCode() {
    if (this.editor) {
      return this.editor.getValue();
    }
    return '';
  }

  goBack() {
    this.modeChanged.emit(SNIPPET_MODES.EXPLORER);
  }

  save() {
    if (this.editor && this.activeSnippet) {
      this.store.dispatch(
        new UpdateSnippet(this.activeSnippet.id, {
          code: this.editor.getValue(),
          technologyId: this.languageFormControl.value,
        })
      );
    }
  }

  delete() {
    if (this.editor && this.activeSnippet) {
      const dialogRef = this.dialog.open(DeletePromptComponent, {
        size: 'sm',
        minHeight: 'unset',
      });
      this.subs.add(
        dialogRef.afterClosed$
          .pipe(
            tap((response) => {
              if (response) {
                this.store.dispatch(new DeleteSnippet(this.activeSnippet.id));
                this.store.dispatch(new SetActiveSnippet(null));
              }
            })
          )
          .subscribe(() => {})
      );
    }
  }

  exportAsImage() {
    const dialogRef = this.dialog.open(SnippetsScreenshotComponent, {
      size: 'lg',
      minHeight: 'auto',
      data: {
        name: this.snippetNameFormControl.value,
        code: this.editor.getValue(),
        language: this.technologies.find(
          ({ id }) => id === this.languageFormControl.value
        ),
        theme: this.themeFormControl.value,
      },
    });
  }

  updateSnippetName() {
    if (this.snippetNameRef) {
      const element = this.snippetNameRef.nativeElement;
      if (element.value.trim() === '') {
        element.focus();
        element.value = 'Untitled Snippet';
      } else {
        if (element.value.trim() !== this.activeSnippet.name) {
          this.store.dispatch(
            new UpdateSnippet(this.activeSnippet.id, {
              name: element?.value?.trim() ?? 'Untitled Snippet',
            })
          );
        }
      }
    }
  }

  toggleFullScreen() {
    const fullScreen = screenfull as screenfull.Screenfull;
    if (screenfull.isEnabled) {
      screenfull.toggle();
    }
    fullScreen.on('change', this.handleFullscreenChange);
  }

  private listenToSnippetChanges() {}

  private handleFullscreenChange = () => {
    if ((screenfull as screenfull.Screenfull).isFullscreen) {
      this.fullScreen$.next(true);
      this.enableEditorFullScreen();
    } else {
      this.fullScreen$.next(false);
      this.disableEditorFullScreen();
    }
  };

  private enableEditorFullScreen() {
    if (this.playgroundRef) {
      this.renderer.addClass(
        this.playgroundRef.nativeElement,
        'playground--fullscreen'
      );
    }
  }

  private disableEditorFullScreen() {
    if (this.playgroundRef) {
      this.renderer.removeClass(
        this.playgroundRef.nativeElement,
        'playground--fullscreen'
      );
    }
  }

  private setSnippetName(name: string) {
    this.snippetNameFormControl.setValue(name);
  }
  private setEditorValue(value: string) {
    if (this.editor) {
      this.editor.setValue(value);
    }
  }

  private setEditorTheme(theme: string) {
    if (this.editor) {
      this.editor.setOption('theme', theme);
    }
  }
  private setEditorMode(mode: string) {
    if (this.editor) {
      this.editor.setOption('mode', mode);
    }
  }
  private listenToLanguageChanges() {
    this.subs.add(
      this.languageFormControl.valueChanges
        .pipe(
          tap((lng) => {
            if (this.editor && lng) {
              const technology = this.technologies.find(({ id }) => id === lng);
              if (technology) {
                this.setEditorMode(technology.mode);
              }
            }
          })
        )
        .subscribe()
    );
  }
  private listenToThemeChanges() {
    this.subs.add(
      this.themeFormControl.valueChanges
        .pipe(
          tap((theme) => {
            if (this.editor && theme) {
              localStorage.setItem('editor-theme', theme);
              this.editorThemeService.loadTheme(theme);
              this.setEditorTheme(theme);
            }
          })
        )
        .subscribe()
    );
  }
  private initializeEditor() {
    this.codeEditorService.injectCustomScripts();
    if (this.editorRef) {
      this.editor = codemirror.fromTextArea(this.editorRef.nativeElement, {
        ...DEFAULT_EDITOR_OPTIONS,
        scrollbarStyle: 'null',
        theme: localStorage.getItem('editor-theme') ?? 'one-light',
      });
    }
  }

  private populateEditorData(data: Snippet) {
    const {
      code,
      technology: { id },
      name,
    } = data;
    this.setEditorValue(code);
    this.setSnippetName(name);
    this.languageFormControl.setValue(id);
  }
}
