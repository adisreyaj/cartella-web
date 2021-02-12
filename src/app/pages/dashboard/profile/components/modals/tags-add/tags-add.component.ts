import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ModalOperationType } from '@app/interfaces/general.interface';
import { Tag, TagAddModalPayload } from '@app/interfaces/tag.interface';
import { ToastService } from '@app/services/toast/toast.service';
import { AddTag, DeleteTag, UpdateTag } from '@app/store/actions/tag.action';
import { DialogRef } from '@ngneat/dialog';
import { Store } from '@ngxs/store';
import { has } from 'lodash-es';
import { ColorEvent } from 'ngx-color';
import { TwitterComponent } from 'ngx-color/twitter';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-tags-add',
  templateUrl: './tags-add.component.html',
  styleUrls: ['./tags-add.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagsAddComponent implements OnInit, AfterViewInit {
  @ViewChild('tagNameRef') tagNameRef: ElementRef;
  @ViewChild(TwitterComponent) colorPickerRef: TwitterComponent;
  tagName = new FormControl('', [Validators.required]);
  tagColor = '#ff595e';
  colors = [
    '#ff595e',
    '#fe5d9f',
    '#f26419',
    '#ffca3a',
    '#8ac926',
    '#1982c4',
    '#6a4c93',
    '#0a2472',
    '#156064',
    '#00c49a',
  ];

  private subs = new SubSink();
  constructor(
    public ref: DialogRef<TagAddModalPayload>,
    private cdr: ChangeDetectorRef,
    private toaster: ToastService,
    private store: Store
  ) {}

  ngOnInit(): void {
    if (this.ref?.data) {
      const { tag, type } = this.ref.data;
      if (type === ModalOperationType.UPDATE) {
        this.tagName.setValue(tag?.name);
        this.tagColor = tag.color;
        this.cdr.detectChanges();
      }
    }
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  ngAfterViewInit() {
    if (this.tagNameRef) {
      this.tagNameRef?.nativeElement?.focus();
    }
  }

  handleColorChange(event: ColorEvent) {
    this.tagColor = event.color.hex;
  }

  createOrUpdateTag(tag: Tag) {
    if (tag) {
      this.updateTag(tag);
    } else {
      this.createTag();
    }
  }

  async updateTag(tag: Tag) {
    const sub = this.store
      .dispatch(
        new UpdateTag(tag.id, {
          name: this.tagName.value,
        })
      )
      .subscribe(
        () => {
          this.toaster.showSuccessToast('Tag updated successfully!');
          this.ref.close();
        },
        () => {
          this.toaster.showErrorToast('Failed to update the tag!');
        }
      );
    this.subs.add(sub);
  }

  async createTag() {
    const sub = this.store
      .dispatch(
        new AddTag({
          name: this.tagName.value,
          color: this.tagColor,
          metadata: {},
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
            this.toaster.showErrorToast('Tag was not created!');
          }
        }
      );
    this.subs.add(sub);
  }

  async deleteTag(tag: Tag) {
    const sub = this.store.dispatch(new DeleteTag(tag.id)).subscribe(
      () => {
        this.toaster.showSuccessToast('Tag deleted successfully!');
        this.ref.close();
      },
      (err) => {
        if (has(err, 'error.message')) {
          this.toaster.showErrorToast(err.error.message);
        } else {
          this.toaster.showErrorToast('Tag was not deleted!');
        }
      }
    );
    this.subs.add(sub);
  }

  close() {
    this.ref.close();
  }
}
