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
import { SubSink } from 'subsink';
import { PackageFolder } from '../../../shared/interfaces/packages.interface';

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
  constructor(public ref: DialogRef, private toaster: ToastService) {}

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
    try {
    } catch (error) {
      this.toaster.showErrorToast('Failed to update folder');
    }
  }

  async createFolder() {}

  async deleteFolder(folder: PackageFolder) {
    if (folder) {
      try {
      } catch (error) {
        console.error(error);
        this.toaster.showErrorToast('Failed to delete folder');
      }
    }
  }

  close() {
    this.ref.close();
  }
}
