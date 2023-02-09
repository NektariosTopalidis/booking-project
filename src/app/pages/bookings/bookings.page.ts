import { Subscription } from 'rxjs/internal/Subscription';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonItemSliding, LoadingController } from '@ionic/angular';
import { Booking } from 'src/app/models/booking.model';
import { BookingService } from 'src/app/services/bookings/booking.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit, OnDestroy {

  loadedBookings: Booking[] = [];

  private bookingSub!: Subscription;
  isLoading: boolean = false;

  constructor(private bookingsService: BookingService,private loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.bookingSub = this.bookingsService.bookings.subscribe(bookings => {
      this.loadedBookings = bookings;
    });
  }

  ionViewWillEnter(){
    this.isLoading = true;
    this.bookingsService.fetchBookings().subscribe(() => {
      this.isLoading = false;
    });
  }

  onCancelBooking(bookingId: string,slidingItem: IonItemSliding){
    this.loadingCtrl.create({
      message: 'Canceling...'
    }).then(loaderEl => {
      loaderEl.present()
      slidingItem.close();
      this.bookingsService.cancelBooking(bookingId).subscribe(() => {
        loaderEl.dismiss();
      });
    })
  }

  ngOnDestroy(): void {
      this.bookingSub.unsubscribe();
  }

}
