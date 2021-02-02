import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { DeletePromptComponent } from '@app/components/delete-prompt/delete-prompt.component';
import { User } from '@app/interfaces/user.interface';
import { DialogService } from '@ngneat/dialog';
import { tap } from 'rxjs/operators';
import { SubSink } from 'subsink';
import {
  Package,
  PackageCardEvent,
  PackageCardEventType,
  PackageFolder,
} from '../../shared/interfaces/packages.interface';
import { PackagesService } from '../../shared/services/packages.service';
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

  private subs = new SubSink();
  constructor(
    private dialog: DialogService,
    private packageService: PackagesService
  ) {}

  ngOnInit(): void {}

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
        this.packageService.updatePackage(id, { favorite: !favorite });
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
              this.packageService.deletePackage(id);
            }
          })
        )
        .subscribe(() => {})
    );
  }
}
