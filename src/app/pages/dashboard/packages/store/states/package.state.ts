import { Injectable } from '@angular/core';
import { StorageFolders } from '@app/services/storage/storage.interface';
import { StorageService } from '@app/services/storage/storage.service';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
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
  fetched: boolean;
  packagesShown: Package[];
  activePackage: Package;
}
@State({
  name: 'packages',
  defaults: {
    allPackages: [],
    packageFetched: false,
    packagesShown: [],
    activePackage: [],
  },
})
@Injectable()
export class PackageState {
  constructor(
    private packageService: PackagesService,
    private storage: StorageService
  ) {}

  @Selector()
  static isPackageFetched(state: PackageStateModel) {
    return state.fetched;
  }

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

  @Action(GetPackages, { cancelUncompleted: true })
  getPackages(
    { getState, setState, patchState }: StateContext<PackageStateModel>,
    { id }: GetPackages
  ) {
    switch (id) {
      case 'all':
        const state = getState();
        if (state.fetched) {
          return this.storage
            .getAllItems<Package>(StorageFolders.packages)
            .pipe(
              switchMap((packages) => {
                if (!packages) {
                  return this.packageService.getPackages().pipe(
                    map(({ payload }) => payload),
                    tap((result) => {
                      patchState({
                        packagesShown: result,
                      });
                    })
                  );
                } else {
                  patchState({
                    packagesShown: packages,
                  });
                  return of(packages);
                }
              })
            );
        } else {
          return this.packageService.getPackages().pipe(
            map(({ payload }) => payload),
            tap((result) => {
              setState({
                ...state,
                fetched: true,
                allPackages: result,
                packagesShown: result,
              });
            })
          );
        }
      case 'starred':
        return this.packageService.getFavoritePackages().pipe(
          map(({ payload }) => payload),
          tap((result) => {
            patchState({ packagesShown: result });
          })
        );
      default: {
        return this.storage.getItem(StorageFolders.packages, id).pipe(
          switchMap((packages) => {
            if (!packages) {
              return this.packageService.getPackagesInFolder(id).pipe(
                map(({ payload }) => payload),
                tap((result) => {
                  patchState({
                    packagesShown: result,
                  });
                })
              );
            } else {
              patchState({
                packagesShown: packages,
              });
              return of(packages);
            }
          })
        );
      }
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
    { getState, patchState }: StateContext<PackageStateModel>,
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
        patchState({
          allPackages: allPackageList,
          packagesShown: shownPackageList,
        });
      })
    );
  }

  @Action(DeletePackage)
  deletePackage(
    { getState, patchState }: StateContext<PackageStateModel>,
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
        patchState({
          allPackages: filteredAllPackages,
          packagesShown: filteredVisiblePackages,
        });
      })
    );
  }

  @Action(SetActivePackage, { cancelUncompleted: true })
  setSelectedPackageId(
    { getState, patchState }: StateContext<PackageStateModel>,
    { payload }: SetActivePackage
  ) {
    const state = getState();
    patchState({
      activePackage: payload,
    });
  }
}
