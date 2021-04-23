import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';

@Component({
  selector: 'app-stats-card',
  template: ` <div
    class="flex items-center justify-between p-2 bg-white rounded-md shadow-md dark:bg-dark-500"
  >
    <div class="p-2 text-white rounded-full bg-primary">
      <ng-content></ng-content>
    </div>

    <div class="flex flex-col items-end justify-center">
      <ng-container *ngIf="value != null && !isLoading">
        <p class="text-lg font-semibold text-gray-800 dark:text-white">
          {{ value }}
        </p>
      </ng-container>
      <ng-container *ngIf="isLoading">
        <div class="w-6 h-6 mb-1 rounded-full shimmer"></div>
      </ng-container>
      <p class="-mt-1 text-xs text-gray-500 dark:text-gray-50">{{ label }}</p>
    </div>
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatsCardComponent implements OnInit {
  @Input() label: string;
  @Input() value: string | number;
  @Input() isLoading = false;
  constructor() {}

  ngOnInit(): void {}
}
