import { map, tap, take, delay } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth/auth.service';
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Booking } from 'src/app/models/booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private _bookings = new BehaviorSubject<Booking[]>([])



  constructor(private authService: AuthService) { }

  get bookings() {
    return this._bookings.asObservable();
  }

  addBooking(placeId: string,placeTitle: string,placeImg: string,firstName: string,lastName: string,guestNumber: number,fromDate: Date,toDate: Date){
    const newBooking = new Booking(Math.random().toString(),placeId,this.authService.userId,placeTitle,guestNumber,placeImg,firstName,lastName,fromDate,toDate);
    return this.bookings.pipe(
      take(1),
      delay(1000),
      tap(bookings => {
        this._bookings.next(bookings.concat(newBooking));
      })
    );
  }

  cancelBooking(bookingId: string){
    return this.bookings.pipe(
      take(1),
      delay(1000),
      tap(bookings => {
        this._bookings.next(bookings.filter(b => b.id !== bookingId));
      })
    );
  }
}
