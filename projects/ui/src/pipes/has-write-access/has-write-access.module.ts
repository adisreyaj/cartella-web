import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HasWriteAccessPipe } from './has-write-access.pipe';

@NgModule({
  declarations: [HasWriteAccessPipe],
  imports: [CommonModule],
  exports: [HasWriteAccessPipe],
})
export class HasWriteAccessModule {}
