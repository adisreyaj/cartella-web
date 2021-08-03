import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
const VARIANT_CLASSES: { [key: string]: string[] } = {
  primary: [
    'bg-primary',
    'text-white',
    'border-transparent',
    'hover:shadow-m',
    'focus:ring-gray-800',
    'focus:ring-1',
    'focus:ring-offset-1',
  ],
  secondary: [
    'bg-white',
    'text-gray-500',
    'border-gray-400',
    'hover:border-gray-900',
    'hover:text-gray-800',
    'focus:border-gray-800',
  ],
};

@Component({
  selector: 'button[iconButton], a[iconButton]',
  template: ` <ng-container *ngIf="!loading">
      <ng-content></ng-content>
    </ng-container>
    <ng-container *ngIf="loading"> <cartella-button-loader></cartella-button-loader> </ng-container>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconButtonComponent {
  @Input() variant = 'primary';
  @Input() loading = false;
  @HostBinding('class') get classes() {
    return `btn-primary
    flex items-center
    ${VARIANT_CLASSES[this.variant].join(' ')}
    px-2 py-1
    border
    `;
  }
}
