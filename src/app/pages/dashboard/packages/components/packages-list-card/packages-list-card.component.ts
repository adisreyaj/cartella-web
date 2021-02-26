import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { take } from 'rxjs/operators';
import {
  Package,
  PackageCardEvent,
  PackageCardEventType,
} from '../../shared/interfaces/packages.interface';
import { PackagesService } from '../../shared/services/packages.service';

@Component({
  selector: 'app-packages-list-card',
  templateUrl: './packages-list-card.component.html',
  styleUrls: ['./packages-list-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PackagesListCardComponent implements OnInit {
  @Input() package: Package;

  @Output() cardEvent = new EventEmitter<PackageCardEvent>();
  constructor(private packageService: PackagesService) {}

  ngOnInit(): void {}
  handleFavoriteToggle(packageData: Package) {
    this.cardEvent.emit({
      type: PackageCardEventType.favorite,
      package: packageData,
    });
  }
  handleEdit(packageData: Package) {
    this.cardEvent.emit({
      type: PackageCardEventType.edit,
      package: packageData,
    });
  }
  handleDelete(packageData: Package) {
    this.cardEvent.emit({
      type: PackageCardEventType.delete,
      package: packageData,
    });
  }
  handleShare(packageData: Package) {
    this.cardEvent.emit({
      type: PackageCardEventType.share,
      package: packageData,
    });
  }

  handleMoveToFolder(packageData: Package) {
    this.cardEvent.emit({
      type: PackageCardEventType.move,
      package: packageData,
    });
  }

  updateView(packageData: Package) {
    this.packageService.updateViews(packageData.id).pipe(take(1)).subscribe();
  }
}
