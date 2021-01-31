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
import { TechnologyState } from '@app/store/states/technology.state';
import { DialogService } from '@ngneat/dialog';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { SubSink } from 'subsink';
import { SnippetsAddFolderComponent } from './components/modals/snippets-add-folder/snippets-add-folder.component';
import { Snippet, SnippetFolder } from './interfaces/snippets.interface';
import { SnippetsService } from './services/snippet/snippets.service';
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
  private subs = new SubSink();

  user: User;

  @Select(SnippetState.getAllSnippets)
  allSnippets$: Observable<Snippet[]>;

  @Select(SnippetState.getSnippetsShown)
  snippetsShown$: Observable<Snippet[]>;

  @Select(SnippetState.getActiveSnippet)
  activeSnippet$: Observable<Snippet>;

  @Select(SnippetFolderState.getSnippetFoldersList)
  folders$: Observable<SnippetFolder[]>;

  @Select(SnippetFolderState.getActiveSnippetFolder)
  activeFolder$: Observable<SnippetFolder>;

  @Select(TechnologyState.getTechnologiesList)
  technologies$: Observable<Technology[]>;

  constructor(
    private snippetService: SnippetsService,
    private activatedRoute: ActivatedRoute,
    private store: Store,
    private dialog: DialogService
  ) {}

  ngOnInit(): void {
    this.getSnippetFolders();
    this.getSnippets();
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  get snippetSlug() {
    return this.activatedRoute.snapshot.paramMap.get('slug') ?? null;
  }

  handleSelectFolder(folder: SnippetFolder) {
    if (folder) {
      this.store.dispatch(new SetActiveSnippetFolder(folder));
      this.store.dispatch(new SetActiveSnippet(null));
      this.store.dispatch(new GetSnippets(folder.id));
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
    const folderState = this.store.selectSnapshot(
      (state) => state.snippetFolders
    );
    this.store.dispatch(new GetSnippets(folderState?.activeSnippetFolder?.id));
  }
  private getSnippetFolders() {
    this.store.dispatch(new GetSnippetFolders());
    this.store.dispatch(new SetActiveSnippetFolder(ALL_SNIPPETS_FOLDER));
  }
}
