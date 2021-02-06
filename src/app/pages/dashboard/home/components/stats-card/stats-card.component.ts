import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-stats-card',
  templateUrl: './stats-card.component.html',
  styleUrls: ['./stats-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatsCardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
