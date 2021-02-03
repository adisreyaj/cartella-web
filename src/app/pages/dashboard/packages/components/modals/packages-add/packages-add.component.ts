import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ToastService } from '@app/services/toast/toast.service';
import { DialogRef } from '@ngneat/dialog';
import { TippyInstance } from '@ngneat/helipopper';
import { Store } from '@ngxs/store';
import { BehaviorSubject, combineLatest, fromEvent, of } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
  tap,
} from 'rxjs/operators';
import { SubSink } from 'subsink';
import { PackageBundleMetaData } from '../../../shared/interfaces/bundle.interface';
import { PackageSuggestions } from '../../../shared/interfaces/package-details.interface';
import {
  Package,
  PackageMetaData,
  PackageRequest,
} from '../../../shared/interfaces/packages.interface';
import { PackagesService } from '../../../shared/services/packages.service';
import { AddPackage } from '../../../store/actions/package.action';

@Component({
  selector: 'app-packages-add',
  templateUrl: './packages-add.component.html',
  styleUrls: ['./packages-add.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PackagesAddComponent implements OnInit, AfterViewInit, OnDestroy {
  packageName = new FormControl('');

  @ViewChild('packageNameRef') packageNameInputRef: TippyInstance;

  private searchSuggestionLoadingSubject = new BehaviorSubject<boolean>(false);
  searchSuggestionsLoading$ = this.searchSuggestionLoadingSubject.pipe();

  private savingSubject = new BehaviorSubject<boolean>(false);
  saving$ = this.savingSubject.pipe();

  private searchSuggestionSubject = new BehaviorSubject<PackageSuggestions[]>(
    []
  );
  searchSuggestions$ = this.searchSuggestionSubject.pipe();

  private subs = new SubSink();
  constructor(
    public ref: DialogRef,
    private packageService: PackagesService,
    private toast: ToastService,
    private store: Store
  ) {}

  ngOnInit(): void {}

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  ngAfterViewInit() {
    if (this.packageNameInputRef) {
      const inputRef = (this.packageNameInputRef as any).host.nativeElement;
      inputRef.focus();
      const sub = fromEvent(inputRef, 'keyup')
        .pipe(
          debounceTime(300),
          distinctUntilChanged(),
          tap(() => this.searchSuggestionLoadingSubject.next(true)),
          map(() => inputRef.value),
          switchMap((name) => {
            if (name) {
              return this.packageService.getPackageSuggestions(name);
            } else {
              return of([]);
            }
          }),
          tap((suggestions) => {
            this.packageNameInputRef.show();
            this.searchSuggestionSubject.next(suggestions);
          })
        )
        .subscribe(() => {
          this.searchSuggestionLoadingSubject.next(false);
        });
      this.subs.add(sub);
    }
  }

  selectFromSuggestion(selection: PackageSuggestions) {
    this.packageName.setValue(selection.name);
  }

  addPackage() {
    const packageName = this.packageName.value;
    combineLatest([
      this.packageService.getPackageDetails(packageName),
      this.packageService.getPackageBundleDetails(packageName),
    ]).subscribe(([details, bundle]) => {
      const {
        name,
        description,
        github,
        license,
        links,
        image,
        npm,
        score,
        version,
      } = details;
      const packageData: PackageRequest = {
        name,
        description,
        image,
        favorite: false,
        folderId: this.ref.data.folder.id,
        private: true,
        metadata: {
          license,
          links,
          bundle,
          npm,
          score,
          version,
        },
        repo: {
          url: links.repository,
          ...github,
        },
        share: [],
        tags: [],
      };
      this.store.dispatch(new AddPackage(packageData));
    });
  }

  private formatPackageDataForSaving({
    bundleDetails,
    packageDetails,
  }: {
    bundleDetails: PackageBundleMetaData;
    packageDetails: PackageMetaData;
  }) {
    const packageFormatted: Package = null;
    return packageFormatted;
  }
}
