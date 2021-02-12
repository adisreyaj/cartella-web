import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { DeletePromptComponent } from '@app/components/delete-prompt/delete-prompt.component';
import { ModalOperationType } from '@app/interfaces/general.interface';
import { Tag, TagAddModalPayload } from '@app/interfaces/tag.interface';
import { DeleteTag } from '@app/store/actions/tag.action';
import { TagState } from '@app/store/states/tag.state';
import { DialogService } from '@ngneat/dialog';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { TagsAddComponent } from '../modals/tags-add/tags-add.component';

@Component({
  selector: 'app-profile-tags',
  templateUrl: './profile-tags.component.html',
  styleUrls: ['./profile-tags.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileTagsComponent implements OnInit, OnDestroy {
  @Select(TagState.getCustomTagsList)
  tags$: Observable<Tag[]>;

  private subs = new SubSink();
  constructor(private store: Store, private dialog: DialogService) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  trackBy(_, tag: Tag) {
    return tag?.id;
  }

  handleCreateTag() {
    this.dialog.open<TagAddModalPayload>(TagsAddComponent, {
      size: 'sm',
      data: {
        type: ModalOperationType.CREATE,
      },
      enableClose: false,
    });
  }

  editTag(tag: Tag) {
    this.dialog.open<TagAddModalPayload>(TagsAddComponent, {
      size: 'sm',
      data: {
        type: ModalOperationType.UPDATE,
        tag,
      },
      enableClose: false,
    });
  }

  deleteTag(id: string) {
    const dialogRef = this.dialog.open(DeletePromptComponent, {
      size: 'sm',
      minHeight: 'unset',
    });
    this.subs.add(
      dialogRef.afterClosed$
        .pipe(
          tap((response) => {
            if (response) {
              this.store.dispatch(new DeleteTag(id));
            }
          })
        )
        .subscribe(() => {})
    );
  }
}
