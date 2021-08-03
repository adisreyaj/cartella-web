import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CountPipe } from './count.pipe';

@NgModule({
  declarations: [CountPipe],
  imports: [CommonModule],
  exports: [CountPipe],
})
export class CountPipeModule {}
