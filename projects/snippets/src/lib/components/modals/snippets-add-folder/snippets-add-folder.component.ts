import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ToastService } from '@cartella/services/toast/toast.service';
import { WithDestroy } from '@cartella/services/with-destroy/with-destroy';
import { DialogRef } from '@ngneat/dialog';
import { Store } from '@ngxs/store';
import { has } from 'lodash-es';
import { BehaviorSubject } from 'rxjs';
import { SnippetFolder, SnippetFolderRequest } from '../../../shared/interfaces/snippets.interface';
import { AddSnippetFolder, UpdateSnippetFolder } from '../../../shared/store/actions/snippets-folders.action';

@Component({
  selector: 'app-snippets-add-folder',
  templateUrl: './snippets-add-folder.component.html',
  styleUrls: ['./snippets-add-folder.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SnippetsAddFolderComponent extends WithDestroy implements OnInit, AfterViewInit {
  @ViewChild('folderNameRef') folderNameRef: ElementRef;
  folderName = new FormControl('', [Validators.required]);

  private savingSubject = new BehaviorSubject<boolean>(false);
  readonly saving$ = this.savingSubject.pipe();
  constructor(public ref: DialogRef, private toaster: ToastService, private store: Store) {
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

  createOrUpdateFolder(folder: SnippetFolderRequest) {
    if (folder) {
      this.updateFolder(folder);
    } else {
      this.createFolder();
    }
  }

  async updateFolder(folder: Partial<SnippetFolder>) {
    this.savingSubject.next(true);
    const sub = this.store
      .dispatch(
        new UpdateSnippetFolder(folder.id, {
          name: this.folderName.value,
          metadata: {},
          private: true,
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
        new AddSnippetFolder({
          name: this.folderName.value,
          metadata: {},
          private: true,
        })
      )
      .subscribe(
        () => {
          this.savingSubject.next(false);
          this.toaster.showSuccessToast('Folder created successfully!');
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

  close() {
    this.ref.close();
  }
}
