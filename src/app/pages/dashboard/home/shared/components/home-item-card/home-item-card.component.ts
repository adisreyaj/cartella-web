import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-home-item-card',
  templateUrl: './home-item-card.component.html',
  styleUrls: ['./home-item-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeItemCardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
