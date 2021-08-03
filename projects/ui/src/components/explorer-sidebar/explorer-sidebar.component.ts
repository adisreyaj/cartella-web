import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FolderBaseResponse } from '@cartella/interfaces/folder.interface';

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
  @Input() type: 'snippets' | 'bookmarks' | 'packages' = 'snippets';
  @Input() folders: FolderBaseResponse[] | null = [];
  @Input() activeFolder: FolderBaseResponse | null = null;
  @Input() isLoading: boolean | null = false;
  @Input() isFetched: boolean | null = false;

  @Output() sidebarEvent = new EventEmitter<ExplorerSidebarEvent>();

  constructor() {}

  ngOnInit(): void {}

  trackBy(_: number, { id }: { id: string }) {
    return id;
  }
  handleSelectFolder(folder: FolderBaseResponse) {
    this.sidebarEvent.emit({
      type: ExplorerSidebarEventType.select,
      data: folder,
    });
    this.closeMenu();
  }

  handleEditFolder(folder: FolderBaseResponse) {
    this.sidebarEvent.emit({
      type: ExplorerSidebarEventType.edit,
      data: folder,
    });
  }

  handleDeleteFolder(folder: FolderBaseResponse) {
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
