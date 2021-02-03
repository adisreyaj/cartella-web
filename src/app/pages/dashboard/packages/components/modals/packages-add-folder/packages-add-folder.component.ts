import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ToastService } from '@app/services/toast/toast.service';
import { DialogRef } from '@ngneat/dialog';
import { Store } from '@ngxs/store';
import { has } from 'lodash-es';
import { SubSink } from 'subsink';
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
export class PackagesAddFolderComponent implements OnInit, OnDestroy {
  @ViewChild('folderNameRef') folderNameRef: ElementRef;
  folderName = new FormControl('', [Validators.required]);

  private subs = new SubSink();
  constructor(
    public ref: DialogRef<PackageFolderAddModalPayload>,
    private toaster: ToastService,
    private store: Store
  ) {}

  ngOnInit(): void {
    if (this.ref?.data) {
      const { folder } = this.ref.data;
      this.folderName.setValue(folder?.name);
    }
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
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
    const sub = this.store
      .dispatch(
        new UpdatePackageFolder(folder.id, {
          name: this.folderName.value,
        })
      )
      .subscribe(
        () => {
          this.toaster.showSuccessToast('Folder updated successfully!');
          this.ref.close();
        },
        () => {
          this.toaster.showErrorToast('Failed to update the folder!');
        }
      );
    this.subs.add(sub);
  }

  async createFolder() {
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
          this.ref.close();
        },
        (err) => {
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
