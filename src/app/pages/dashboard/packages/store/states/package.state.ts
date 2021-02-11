import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { map, tap } from 'rxjs/operators';
import { Package } from '../../shared/interfaces/packages.interface';
import { PackagesService } from '../../shared/services/packages.service';
import {
  AddPackage,
  DeletePackage,
  GetPackages,
  SetActivePackage,
  UpdatePackage,
} from '../actions/package.action';

export class PackageStateModel {
  allPackages: Package[];
  packagesShown: Package[];
  activePackage: Package;
}
@State({
  name: 'packages',
})
@Injectable()
export class PackageState {
  constructor(private packageService: PackagesService) {}

  @Selector()
  static getAllPackages(state: PackageStateModel) {
    return state.allPackages;
  }
  @Selector()
  static getPackagesShown(state: PackageStateModel) {
    return state.packagesShown;
  }

  @Selector()
  static getActivePackage(state: PackageStateModel) {
    return state.activePackage;
  }

  @Action(GetPackages)
  getPackages(
    { getState, setState }: StateContext<PackageStateModel>,
    { id }: GetPackages
  ) {
    switch (id) {
      case 'all':
        return this.packageService.getPackages().pipe(
          map(({ payload }) => payload),
          tap((result) => {
            const state = getState();
            setState({
              ...state,
              allPackages: result,
              packagesShown: result,
            });
          })
        );
      case 'starred':
        return this.packageService.getFavoritePackages().pipe(
          map(({ payload }) => payload),
          tap((result) => {
            const state = getState();
            setState({
              ...state,
              packagesShown: result,
            });
          })
        );
      default:
        return this.packageService.getPackagesInFolder(id).pipe(
          map(({ payload }) => payload),
          tap((result) => {
            const state = getState();
            setState({
              ...state,
              packagesShown: result,
            });
          })
        );
    }
  }

  @Action(AddPackage)
  addPackage(
    { getState, patchState }: StateContext<PackageStateModel>,
    { payload }: AddPackage
  ) {
    return this.packageService.createNewPackage(payload).pipe(
      tap((result) => {
        const state = getState();
        patchState({
          allPackages: [...state.allPackages, result],
          packagesShown: [...state.packagesShown, result],
          activePackage: result,
        });
      })
    );
  }

  @Action(UpdatePackage)
  updatePackage(
    { getState, setState }: StateContext<PackageStateModel>,
    { payload, id }: UpdatePackage
  ) {
    return this.packageService.updatePackage(id, payload).pipe(
      tap((result) => {
        const state = getState();
        const allPackageList = [...state.allPackages];
        const packageIndex = allPackageList.findIndex((item) => item.id === id);
        allPackageList[packageIndex] = result;
        const shownPackageList = [...state.packagesShown];
        const shownPackageIndex = shownPackageList.findIndex(
          (item) => item.id === id
        );
        shownPackageList[shownPackageIndex] = result;
        setState({
          ...state,
          allPackages: allPackageList,
          packagesShown: shownPackageList,
        });
      })
    );
  }

  @Action(DeletePackage)
  deletePackage(
    { getState, setState }: StateContext<PackageStateModel>,
    { id }: DeletePackage
  ) {
    return this.packageService.deletePackage(id).pipe(
      tap(() => {
        const state = getState();
        const filteredAllPackages = state.allPackages.filter(
          (item) => item.id !== id
        );
        const filteredVisiblePackages = state.packagesShown.filter(
          (item) => item.id !== id
        );
        setState({
          ...state,
          allPackages: filteredAllPackages,
          packagesShown: filteredVisiblePackages,
        });
      })
    );
  }

  @Action(SetActivePackage)
  setSelectedPackageId(
    { getState, setState }: StateContext<PackageStateModel>,
    { payload }: SetActivePackage
  ) {
    const state = getState();
    setState({
      ...state,
      activePackage: payload,
    });
  }
}
