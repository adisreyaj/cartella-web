import { Clipboard } from '@angular/cdk/clipboard';
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
import { SNIPPET_TEMPLATE } from '@cartella/config/snippets.config';
import { Technology } from '@cartella/interfaces/technology.interface';
import { NameGeneratorService } from '@cartella/services/name-generator/name-generator.service';
import { WithDestroy } from '@cartella/services/with-destroy/with-destroy';
import { TechnologyState } from '@cartella/store/states/technology.state';
import { Select, Store } from '@ngxs/store';
import { has } from 'lodash-es';
import { BehaviorSubject, fromEvent, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap, take } from 'rxjs/operators';
import {
  Snippet as Snippet,
  SnippetFolder,
  SnippetItemEvent,
  SnippetItemEventType,
  SnippetModes,
  SnippetRequest,
} from '../../shared/interfaces/snippets.interface';
import { AddSnippet, SetActiveSnippet, UpdateSnippet } from '../../shared/store/actions/snippets.action';
import { SnippetFolderState } from '../../shared/store/states/snippet-folders.state';
import { SnippetState } from '../../shared/store/states/snippets.state';
@Component({
  selector: 'app-snippets-sidebar',
  templateUrl: './snippets-sidebar.component.html',
  styleUrls: ['./snippets-sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SnippetsSidebarComponent extends WithDestroy implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @Input() snippets: Snippet[] = [];
  @Input() isLoading = false;
  @Input() isLargeScreen = true;
  @Input() mode = SnippetModes.explorer;

  @Output() modeChanged = new EventEmitter<SnippetModes>();
  @Output() snippetEvent = new EventEmitter<SnippetItemEvent>();

  @Select(SnippetState.getActiveSnippet)
  activeSnippet$: Observable<Snippet>;

  @Select(SnippetState.getSnippetFetched)
  snippetFetched$: Observable<boolean>;

  @Select(SnippetFolderState.getActiveSnippetFolder)
  activeFolder$: Observable<SnippetFolder>;

  @Select(TechnologyState.getTechnologiesList)
  technologies$: Observable<Technology[]>;

  private snippetsToShowSubject = new BehaviorSubject<Snippet[]>([]);
  snippetsToShow$ = this.snippetsToShowSubject.pipe();

  @ViewChild('searchRef') searchRef: ElementRef;

  constructor(private store: Store, private nameGeneratorService: NameGeneratorService, private clipboard: Clipboard) {
    super();
  }

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges): void {
    if (has(changes, 'snippets')) {
      if (changes.snippets.currentValue) {
        this.snippetsToShowSubject.next(changes.snippets.currentValue);
      }
    }
  }
  ngAfterViewInit() {
    this.listenToSearchInput();
  }

  trackBy(_, { id }: { id: string }) {
    return id;
  }

  handleSnippetShare(snippet: Snippet) {
    this.snippetEvent.emit({ type: SnippetItemEventType.share, snippet });
  }

  handleSnippetDelete(snippet: Snippet) {
    this.snippetEvent.emit({ type: SnippetItemEventType.delete, snippet });
  }

  handleSnippetMove(snippet: Snippet) {
    this.snippetEvent.emit({ type: SnippetItemEventType.move, snippet });
  }

  handleCopyToClipboard(snippet: Snippet) {
    this.clipboard.copy(snippet?.code);
  }

  selectSnippet(data: Snippet) {
    if (data) {
      if (!this.isLargeScreen) {
        this.modeChanged.emit(SnippetModes.editor);
      }
      this.store.dispatch(new SetActiveSnippet(data));
    }
  }

  toggleFavorite(snippet: Snippet) {
    if (snippet) {
      const { favorite, id } = snippet;
      this.store.dispatch(new UpdateSnippet(id, { favorite: !favorite }));
    }
  }

  createNewSnippet(technologyId: string) {
    this.activeFolder$
      .pipe(
        take(1),
        switchMap((activeFolder) => {
          const data: SnippetRequest = {
            ...SNIPPET_TEMPLATE,
            slug: this.nameGeneratorService.generate(),
            technologyId,
            folderId: activeFolder.id,
          };
          return this.store.dispatch(new AddSnippet(data));
        })
      )
      .subscribe(() => {});
  }

  private getFilteredSnippetsBasedOnSearchTerm(searchTerm = '') {
    if (searchTerm !== '' && this.snippets?.length > 0) {
      return this.snippets.filter(({ name }) => name.toLowerCase().includes(searchTerm));
    }
    return this.snippets;
  }
  private listenToSearchInput() {
    if (this.searchRef) {
      const sub = fromEvent(this.searchRef.nativeElement, 'keyup')
        .pipe(
          debounceTime(300),
          distinctUntilChanged(),
          map(() => this.searchRef.nativeElement.value)
        )
        .subscribe((searchTerm) => {
          const filteredSnippets = this.getFilteredSnippetsBasedOnSearchTerm(searchTerm);
          this.snippetsToShowSubject.next(filteredSnippets);
        });
      this.subs.add(sub);
    }
  }
}