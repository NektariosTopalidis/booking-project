import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlaceDetailPageRoutingModule } from './place-detail-routing.module';

import { MaterialModule } from 'src/app/shared/material/material.module';

import { PlaceDetailPage } from './place-detail.page';
import { CreateBookingComponent } from 'src/app/pages/bookings/create-booking/create-booking.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlaceDetailPageRoutingModule,
    MaterialModule
  ],
  declarations: [
    PlaceDetailPage,
    CreateBookingComponent
  ],
  entryComponents: [
    CreateBookingComponent
  ]
})
export class PlaceDetailPageModule {}
