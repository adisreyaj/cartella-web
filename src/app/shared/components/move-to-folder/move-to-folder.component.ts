import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MoveToFolderModalPayload } from '@app/interfaces/move-to-folder.interface';
import { ToastService } from '@app/services/toast/toast.service';
import { WithDestroy } from '@app/services/with-destroy/with-destroy';
import { DialogRef } from '@ngneat/dialog';
import { Store } from '@ngxs/store';

@Component({
  selector: 'app-move-to-folder',
  templateUrl: './move-to-folder.component.html',
  styleUrls: ['./move-to-folder.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoveToFolderComponent extends WithDestroy implements OnInit {
  folderSelected = new FormControl('');
  constructor(
    public ref: DialogRef<MoveToFolderModalPayload>,
    private toaster: ToastService,
    private store: Store
  ) {
    super();
  }

  ngOnInit(): void {}

  get action() {
    const {
      data: { action },
    } = this.ref;
    return action;
  }

  get item() {
    const {
      data: { item },
    } = this.ref;
    return item;
  }

  save() {
    this.subs.add(
      this.store
        .dispatch(
          new this.action(this.item.id, {
            folderId: this.folderSelected.value,
          })
        )
        .subscribe(
          () => {
            this.ref.close(this.folderSelected.value);
          },
          (err) => {
            this.toaster.showErrorToast('Failed to move!');
          }
        )
    );
  }
}
