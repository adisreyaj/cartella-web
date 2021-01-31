import {
  Bookmark,
  BookmarkRequest,
} from '../../interfaces/bookmarks.interface';

export class AddBookmark {
  static readonly type = '[Bookmark] Add';

  constructor(public payload: BookmarkRequest) {}
}

export class GetBookmarks {
  static readonly type = '[Bookmark] Get';
  constructor(public id: string) {}
}
export class GetBookmarksInFolder {
  static readonly type = '[Bookmark] Get Bookmarks in Folder';
  constructor(public id: string) {}
}

export class UpdateBookmark {
  static readonly type = '[Bookmark] Update';

  constructor(public id: string, public payload: Partial<BookmarkRequest>) {}
}

export class DeleteBookmark {
  static readonly type = '[Bookmark] Delete';

  constructor(public id: string) {}
}

export class SetActiveBookmark {
  static readonly type = '[Bookmark] Set Active';
  constructor(public payload: Bookmark) {}
}
