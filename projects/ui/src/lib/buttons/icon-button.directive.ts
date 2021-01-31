import { Directive, HostBinding, Input } from '@angular/core';

const VARIANT_CLASSES = {
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

@Directive({
  selector: '[iconButton]',
})
export class IconButtonDirective {
  @Input() variant = 'primary';

  @HostBinding('class') get classes() {
    return `btn-primary
    flex items-center
    ${VARIANT_CLASSES[this.variant].join(' ')}
    px-2 py-1
    border
    `;
  }
}
