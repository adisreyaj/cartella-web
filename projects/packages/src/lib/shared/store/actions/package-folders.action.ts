import { PackageFolder, PackageFolderRequest } from '../../interfaces/packages.interface';

export class AddPackageFolder {
  static readonly type = '[PackageFolder] Add';

  constructor(public payload: PackageFolderRequest) {}
}

export class GetPackageFolders {
  static readonly type = '[PackageFolder] Get';
}

export class UpdatePackageFolder {
  static readonly type = '[PackageFolder] Update';

  constructor(public id: string, public payload: Partial<PackageFolderRequest>) {}
}

export class DeletePackageFolder {
  static readonly type = '[PackageFolder] Delete';

  constructor(public id: string) {}
}

export class SetActivePackageFolder {
  static readonly type = '[PackageFolder] Set Active';
  constructor(public payload: PackageFolder) {}
}
