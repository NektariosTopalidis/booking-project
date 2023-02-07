import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonItemSliding, NavController } from '@ionic/angular';
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

  isLoading: boolean = false;

  constructor(private placesService: PlacesService,private router: Router) { }

  ngOnInit() {
    this.placeSub = this.placesService.places.subscribe((places: Place[]) => {
      this.offers = places;
    })
    
    
  }
  
  ionViewWillEnter(){
    this.isLoading = true;
    this.placesService.fetchPlaces().subscribe((places) => {
      this.isLoading = false;
    });
  }
  
  
  
  onEdit(offerId: string,slidingItem: IonItemSliding){
    slidingItem.close();
    this.router.navigate(['/','places','tabs','offers','edit',offerId]);  
  }

  ngOnDestroy(): void {
      this.placeSub.unsubscribe();
  }

}
