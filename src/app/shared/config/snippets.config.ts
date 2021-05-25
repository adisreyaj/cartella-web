import { FolderBaseResponse } from '@cartella/interfaces/folder.interface';
import { SnippetRequest } from '@cartella/snippets';
import { EditorConfiguration } from 'codemirror';

export const LANGUAGES_SUPPORTED = [
  { label: 'Javascript', value: 'javascript' },
  { label: 'Typescript', value: 'text/typescript' },
  { label: 'Html', value: 'htmlmixed' },
  { label: 'Python', value: 'python' },
  { label: 'Markdown', value: 'markdown' },
  { label: 'Shell', value: 'shell' },
  { label: 'CSS', value: 'css' },
  { label: 'SCSS', value: 'sass' },
];

export interface ThemesSupported {
  label: string;
  value: string;
  type: string;
}

export const THEMES_SUPPORTED: ThemesSupported[] = [
  {
    label: 'Material Darker',
    value: 'material-darker',
    type: 'dark',
  },
  {
    label: 'Material Palenight',
    value: 'material-palenight',
    type: 'dark',
  },
  {
    label: 'Dracula',
    value: 'dracula',
    type: 'dark',
  },
  {
    label: 'One Dark',
    value: 'one-dark',
    type: 'dark',
  },
  {
    label: 'One Light',
    value: 'one-light',
    type: 'light',
  },
];

export const DEFAULT_EDITOR_OPTIONS: EditorConfiguration & {
  [key: string]: any;
} = {
  theme: 'one-dark',
  mode: 'javascript',
  tabSize: 2,
  lineNumbers: true,
  // extraKeys: {
  //   Tab: 'emmetExpandAbbreviation',
  //   Esc: 'emmetResetAbbreviation',
  //   Enter: 'emmetInsertLineBreak',
  //   'Ctrl-Space': 'emmetCaptureAbbreviation',
  // },
  // emmet: {
  //   mark: true,
  //   markTagPairs: true,
  //   previewOpenTag: false,
  // },
};

export const ALL_SNIPPETS_FOLDER: FolderBaseResponse = {
  name: 'All Snippets',
  id: 'all',
  updatedAt: new Date(),
  createdAt: new Date(),
  share: [],
  metadata: null,
  private: true,
};

export const SNIPPET_TEMPLATE: Omit<SnippetRequest, 'ownerId' | 'technologyId' | 'folderId' | 'slug'> = {
  name: 'Untitled Snippet',
  code: '',
  description: '',
  favorite: false,
  metadata: {},
  private: true,
};
