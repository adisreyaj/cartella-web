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

  @Output() folderSelected = new EventEmitter();
  @Output() createFolder = new EventEmitter<void>();
  @Output() editFolder = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}

  trackBy(_, { id }: { id: string }) {
    return id;
  }
  handleSelectFolder(folder) {
    this.folderSelected.emit(folder);
  }
  handleEditFolder(folder) {
    this.editFolder.emit(folder);
  }
  handleCreateFolder() {
    this.createFolder.emit();
  }
}
