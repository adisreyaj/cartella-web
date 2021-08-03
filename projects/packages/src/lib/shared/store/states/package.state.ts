import { Injectable } from '@angular/core';
import { BaseStorageService } from '@cartella/ui/services';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { append, patch, removeItem, updateItem } from '@ngxs/store/operators';
import { of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { Package } from '../../interfaces/packages.interface';
import { PackagesService } from '../../services/packages.service';
import { AddPackage, DeletePackage, GetPackages, SetActivePackage, UpdatePackage } from '../actions/package.action';

export class PackageStateModel {
  allPackages: Package[] = [];
  fetched: boolean = false;
  packagesShown: Package[] = [];
  activePackage: Package | undefined = undefined;
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
  constructor(private packageService: PackagesService, private storage: BaseStorageService<Package>) {}

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
  getPackages({ getState, setState, patchState }: StateContext<PackageStateModel>, { id }: GetPackages) {
    switch (id) {
      case 'all':
        const state = getState();
        if (state.fetched) {
          return this.storage.getAllItemsFromUserFolder().pipe(
            switchMap((packages) => {
              if (!packages) {
                return this.packageService.getPackages().pipe(
                  map(({ payload }) => payload),
                  tap((result) => {
                    patchState({
                      packagesShown: result,
                    });
                  }),
                );
              } else {
                patchState({
                  packagesShown: packages,
                });
                return of(packages);
              }
            }),
          );
        } else {
          return this.packageService.getPackages().pipe(
            map(({ payload }) => payload),
            tap((result) => {
              patchState({
                fetched: true,
                allPackages: result,
                packagesShown: result,
              });
            }),
          );
        }
      case 'starred':
        return this.storage.getItem(id).pipe(
          switchMap((packages) => {
            if (!packages) {
              return this.packageService.getFavoritePackages().pipe(
                map(({ payload }) => payload),
                tap((result) => {
                  patchState({ packagesShown: result });
                }),
              );
            } else {
              patchState({
                packagesShown: packages,
              });
              return of(packages);
            }
          }),
        );
      default: {
        return this.storage.getItem(id).pipe(
          switchMap((packages) => {
            if (!packages) {
              return this.packageService.getPackagesInFolder(id).pipe(
                map(({ payload }) => payload),
                tap((result) => {
                  patchState({
                    packagesShown: result,
                  });
                }),
              );
            } else {
              patchState({
                packagesShown: packages,
              });
              return of(packages);
            }
          }),
        );
      }
    }
  }

  @Action(AddPackage)
  addPackage({ getState, setState }: StateContext<PackageStateModel>, { payload }: AddPackage) {
    return this.packageService.createNewPackage(payload).pipe(
      tap((result) => {
        const state = getState();
        setState(
          patch({
            allPackages: append([result]),
            packagesShown: append([result]),
            activePackage: result,
          }),
        );
      }),
    );
  }

  @Action(UpdatePackage)
  updatePackage({ setState }: StateContext<PackageStateModel>, { payload, id }: UpdatePackage) {
    return this.packageService.updatePackage(id, payload).pipe(
      tap((result) => {
        setState(
          patch({
            allPackages: updateItem((item) => item?.id === id, result),
            packagesShown: updateItem((item) => item?.id === id, result),
          }),
        );
      }),
    );
  }

  @Action(DeletePackage)
  deletePackage({ setState }: StateContext<PackageStateModel>, { id }: DeletePackage) {
    return this.packageService.deletePackage(id).pipe(
      tap(() => {
        setState(
          patch({
            allPackages: removeItem<Package>((item) => item?.id !== id),
            packagesShown: removeItem<Package>((item) => item?.id !== id),
          }),
        );
      }),
    );
  }

  @Action(SetActivePackage, { cancelUncompleted: true })
  setSelectedPackageId({ getState, patchState }: StateContext<PackageStateModel>, { payload }: SetActivePackage) {
    const state = getState();
    patchState({
      activePackage: payload,
    });
  }
}
