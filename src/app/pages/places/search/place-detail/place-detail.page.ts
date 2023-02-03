import { Subscription } from 'rxjs/internal/Subscription';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, ModalController, NavController } from '@ionic/angular';
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

  private placeSub!: Subscription;

  constructor(private route: ActivatedRoute,private navCtrl: NavController,private placesService: PlacesService,private modalCtrl: ModalController,private actionSheetCtrl: ActionSheetController) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if(!paramMap.has('placeId')){
        this.navCtrl.navigateBack('places/tabs/offers');
        return;
      }

      this.placeSub = this.placesService.getPlace(paramMap.get('placeId')!).subscribe(place => {
        this.place = place;
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
        console.log('BOOKED');
      }
    });
  }


  ngOnDestroy(): void {
    this.placeSub.unsubscribe();
  }
}
