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
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { DeletePromptComponent } from '@cartella/components/delete-prompt/delete-prompt.component';
import { SharePopupComponent } from '@cartella/components/share-popup/share-popup.component';
import { SharePopupPayload } from '@cartella/components/share-popup/share-popup.interface';
import { DEFAULT_EDITOR_OPTIONS, THEMES_SUPPORTED } from '@cartella/config/snippets.config';
import { FeatureType } from '@cartella/interfaces/general.interface';
import { Technology } from '@cartella/interfaces/technology.interface';
import { HasWriteAccessPipe } from '@cartella/pipes/has-write-access/has-write-access.pipe';
import { DarkModeService } from '@cartella/services/dark-mode/dark-mode.service';
import { EditorThemeService } from '@cartella/services/theme/editor-theme.service';
import { WithDestroy } from '@cartella/services/with-destroy/with-destroy';
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
import { Snippet, SnippetModes } from '../../shared/interfaces/snippets.interface';
import { CodeEditorService } from '../../shared/services/code-editor/code-editor.service';
import { SnippetState } from '../../shared/store';
import { DeleteSnippet, SetActiveSnippet, UpdateSnippet } from '../../shared/store/actions/snippets.action';
import { SnippetsScreenshotComponent } from '../modals/snippets-screenshot/snippets-screenshot.component';

@Component({
  selector: 'app-snippets-playground',
  templateUrl: './snippets-playground.component.html',
  styleUrls: ['./snippets-playground.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SnippetsPlaygroundComponent extends WithDestroy implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @Select(SnippetState.getActiveSnippet)
  activeSnippet$: Observable<Snippet>;
  @Input() technologies: Technology[] = [];
  @Input() isLargeScreen = true;
  @Input() mode = SnippetModes.explorer;

  @Output() modeChanged = new EventEmitter<SnippetModes>();

  @ViewChild('editor', { static: true }) editorRef: ElementRef | null = null;
  @ViewChild('playground') playgroundRef: ElementRef | null = null;
  @ViewChild('snippetNameRef') snippetNameRef: ElementRef | null = null;

  availableThemes = THEMES_SUPPORTED;
  editor: codemirror.EditorFromTextArea | null = null;
  languageFormControl = new FormControl('javascript');
  themeFormControl = new FormControl(localStorage.getItem('editor-theme') ?? 'one-dark');
  fullScreen$ = new BehaviorSubject(false);
  isDarkMode$: Observable<boolean> | null = null;

  snippetNameFormControl = new FormControl('');
  constructor(
    private editorThemeService: EditorThemeService,
    private darkMode: DarkModeService,
    private dialog: DialogService,
    private store: Store,
    private codeEditorService: CodeEditorService,
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
        }),
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
            }),
          )
          .subscribe(() => {}),
      );
    }
  }

  exportAsImage(activeSnippet: Snippet) {
    this.dialog.open(SnippetsScreenshotComponent, {
      size: 'lg',
      minHeight: 'auto',
      data: {
        name: this.snippetNameFormControl.value,
        code: this.editor?.getValue() || '',
        language: this.technologies.find(({ id }) => id === this.languageFormControl.value),
        theme: this.themeFormControl.value,
      },
    });
  }

  share(snippet: Snippet) {
    const dialogRef = this.dialog.open<SharePopupPayload>(SharePopupComponent, {
      size: 'md',
      minHeight: 'unset',
      enableClose: false,
      data: {
        entity: FeatureType.snippet,
        item: snippet,
      },
    });
    this.subs.add(
      dialogRef.afterClosed$
        .pipe(
          tap((response) => {
            if (response) {
            }
          }),
        )
        .subscribe(() => {}),
    );
  }

  updateSnippetName() {
    if (this.snippetNameRef) {
      const element = this.snippetNameRef.nativeElement;
      if (element.value.trim() === '') {
        element.focus();
        element.value = 'Untitled Snippet';
      } else {
        if (this.activeSnippet$)
          this.activeSnippet$.pipe(take(1)).subscribe((activeSnippet) => {
            if (element.value.trim() !== activeSnippet.name) {
              this.store.dispatch(
                new UpdateSnippet(activeSnippet.id, {
                  name: element?.value?.trim() ?? 'Untitled Snippet',
                }),
              );
            }
          });
      }
    }
  }

  /**
   * Update the editor data and title when the
   * active snippet changes
   */
  private listenToSnippetChanges() {
    if (this.activeSnippet$)
      this.subs.add(
        this.activeSnippet$.pipe(filter((data) => data != null)).subscribe((snippet) => {
          this.populateEditorData(snippet);
          this.checkAndDisableWriteActions(snippet);
          this.setSnippetName(snippet?.name);
        }),
      );
  }

  /**
   * User who is the owner or has the `write` permission
   * for shared user can edit the name of the snippet, and snippet itself
   * @param snippet - current active snippet
   */
  private checkAndDisableWriteActions(snippet: Snippet) {
    const hasWriteAccessPipe = new HasWriteAccessPipe(this.store);
    const hasWriteAccess = hasWriteAccessPipe.transform(snippet);
    if (!hasWriteAccess) {
      this.snippetNameFormControl.disable();
      this.languageFormControl.disable();
      this.editor?.setOption('readOnly', true);
    } else {
      this.snippetNameFormControl.enable();
      this.languageFormControl.enable();
      this.editor?.setOption('readOnly', false);
    }
  }

  private setSnippetName(name: string) {
    this.snippetNameFormControl.setValue(name);
  }
  private setEditorValue(value = '') {
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
          }),
        )
        .subscribe(),
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
          }),
        )
        .subscribe(),
    );
  }

  /**
   * When the user switches the dark mode, the editor
   * theme will be switched to the selected variant so that
   * there is no contrast bump on the screen
   */
  private listenToDarkModeChanges() {
    if (this.isDarkMode$)
      this.subs.add(
        this.isDarkMode$
          .pipe(
            tap((isDarkMode) => {
              if (this.editor) {
                const defaultTheme = isDarkMode ? 'one-dark' : 'one-light';
                this.themeFormControl.setValue(defaultTheme);
              }
            }),
          )
          .subscribe(),
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
    this.setEditorValue(code ?? '');
    this.setSnippetName(name);
    this.languageFormControl.setValue(id);
  }
}
