import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-delete-prompt',
  templateUrl: './delete-prompt.component.html',
  styleUrls: ['./delete-prompt.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeletePromptComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
