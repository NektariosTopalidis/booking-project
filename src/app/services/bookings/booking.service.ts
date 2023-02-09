import { map, tap, take, delay, switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth/auth.service';
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Booking } from 'src/app/models/booking.model';
import { HttpClient } from '@angular/common/http';

interface BookingData {
  bookedFrom:Date;
  bookedTo: Date;
  firstName: string;
  guestNumber: number;
  lastName: string;
  placeId: string;
  placeImg: string;
  placeTitle: string;
  userId: string;
}


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

  fetchBookings(){
    return this.http.get<{[key: string]: BookingData}>(`https://booking-project-18fb3-default-rtdb.europe-west1.firebasedatabase.app/bookings.json?orderBy="userId"&equalTo="${this.authService.userId}"`)
    .pipe(
        map(bookingData => {
          const bookings = [];

          for(const key in bookingData){
            if(bookingData.hasOwnProperty(key)){
              bookings.push(new Booking(key,bookingData[key].placeId,bookingData[key].userId,bookingData[key].placeTitle,bookingData[key].guestNumber,bookingData[key].placeImg,bookingData[key].firstName,bookingData[key].lastName,new Date(bookingData[key].bookedFrom),new Date(bookingData[key].bookedTo)))
            }
          }
          return bookings;
        }
      ),
        tap(bookings => {
          this._bookings.next(bookings);
        })
    )
  }

  cancelBooking(bookingId: string){
    return this.http.delete(`https://booking-project-18fb3-default-rtdb.europe-west1.firebasedatabase.app/bookings/${bookingId}.json`)
    .pipe(
      switchMap(() => {
        return this.bookings;
      }),
      take(1),
      tap(bookings => {
        this._bookings.next(bookings.filter(b => b.id !== bookingId));
      })
    )
  }
}
