import { TagRequest } from '@app/interfaces/tag.interface';

export class GetTags {
  static readonly type = '[Tag] Get Default';
}

export class GetCustomTags {
  static readonly type = '[Tag] Get Custom';
}

export class AddTag {
  static readonly type = '[Tag] Add';

  constructor(public payload: TagRequest) {}
}

export class UpdateTag {
  static readonly type = '[Tag] Update';

  constructor(public id: string, public payload: Partial<TagRequest>) {}
}

export class DeleteTag {
  static readonly type = '[Tag] Delete';

  constructor(public id: string) {}
}
