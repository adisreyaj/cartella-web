import {
  BookmarkFolder,
  BookmarkFolderRequest,
} from '../../interfaces/bookmarks.interface';

export class AddBookmarkFolder {
  static readonly type = '[BookmarkFolder] Add';

  constructor(public payload: BookmarkFolderRequest) {}
}

export class GetBookmarkFolders {
  static readonly type = '[BookmarkFolder] Get';
}

export class UpdateBookmarkFolder {
  static readonly type = '[BookmarkFolder] Update';

  constructor(
    public id: string,
    public payload: Partial<BookmarkFolderRequest>
  ) {}
}

export class DeleteBookmarkFolder {
  static readonly type = '[BookmarkFolder] Delete';

  constructor(public id: string) {}
}

export class SetActiveBookmarkFolder {
  static readonly type = '[BookmarkFolder] Set Active';
  constructor(public payload: BookmarkFolder) {}
}
