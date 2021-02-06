import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Tag } from '@app/interfaces/tag.interface';
import { TagState } from '@app/store/states/tag.state';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile-tags',
  templateUrl: './profile-tags.component.html',
  styleUrls: ['./profile-tags.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileTagsComponent implements OnInit {
  @Select(TagState.getCustomTagsList)
  tags$: Observable<Tag[]>;

  constructor() {}

  ngOnInit(): void {}
}
