import { AuthService } from 'src/app/services/auth/auth.service';
import { BookingService } from 'src/app/services/bookings/booking.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, ModalController, NavController, LoadingController, AlertController } from '@ionic/angular';
import { Place } from 'src/app/models/places.model';
import { CreateBookingComponent } from 'src/app/pages/bookings/create-booking/create-booking.component';
import { PlacesService } from 'src/app/services/places/places.service';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit, OnDestroy {

  place: Place | any;
  isBookable: boolean = false;
  isLoading: boolean = false;
  

  private placeSub!: Subscription;

  constructor(private authService: AuthService,private route: ActivatedRoute,private navCtrl: NavController,private placesService: PlacesService,private modalCtrl: ModalController,private actionSheetCtrl: ActionSheetController,private bookingService: BookingService,private loadingCtrl: LoadingController,private router: Router,private alertCtrl: AlertController) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if(!paramMap.has('placeId')){
        this.navCtrl.navigateBack('places/tabs/offers');
        return;
      }
      this.isLoading= true;
      this.placeSub = this.placesService.getPlace(paramMap.get('placeId')!).subscribe(place => {
        this.place = place;
        this.isBookable = place.userId !== this.authService.userId;
        this.isLoading = false;
      }, error => {
        this.alertCtrl.create({
          header: 'An error occured',
          message: 'Place could not be loaded.',
          buttons: [
            {
              text: 'Okay',
              handler: () => {
                this.router.navigate(['/places/tabs/search']);
              }
            }
          ]
        }).then(alertEl => {
          alertEl.present();
        })
      });
    })
  }

  onBookPlace(){
    this.actionSheetCtrl.create({
      header: 'Choose an Action',
      buttons: [
        {
          text: 'Select Date',
          handler: () => {
            this.openBookingModal('select');
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    }).then(actionSheetEl => {
      actionSheetEl.present();
    })

    // this.navCtrl.navigateBack('/places/tabs/search')

  }

  openBookingModal(mode: 'select'){
    console.log(mode);

    this.modalCtrl.create({
      component: CreateBookingComponent,
      componentProps: {selectedPlace: this.place},
      id: 'bookModal'
    })
    .then(modalEl => {
      modalEl.present();

      return modalEl.onDidDismiss()
    })
    .then(resultData => {
      console.log(resultData.data, resultData.role);
      if(resultData.role === 'confirm'){
        this.loadingCtrl.create({
          message: 'Booking place...'
        }).then(loaderEL => {
          loaderEL.present();
          this.bookingService.addBooking(this.place.id ,this.place.title , this.place.imageUrl , resultData.data.bookingData.firstName , resultData.data.bookingData.lastName , resultData.data.bookingData.guests , resultData.data.bookingData.startDate , resultData.data.bookingData.endDate)
          .subscribe(bookings => {
            loaderEL.dismiss();
            console.log(bookings);
            
            this.router.navigate(['/places/tabs/search']);
          })
        })
      }
    });
  }


  ngOnDestroy(): void {
    this.placeSub.unsubscribe();
  }
}
