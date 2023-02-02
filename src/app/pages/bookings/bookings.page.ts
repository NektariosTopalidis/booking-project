import { Component, OnInit } from '@angular/core';
import { IonItemSliding } from '@ionic/angular';
import { Booking } from 'src/app/models/booking.model';
import { BookingService } from 'src/app/services/bookings/booking.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit {

  loadedBookings: Booking[] = [];

  constructor(private bookingsService: BookingService) { }

  ngOnInit() {
    this.loadedBookings = this.bookingsService.bookings;
  }

  onCancelBooking(offerId: string,slidingItem: IonItemSliding){
    slidingItem.close();
    //cancel booking
  }

}
