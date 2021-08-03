import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IsSharedItemPipe } from './is-shared-item.pipe';

@NgModule({
  declarations: [IsSharedItemPipe],
  imports: [CommonModule],
  exports: [IsSharedItemPipe],
})
export class IsSharedItemModule {}
