import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IsOwnerPipe } from './is-owner.pipe';



@NgModule({
  declarations: [
    IsOwnerPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    IsOwnerPipe
  ]
})
export class IsOwnerModule { }
