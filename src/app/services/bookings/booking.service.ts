import { map, tap, take, delay, switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth/auth.service';
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Booking } from 'src/app/models/booking.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private _bookings = new BehaviorSubject<Booking[]>([])



  constructor(private authService: AuthService,private http: HttpClient) { }

  get bookings() {
    return this._bookings.asObservable();
  }

  addBooking(placeId: string,placeTitle: string,placeImg: string,firstName: string,lastName: string,guestNumber: number,fromDate: Date,toDate: Date){
    let generatedId: string;
    const newBooking = new Booking(Math.random().toString(),placeId,this.authService.userId,placeTitle,guestNumber,placeImg,firstName,lastName,fromDate,toDate);
    return this.http.post<{name: string}>('https://booking-project-18fb3-default-rtdb.europe-west1.firebasedatabase.app/bookings.json',{
      ...newBooking,
      id: null
    }).pipe(
      switchMap(resData => {
        generatedId = resData.name;
        return this.bookings;
      }),
      take(1),
      tap(bookings => {
        newBooking.id = generatedId;
        this._bookings.next(bookings.concat(newBooking));
      })
    )
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
