import { ChangeDetectionStrategy, Component, HostBinding, Input, OnInit } from '@angular/core';
import { BUTTON_SIZE_PADDINGS } from '../buttons.config';

@Component({
  selector: 'button[primaryButton], a[primaryButton]',
  templateUrl: './primary-button.component.html',
  styleUrls: ['./primary-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrimaryButtonComponent implements OnInit {
  @HostBinding('class') get classes() {
    return `btn-primary rounded-md
    flex items-center
    btn-${this.variant}
    ${this.variant === 'warn' ? 'bg-red-600 hover:bg-red-700' : 'bg-primary hover:bg-primary-dark'}
    ${BUTTON_SIZE_PADDINGS[this.size]}
    ${this.size === 'sm' ? 'text-sm' : 'text-base'}
    text-white
    border
    border-transparent
    hover:shadow-m
    focus:outline-none
    focus:ring-primary focus:ring-1 focus:ring-offset-1
    `;
  }

  @Input() size: 'sm' | 'lg' = 'lg';
  @Input() variant: 'normal' | 'warn' = 'normal';
  @Input() loading: boolean | null = false;
  constructor() {}

  ngOnInit(): void {}
}
