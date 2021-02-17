export interface FeatureConfiguration {
  darkMode: boolean;
  modules: Modules;
}

export interface Modules {
  signup: Bookmarks;
  home: Bookmarks;
  tags: Tags;
  profile: Bookmarks;
  bookmarks: Bookmarks;
  packages: Bookmarks;
  snippets: Snippets;
  snippetFolders: Folders;
  bookmarkFolders: Folders;
  packageFolders: Folders;
}

export interface Folders {
  create: boolean;
}

export interface Bookmarks {
  enabled: boolean;
}

export interface Snippets {
  enabled: boolean;
  share: boolean;
  screenshot: boolean;
  create: boolean;
  themeSwitcher: boolean;
}

export interface Tags {
  enabled: boolean;
  create: boolean;
}
