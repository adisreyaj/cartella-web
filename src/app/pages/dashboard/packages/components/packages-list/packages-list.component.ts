import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { DeletePromptComponent } from '@app/components/delete-prompt/delete-prompt.component';
import { User } from '@app/interfaces/user.interface';
import { MenuService } from '@app/services/menu/menu.service';
import { DialogService } from '@ngneat/dialog';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { HomeState } from '../../../home/shared/store/states/home.state';
import {
  Package,
  PackageCardEvent,
  PackageCardEventType,
  PackageFolder,
} from '../../shared/interfaces/packages.interface';
import {
  DeletePackage,
  UpdatePackage,
} from '../../store/actions/package.action';
import { PackageFolderState } from '../../store/states/package-folders.state';
import { PackageState } from '../../store/states/package.state';
import { PackagesAddComponent } from '../modals/packages-add/packages-add.component';

@Component({
  selector: 'app-packages-list',
  templateUrl: './packages-list.component.html',
  styleUrls: ['./packages-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PackagesListComponent implements OnInit {
  @Input() user: User;
  @Input() activeFolder: PackageFolder;
  @Input() folders: PackageFolder[];
  @Input() packages: Package[] = [];
  @Input() isLoading = false;

  packagesCount = new Array(
    this.store.selectSnapshot(HomeState.getItemsCount)?.items?.packages
  ).fill('');

  @Select(PackageFolderState.getActivePackageFolder)
  activeFolder$: Observable<PackageFolder>;

  @Select(PackageState.isPackageFetched)
  fetched$: Observable<boolean>;

  private subs = new SubSink();
  constructor(
    private dialog: DialogService,
    private store: Store,
    private menu: MenuService
  ) {}

  ngOnInit(): void {}

  toggleMenu() {
    this.menu.toggleMenu();
  }

  trackBy(_, { id }: { id: string }) {
    return id;
  }
  addNewPackage() {
    const dialogRef = this.dialog.open(PackagesAddComponent, {
      size: 'md',
      minHeight: 'unset',
      data: {
        user: this.user,
        folder: this.activeFolder,
        folders: this.folders,
      },
      enableClose: false,
    });
  }

  handleCardEvent(event: PackageCardEvent) {
    const { id, favorite } = event.package;
    switch (event.type) {
      case PackageCardEventType.favorite:
        this.store.dispatch(new UpdatePackage(id, { favorite: !favorite }));
        break;
      case PackageCardEventType.edit:
        break;
      case PackageCardEventType.delete:
        this.handleDelete(event.package);
        break;
      case PackageCardEventType.share:
        break;
      default:
        break;
    }
  }

  private handleDelete({ id }: Package) {
    const dialogRef = this.dialog.open(DeletePromptComponent, {
      size: 'sm',
      minHeight: 'unset',
    });
    this.subs.add(
      dialogRef.afterClosed$
        .pipe(
          tap((response) => {
            if (response) {
              this.store.dispatch(new DeletePackage(id));
            }
          })
        )
        .subscribe(() => {})
    );
  }
}
