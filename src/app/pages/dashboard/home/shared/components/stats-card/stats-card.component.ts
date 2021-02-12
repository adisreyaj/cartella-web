import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';

@Component({
  selector: 'app-stats-card',
  templateUrl: './stats-card.component.html',
  styleUrls: ['./stats-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatsCardComponent implements OnInit {
  @Input() label: string;
  @Input() value: string | Number;
  @Input() isLoading = false;
  constructor() {}

  ngOnInit(): void {}
}
