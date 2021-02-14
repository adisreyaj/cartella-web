import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { SNIPPET_TEMPLATE } from '@app/config/snippets.config';
import { Technology } from '@app/interfaces/technology.interface';
import { NameGeneratorService } from '@app/services/name-generator/name-generator.service';
import { TechnologyState } from '@app/store/states/technology.state';
import { Select, Store } from '@ngxs/store';
import { has } from 'lodash-es';
import { BehaviorSubject, fromEvent, Observable } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
  take,
} from 'rxjs/operators';
import { SubSink } from 'subsink';
import {
  Snippet as Snippet,
  SnippetFolder,
  SnippetRequest,
} from '../../interfaces/snippets.interface';
import {
  AddSnippet,
  SetActiveSnippet,
  UpdateSnippet,
} from '../../store/actions/snippets.action';
import { SnippetFolderState } from '../../store/states/snippet-folders.state';
import { SnippetState } from '../../store/states/snippets.state';
@Component({
  selector: 'app-snippets-sidebar',
  templateUrl: './snippets-sidebar.component.html',
  styleUrls: ['./snippets-sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SnippetsSidebarComponent
  implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @Input() snippets: Snippet[] = [];
  @Input() isLoading = false;

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

  private subs = new SubSink();

  @ViewChild('searchRef') searchRef: ElementRef;

  constructor(
    private store: Store,
    private nameGeneratorService: NameGeneratorService
  ) {}

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

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  trackBy(_, { id }: { id: string }) {
    return id;
  }
  selectSnippet(data: Snippet) {
    if (data) {
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
      return this.snippets.filter(({ name }) =>
        name.toLowerCase().includes(searchTerm)
      );
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
          const filteredSnippets = this.getFilteredSnippetsBasedOnSearchTerm(
            searchTerm
          );
          this.snippetsToShowSubject.next(filteredSnippets);
        });
      this.subs.add(sub);
    }
  }
}
