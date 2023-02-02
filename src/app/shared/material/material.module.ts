import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatIconModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  exports:[
    MatInputModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule
  ]
})
export class MaterialModule { }
