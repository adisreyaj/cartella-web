import { ShareTo } from '@cartella/interfaces/share.interface';
import { Snippet, SnippetRequest } from '../../interfaces/snippets.interface';

export class AddSnippet {
  static readonly type = '[Snippet] Add';

  constructor(public payload: SnippetRequest) {}
}

export class GetSnippets {
  static readonly type = '[Snippet] Get';
  constructor(public id: string) {}
}
export class GetSnippetsInFolder {
  static readonly type = '[Snippet] Get Snippets in Folder';
  constructor(public id: string) {}
}

export class UpdateSnippet {
  static readonly type = '[Snippet] Update';

  constructor(public id: string, public payload: Partial<Snippet>) {}
}

export class DeleteSnippet {
  static readonly type = '[Snippet] Delete';

  constructor(public id: string) {}
}
export class ShareSnippet {
  static readonly type = '[Snippet] Share';

  constructor(public id: string, public shareTo: ShareTo[]) {}
}
export class UnShareSnippet {
  static readonly type = '[Snippet] Unshare';

  constructor(public id: string, public revoke: string[]) {}
}

export class SetActiveSnippet {
  static readonly type = '[Snippet] Set Active';
  constructor(public payload: Snippet) {}
}
export class SetActiveSnippetWithSlug {
  static readonly type = '[Snippet] Set Active with slug';
  constructor(public payload: string) {}
}
