import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ToastService } from '@app/services/toast/toast.service';
import { WithDestroy } from '@app/services/with-destroy/with-destroy';
import { DialogRef } from '@ngneat/dialog';
import { Store } from '@ngxs/store';
import { has } from 'lodash-es';
import { BehaviorSubject } from 'rxjs';
import {
  PackageFolder,
  PackageFolderAddModalPayload,
} from '../../../shared/interfaces/packages.interface';
import {
  AddPackageFolder,
  DeletePackageFolder,
  UpdatePackageFolder,
} from '../../../store/actions/package-folders.action';

@Component({
  selector: 'app-packages-add-folder',
  templateUrl: './packages-add-folder.component.html',
  styleUrls: ['./packages-add-folder.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PackagesAddFolderComponent
  extends WithDestroy
  implements OnInit, AfterViewInit {
  @ViewChild('folderNameRef') folderNameRef: ElementRef;
  folderName = new FormControl('', [Validators.required]);

  private savingSubject = new BehaviorSubject<boolean>(false);
  saving$ = this.savingSubject.pipe();

  constructor(
    public ref: DialogRef<PackageFolderAddModalPayload>,
    private toaster: ToastService,
    private store: Store
  ) {
    super();
  }

  ngOnInit(): void {
    if (this.ref?.data) {
      const { folder } = this.ref.data;
      this.folderName.setValue(folder?.name);
    }
  }

  ngAfterViewInit() {
    if (this.folderNameRef) {
      this.folderNameRef?.nativeElement?.focus();
    }
  }

  createOrUpdateFolder(folder: PackageFolder) {
    if (folder) {
      this.updateFolder(folder);
    } else {
      this.createFolder();
    }
  }

  async updateFolder(folder: PackageFolder) {
    this.savingSubject.next(true);
    const sub = this.store
      .dispatch(
        new UpdatePackageFolder(folder.id, {
          name: this.folderName.value,
        })
      )
      .subscribe(
        () => {
          this.savingSubject.next(false);
          this.toaster.showSuccessToast('Folder updated successfully!');
          this.ref.close();
        },
        () => {
          this.savingSubject.next(false);
          this.toaster.showErrorToast('Failed to update the folder!');
        }
      );
    this.subs.add(sub);
  }

  async createFolder() {
    this.savingSubject.next(true);
    const sub = this.store
      .dispatch(
        new AddPackageFolder({
          name: this.folderName.value,
          metadata: {},
          private: true,
          share: [],
        })
      )
      .subscribe(
        () => {
          this.savingSubject.next(false);
          this.ref.close();
        },
        (err) => {
          this.savingSubject.next(false);
          if (has(err, 'error.message')) {
            this.toaster.showErrorToast(err.error.message);
          } else {
            this.toaster.showErrorToast('Folder was not created!');
          }
        }
      );
    this.subs.add(sub);
  }

  async deleteFolder(folder: PackageFolder) {
    const sub = this.store
      .dispatch(new DeletePackageFolder(folder.id))
      .subscribe(
        () => {
          this.toaster.showSuccessToast('Folder deleted successfully!');
          this.ref.close();
        },
        (err) => {
          if (has(err, 'error.message')) {
            this.toaster.showErrorToast(err.error.message);
          } else {
            this.toaster.showErrorToast('Folder was not deleted!');
          }
        }
      );
    this.subs.add(sub);
  }

  close() {
    this.ref.close();
  }
}
