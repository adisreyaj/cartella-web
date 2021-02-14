import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-explorer-sidebar',
  templateUrl: './explorer-sidebar.component.html',
  styleUrls: ['./explorer-sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExplorerSidebarComponent implements OnInit {
  @Input() type: 'snippets' | 'bookmarks' | 'packages';
  @Input() folders: any[];
  @Input() activeFolder: any;
  @Input() isLoading = false;
  @Input() isFetched = false;

  @Output() folderSelected = new EventEmitter();
  @Output() createFolder = new EventEmitter<void>();
  @Output() editFolder = new EventEmitter();
  @Output() menuClosed = new EventEmitter<void>();

  constructor() {}

  ngOnInit(): void {}

  trackBy(_, { id }: { id: string }) {
    return id;
  }
  handleSelectFolder(folder) {
    this.folderSelected.emit(folder);
    this.closeMenu();
  }
  handleEditFolder(folder) {
    this.editFolder.emit(folder);
  }
  handleCreateFolder() {
    this.createFolder.emit();
  }

  closeMenu() {
    this.menuClosed.emit();
  }
}
