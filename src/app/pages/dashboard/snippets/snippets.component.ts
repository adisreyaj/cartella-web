import { BreakpointObserver } from '@angular/cdk/layout';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ALL_SNIPPETS_FOLDER } from '@app/config/snippets.config';
import { Technology } from '@app/interfaces/technology.interface';
import { User } from '@app/interfaces/user.interface';
import { MenuService } from '@app/services/menu/menu.service';
import {
  StorageService,
  STORAGE_INSTANCE,
} from '@app/services/storage/storage.service';
import { TechnologyState } from '@app/store/states/technology.state';
import { DialogService } from '@ngneat/dialog';
import { Select, Store } from '@ngxs/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { SnippetsAddFolderComponent } from './components/modals/snippets-add-folder/snippets-add-folder.component';
import {
  Snippet,
  SnippetFolder,
  SNIPPET_MODES,
} from './interfaces/snippets.interface';
import {
  GetSnippetFolders,
  SetActiveSnippetFolder,
} from './store/actions/snippets-folders.action';
import { GetSnippets, SetActiveSnippet } from './store/actions/snippets.action';
import { SnippetFolderState } from './store/states/snippet-folders.state';
import { SnippetState } from './store/states/snippets.state';

@Component({
  selector: 'app-snippets',
  templateUrl: './snippets.component.html',
  styleUrls: ['./snippets.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SnippetsComponent implements OnInit, OnDestroy {
  user: User;

  @Select(SnippetState.getAllSnippets)
  allSnippets$: Observable<Snippet[]>;

  @Select(SnippetFolderState.getAllSnippetFolders)
  allSnippetFolders$: Observable<Snippet[]>;

  @Select(SnippetState.getSnippetsShown)
  snippetsShown$: Observable<Snippet[]>;

  @Select(SnippetState.getActiveSnippet)
  activeSnippet$: Observable<Snippet>;

  @Select(SnippetFolderState.getAllSnippetFolders)
  folders$: Observable<SnippetFolder[]>;

  @Select(SnippetFolderState.getActiveSnippetFolder)
  activeFolder$: Observable<SnippetFolder>;

  @Select(TechnologyState.getTechnologiesList)
  technologies$: Observable<Technology[]>;

  @Select(SnippetState.getSnippetFetched)
  snippetsFetched$: Observable<boolean>;

  @Select(SnippetFolderState.getSnippetFolderFetched)
  snippetFolderFetched$: Observable<boolean>;

  private snippetFolderLoadingSubject = new BehaviorSubject(false);
  snippetFolderLoading$ = this.snippetFolderLoadingSubject.pipe();

  private snippetLoadingSubject = new BehaviorSubject(false);
  snippetLoading$ = this.snippetLoadingSubject.pipe();

  isLargeScreen = true;
  private isLargeScreenSubject = new BehaviorSubject(this.isLargeScreen);
  isLargeScree$ = this.isLargeScreenSubject.pipe(
    tap((data) => (this.isLargeScreen = data))
  );

  private modeSubject = new BehaviorSubject(SNIPPET_MODES.EXPLORER);
  mode$ = this.modeSubject.pipe();
  availableModes = SNIPPET_MODES;

  isMenuOpen$: Observable<boolean>;

  private subs = new SubSink();
  constructor(
    private activatedRoute: ActivatedRoute,
    private store: Store,
    private dialog: DialogService,
    private menu: MenuService,
    private breakpointObserver: BreakpointObserver,
    private storage: StorageService
  ) {}

  ngOnInit(): void {
    this.getSnippetFolders();
    this.getSnippets();
    this.observeLayoutChanges();
    this.updateSnippetFoldersInIDB();
    this.updateSnippetsInIDB();
    this.isMenuOpen$ = this.menu.isMenuOpen$;
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  get snippetSlug() {
    return this.activatedRoute.snapshot.paramMap.get('slug');
  }

  closeMenu() {
    this.menu.closeMenu();
  }

  toggleMenu() {
    this.menu.toggleMenu();
  }

  changeMode(mode: SNIPPET_MODES) {
    this.modeSubject.next(mode);
  }

  handleSelectFolder(folder: SnippetFolder) {
    if (folder) {
      this.snippetLoadingSubject.next(true);
      this.store.dispatch(new SetActiveSnippetFolder(folder));
      this.store.dispatch(new SetActiveSnippet(null));
      const sub = this.store.dispatch(new GetSnippets(folder.id)).subscribe(
        () => {
          this.snippetLoadingSubject.next(false);
        },
        () => {
          this.snippetLoadingSubject.next(false);
        }
      );
      this.subs.add(sub);
    }
  }
  handleEditFolder(folder: SnippetFolder) {
    this.dialog.open(SnippetsAddFolderComponent, {
      size: 'sm',
      data: {
        folder,
        type: 'UPDATE',
      },
      enableClose: false,
    });
  }

  handleCreateFolder() {
    this.dialog.open(SnippetsAddFolderComponent, {
      size: 'sm',
      enableClose: false,
      data: {
        type: 'CREATE',
      },
    });
  }

  private getSnippets() {
    this.snippetLoadingSubject.next(true);
    const folderState = this.store.selectSnapshot(
      (state) => state.snippetFolders
    );
    this.store
      .dispatch(new GetSnippets(folderState?.activeSnippetFolder?.id))
      .subscribe(
        () => {
          this.snippetLoadingSubject.next(false);
        },
        () => {
          this.snippetLoadingSubject.next(false);
        }
      );
  }
  private getSnippetFolders() {
    this.snippetFolderLoadingSubject.next(true);
    const sub = this.store.dispatch(new GetSnippetFolders()).subscribe(
      () => {
        this.snippetFolderLoadingSubject.next(false);
      },
      () => {
        this.snippetFolderLoadingSubject.next(false);
      }
    );
    this.subs.add(sub);
    this.store.dispatch(new SetActiveSnippetFolder(ALL_SNIPPETS_FOLDER));
  }

  private observeLayoutChanges() {
    this.subs.add(
      this.breakpointObserver
        .observe(['(min-width: 768px)'])
        .subscribe((result) => {
          this.isLargeScreenSubject.next(result.matches);
        })
    );
  }

  private updateSnippetsInIDB() {
    const sub = this.allSnippets$
      .pipe(
        filter((res) => res.length > 0),
        tap((snippets) => {
          snippets.forEach((data) => {
            this.storage.setItem(
              STORAGE_INSTANCE.SNIPPETS,
              data.folder.id,
              snippets.filter(({ folder: { id } }) => id === data.folder.id)
            );
          });
        })
      )
      .subscribe();
    this.subs.add(sub);
  }
  private updateSnippetFoldersInIDB() {
    const sub = this.allSnippetFolders$
      .pipe(
        filter((res) => res.length > 0),
        tap((snippets) => {
          this.storage.setItem(STORAGE_INSTANCE.FOLDERS, 'snippets', snippets);
        })
      )
      .subscribe();
    this.subs.add(sub);
  }
}
