import { EditorConfiguration } from 'codemirror';
import { SnippetRequest } from 'src/app/pages/dashboard/snippets/interfaces/snippets.interface';

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

export const THEMES_SUPPORTED = [
  {
    label: 'Material Darker',
    value: 'material-darker',
  },
  {
    label: 'Material Palenight',
    value: 'material-palenight',
  },
  {
    label: 'Dracula',
    value: 'dracula',
  },
  {
    label: 'One Dark',
    value: 'one-dark',
  },
  {
    label: 'One Light',
    value: 'one-light',
  },
];

export const DEFAULT_EDITOR_OPTIONS: EditorConfiguration & {
  [key: string]: any;
} = {
  theme: 'one-light',
  mode: 'javascript',
  tabSize: 2,
  lineNumbers: true,
  extraKeys: {
    Tab: 'emmetExpandAbbreviation',
    Esc: 'emmetResetAbbreviation',
    Enter: 'emmetInsertLineBreak',
    'Ctrl-Space': 'emmetCaptureAbbreviation',
  },
  emmet: {
    mark: true,
    markTagPairs: true,
    previewOpenTag: false,
  },
};

export const ALL_SNIPPETS_FOLDER = {
  name: 'All Snippets',
  normalizedName: 'all snippets',
  id: 'all',
  owner: null,
  updatedAt: null,
  createdAt: null,
  share: null,
  metadata: null,
  private: true,
  ownerId: null,
};

export const SNIPPET_TEMPLATE: Omit<
  SnippetRequest,
  'ownerId' | 'technologyId' | 'folderId' | 'slug'
> = {
  name: 'Untitled Snippet',
  code: '',
  description: '',
  favorite: false,
  metadata: {},
  private: true,
  share: {},
};
