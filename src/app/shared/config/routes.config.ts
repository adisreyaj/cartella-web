import { environment } from '@cartella/env/environment';

export const ROUTES = {
  auth: {
    login: 'login',
    loginSuccess: 'login/success',
    loginFailure: 'login/failure',
    signup: 'signup',
    resetPassword: 'reset-password',
  },
  dashboard: {
    snippets: 'snippets',
    bookmarks: 'bookmarks',
    packages: 'packages',
    profile: 'profile',
  },
};

export const ROUTE_DATA = {
  home: {
    feature: 'home',
    title: 'Cartella - All in one dev bookmark tool!',
    description: `Bookmark your favorite articles, libraries, code snippets and more.
          One place to collect them all.`,
    ogUrl: `${environment.hostname}`,
  },
  snippets: {
    feature: 'snippets',
    title: 'Snippets - Manage your code snippets! | Cartella',
    description: `Saw a really cool code snippet on the internet or want to save those repetitive code snippets? Cartella has you covered. 
    Save and share your favorite code snippets with ease.`,
    ogUrl: `${environment.hostname}/snippets`,
  },
  bookmarks: {
    feature: 'bookmarks',
    title: 'Bookmarks - Manage your articles and blogs! | Cartella',
    description: `Save all your favorite articles and blogs in one place so that you will never miss those gems. 
    Organize them in folders and add tags to easily find what you are looking for.`,
    ogUrl: `${environment.hostname}/bookmarks`,
  },
  packages: {
    feature: 'packages',
    title: 'Package - Organize your favorite libraries | Cartella',
    description: `Did you come across some awesome library someone shared on twitter, 
    and want to save it for later so that you will never forget the name?
    Packages section can help you add your favorite libraries with ease`,
    ogUrl: `${environment.hostname}/packages`,
  },
  profile: {
    feature: 'profile',
    title: 'Profile - Manage your profile  | Cartella',
    description: `Bookmark your favorite articles, libraries, code snippets and more.
          One place to collect them all.`,
    ogUrl: `${environment.hostname}/profile`,
  },
};
