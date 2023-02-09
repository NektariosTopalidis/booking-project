import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewOfferPageRoutingModule } from './new-offer-routing.module';

import { NewOfferPage } from './new-offer.page';

import { MaterialModule } from 'src/app/shared/material/material.module';

import { ImagePickerComponent } from 'src/app/shared/pickers/image-picker/image-picker.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    NewOfferPageRoutingModule,
    MaterialModule
  ],
  declarations: [NewOfferPage,ImagePickerComponent]
})
export class NewOfferPageModule {}
