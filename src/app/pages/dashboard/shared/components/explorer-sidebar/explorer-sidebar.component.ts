import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';

export enum ExplorerSidebarEventType {
  edit,
  delete,
  select,
  closeMenu,
  createFolder,
}
export interface ExplorerSidebarEvent {
  type: ExplorerSidebarEventType;
  data: any;
}

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

  @Output() sidebarEvent = new EventEmitter<ExplorerSidebarEvent>();

  constructor() {}

  ngOnInit(): void {}

  trackBy(_, { id }: { id: string }) {
    return id;
  }
  handleSelectFolder(folder) {
    this.sidebarEvent.emit({
      type: ExplorerSidebarEventType.select,
      data: folder,
    });
    this.closeMenu();
  }

  handleEditFolder(folder) {
    this.sidebarEvent.emit({
      type: ExplorerSidebarEventType.edit,
      data: folder,
    });
  }

  handleDeleteFolder(folder) {
    this.sidebarEvent.emit({
      type: ExplorerSidebarEventType.delete,
      data: folder,
    });
  }

  handleCreateFolder() {
    this.sidebarEvent.emit({
      type: ExplorerSidebarEventType.createFolder,
      data: null,
    });
  }

  closeMenu() {
    this.sidebarEvent.emit({
      type: ExplorerSidebarEventType.closeMenu,
      data: null,
    });
  }
}
