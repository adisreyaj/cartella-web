import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { map, tap } from 'rxjs/operators';
import { PackageFolder } from '../../shared/interfaces/packages.interface';
import { PackagesService } from '../../shared/services/packages.service';
import {
  AddPackageFolder,
  DeletePackageFolder,
  GetPackageFolders,
  SetActivePackageFolder,
  UpdatePackageFolder,
} from '../actions/package-folders.action';

export class PackageFolderStateModel {
  packageFolders: PackageFolder[];
  activePackageFolder: PackageFolder;
}
@State({
  name: 'packageFolders',
})
@Injectable()
export class PackageFolderState {
  constructor(private packageService: PackagesService) {}

  @Selector()
  static getPackageFoldersList(state: PackageFolderStateModel) {
    return state.packageFolders;
  }

  @Selector()
  static getActivePackageFolder(state: PackageFolderStateModel) {
    return state.activePackageFolder;
  }

  @Action(GetPackageFolders)
  getPackageFolders({
    getState,
    setState,
  }: StateContext<PackageFolderStateModel>) {
    return this.packageService.getFolders().pipe(
      map(({ payload }) => payload),
      tap((result) => {
        const state = getState();
        setState({
          ...state,
          packageFolders: result,
        });
      })
    );
  }

  @Action(AddPackageFolder)
  addPackage(
    { getState, patchState }: StateContext<PackageFolderStateModel>,
    { payload }: AddPackageFolder
  ) {
    return this.packageService.createNewFolder(payload).pipe(
      tap((result) => {
        const state = getState();
        patchState({
          packageFolders: [...state.packageFolders, result],
        });
      })
    );
  }

  @Action(UpdatePackageFolder)
  updatePackage(
    { getState, setState }: StateContext<PackageFolderStateModel>,
    { payload, id }: UpdatePackageFolder
  ) {
    return this.packageService.updateFolder(id, payload).pipe(
      tap((result) => {
        const state = getState();
        const foldersList = [...state.packageFolders];
        const folderIndex = foldersList.findIndex((item) => item.id === id);
        foldersList[folderIndex] = result;
        setState({
          ...state,
          packageFolders: foldersList,
        });
      })
    );
  }

  @Action(DeletePackageFolder)
  deletePackage(
    { getState, setState }: StateContext<PackageFolderStateModel>,
    { id }: DeletePackageFolder
  ) {
    return this.packageService.deleteFolder(id).pipe(
      tap(() => {
        const state = getState();
        const filteredArray = state.packageFolders.filter(
          (item) => item.id !== id
        );
        setState({
          ...state,
          packageFolders: filteredArray,
        });
      })
    );
  }

  @Action(SetActivePackageFolder)
  setSelectedPackageId(
    { getState, setState }: StateContext<PackageFolderStateModel>,
    { payload }: SetActivePackageFolder
  ) {
    const state = getState();
    setState({
      ...state,
      activePackageFolder: payload,
    });
  }
}
