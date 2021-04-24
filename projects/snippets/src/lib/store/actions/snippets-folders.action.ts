import {
  SnippetFolder,
  SnippetFolderRequest,
} from '../../shared/interfaces/snippets.interface';

export class AddSnippetFolder {
  static readonly type = '[SnippetFolder] Add';

  constructor(public payload: SnippetFolderRequest) {}
}

export class GetSnippetFolders {
  static readonly type = '[SnippetFolder] Get';
}

export class UpdateSnippetFolder {
  static readonly type = '[SnippetFolder] Update';

  constructor(
    public id: string,
    public payload: Partial<SnippetFolderRequest>
  ) {}
}

export class DeleteSnippetFolder {
  static readonly type = '[SnippetFolder] Delete';

  constructor(public id: string) {}
}

export class SetActiveSnippetFolder {
  static readonly type = '[SnippetFolder] Set Active';
  constructor(public payload: SnippetFolder) {}
}
