import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialModule } from '../material.module';
import { NgrxVirtualScrollDirective } from '../shared/directives/ngrx-virtual-scroll.directive';
import { VirtualScrollDirective } from '../shared/directives/virtual-scroll.directive';
import { ScrollingModule } from '@angular/cdk/scrolling';

@NgModule({
  declarations: [
    NgrxVirtualScrollDirective,
    VirtualScrollDirective,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule,
    ScrollingModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule,
    ScrollingModule,
    NgrxVirtualScrollDirective,
    VirtualScrollDirective,
  ]
})
export class SharedModule {}
