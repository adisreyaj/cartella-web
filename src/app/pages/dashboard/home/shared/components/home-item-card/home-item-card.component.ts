import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { HomeCardInput } from '../../interfaces/home.interface';

@Component({
  selector: 'app-home-item-card',
  templateUrl: './home-item-card.component.html',
  styleUrls: ['./home-item-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeItemCardComponent implements OnInit {
  @Input() data: HomeCardInput;
  constructor() {}

  ngOnInit(): void {}
}
