import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { HomeCardInput } from '../../interfaces/home.interface';

@Component({
  selector: 'app-home-item-card',
  templateUrl: './home-item-card.component.html',
  styleUrls: ['./home-item-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeItemCardComponent {
  @Input() item: HomeCardInput;

  @Output() clicked = new EventEmitter<HomeCardInput>();

  handleClick(item: HomeCardInput) {
    this.clicked.emit(item);
  }
}
