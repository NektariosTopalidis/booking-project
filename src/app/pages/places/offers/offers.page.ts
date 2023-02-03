import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonItemSliding } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Place } from 'src/app/models/places.model';
import { PlacesService } from 'src/app/services/places/places.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit, OnDestroy {
  offers: Place[] = [];

  private placeSub!: Subscription;

  constructor(private placesService: PlacesService,private router: Router) { }

  ngOnInit() {
    this.placeSub = this.placesService.places.subscribe((places: Place[]) => {
      this.offers = places;
    })
  }

  onEdit(offerId: string,slidingItem: IonItemSliding){
    slidingItem.close();
    this.router.navigate(['/', 'places', 'tabs', 'offers',  'edit', offerId]);
  }

  ngOnDestroy(): void {
      this.placeSub.unsubscribe();
  }

}
