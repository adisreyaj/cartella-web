import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'cartella-button-loader',
  template: `<svg
    xmlns="http://www.w3.org/2000/svg"
    style="height: 24px;width: 24px;"
    width="24"
    height="24"
    viewBox="0 0 100 100"
    preserveAspectRatio="xMidYMid"
    display="block"
  >
    <circle
      cx="50"
      cy="50"
      r="32"
      stroke-width="8"
      stroke="#fff"
      stroke-dasharray="50.26548245743669 50.26548245743669"
      fill="none"
      stroke-linecap="round"
    >
      <animateTransform
        attributeName="transform"
        type="rotate"
        repeatCount="indefinite"
        dur="1s"
        keyTimes="0;1"
        values="0 50 50;360 50 50"
      />
    </circle>
  </svg>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonLoaderComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
