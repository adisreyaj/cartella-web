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
import { DarkModeService } from '@app/services/dark-mode/dark-mode.service';
import { EditorThemeService } from '@app/services/theme/editor-theme.service';
import { WithDestroy } from '@app/services/with-destroy/with-destroy';
import { SnippetState } from '@app/snippets/store/states/snippets.state';
import { DialogService } from '@ngneat/dialog';
import { Select, Store } from '@ngxs/store';
import codemirror from 'codemirror';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/closetag';
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
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, take, tap } from 'rxjs/operators';
import screenfull from 'screenfull';
import {
  Snippet,
  SnippetModes,
} from '../../shared/interfaces/snippets.interface';
import { CodeEditorService } from '../../shared/services/code-editor/code-editor.service';
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
  extends WithDestroy
  implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @Select(SnippetState.getActiveSnippet)
  activeSnippet$: Observable<Snippet>;
  @Input() technologies: Technology[] = [];
  @Input() isLargeScreen = true;
  @Input() mode = SnippetModes.explorer;

  @Output() modeChanged = new EventEmitter<SnippetModes>();

  @ViewChild('editor', { static: true }) editorRef: ElementRef;
  @ViewChild('playground') playgroundRef: ElementRef;
  @ViewChild('snippetNameRef') snippetNameRef: ElementRef;

  availableThemes = THEMES_SUPPORTED;
  editor: codemirror.EditorFromTextArea;
  languageFormControl = new FormControl('javascript');
  themeFormControl = new FormControl(
    localStorage.getItem('editor-theme') ?? 'one-dark'
  );
  fullScreen$ = new BehaviorSubject(false);
  isDarkMode$: Observable<boolean>;

  snippetNameFormControl = new FormControl('');
  constructor(
    private editorThemeService: EditorThemeService,
    private darkMode: DarkModeService,
    private renderer: Renderer2,
    private dialog: DialogService,
    private store: Store,
    private codeEditorService: CodeEditorService
  ) {
    super();
  }

  ngOnInit(): void {
    this.isDarkMode$ = this.darkMode.isDarkMode$;
  }

  ngAfterViewInit(): void {
    if (this.isLargeScreen) {
      this.initializeEditor();
    }
    this.listenToLanguageChanges();
    this.listenToThemeChanges();
    this.listenToSnippetChanges();
    this.listenToDarkModeChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (has(changes, 'mode') && !this.editor && !this.isLargeScreen) {
      this.initializeEditor();
    }
  }

  ngOnDestroy() {
    super.ngOnDestroy();
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
    this.modeChanged.emit(SnippetModes.explorer);
  }

  save(activeSnippet: Snippet) {
    if (this.editor && activeSnippet) {
      this.store.dispatch(
        new UpdateSnippet(activeSnippet.id, {
          code: this.editor.getValue(),
          technologyId: this.languageFormControl.value,
        })
      );
    }
  }

  delete(activeSnippet: Snippet) {
    if (this.editor && activeSnippet) {
      const dialogRef = this.dialog.open(DeletePromptComponent, {
        size: 'sm',
        minHeight: 'unset',
      });
      this.subs.add(
        dialogRef.afterClosed$
          .pipe(
            tap((response) => {
              if (response) {
                this.store.dispatch(new DeleteSnippet(activeSnippet.id));
                this.store.dispatch(new SetActiveSnippet(null));
              }
            })
          )
          .subscribe(() => {})
      );
    }
  }

  exportAsImage(activeSnippet: Snippet) {
    this.dialog.open(SnippetsScreenshotComponent, {
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
        this.activeSnippet$.pipe(take(1)).subscribe((activeSnippet) => {
          if (element.value.trim() !== activeSnippet.name) {
            this.store.dispatch(
              new UpdateSnippet(activeSnippet.id, {
                name: element?.value?.trim() ?? 'Untitled Snippet',
              })
            );
          }
        });
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

  /**
   * Update the editor data and title when the
   * active snippet changes
   */
  private listenToSnippetChanges() {
    this.subs.add(
      this.activeSnippet$
        .pipe(filter((data) => data != null))
        .subscribe((snippet) => {
          this.populateEditorData(snippet);
          this.setSnippetName(snippet?.name);
        })
    );
  }

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

  /**
   * Update the editor mode when language changes
   * Language is searched from the Technologies list using
   * the id and then get the mode property for updating the editor
   */
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

  /**
   * When the user switches the dark mode, the editor
   * theme will be switched to the selected variant so that
   * there is no contrast bump on the screen
   */
  private listenToDarkModeChanges() {
    this.subs.add(
      this.isDarkMode$
        .pipe(
          tap((isDarkMode) => {
            if (this.editor) {
              const defaultTheme = isDarkMode ? 'one-dark' : 'one-light';
              this.themeFormControl.setValue(defaultTheme);
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
