import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatIconModule,
    MatInputModule
  ],
  exports:[
    MatInputModule,
    MatIconModule
  ]
})
export class MaterialModule { }
