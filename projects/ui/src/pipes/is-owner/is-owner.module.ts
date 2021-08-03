import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IsOwnerPipe } from './is-owner.pipe';

@NgModule({
  declarations: [IsOwnerPipe],
  imports: [CommonModule],
  exports: [IsOwnerPipe],
})
export class IsOwnerModule {}
