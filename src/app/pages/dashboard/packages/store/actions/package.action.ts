import {
  Package,
  PackageRequest,
} from '../../shared/interfaces/packages.interface';

export class AddPackage {
  static readonly type = '[Package] Add';

  constructor(public payload: PackageRequest) {}
}

export class GetPackages {
  static readonly type = '[Package] Get';
  constructor(public id: string) {}
}
export class GetPackagesInFolder {
  static readonly type = '[Package] Get Packages in Folder';
  constructor(public id: string) {}
}

export class UpdatePackage {
  static readonly type = '[Package] Update';

  constructor(public id: string, public payload: Partial<PackageRequest>) {}
}

export class DeletePackage {
  static readonly type = '[Package] Delete';

  constructor(public id: string) {}
}

export class SetActivePackage {
  static readonly type = '[Package] Set Active';
  constructor(public payload: Package) {}
}
