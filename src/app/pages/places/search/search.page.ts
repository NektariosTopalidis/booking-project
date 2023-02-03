import { AuthService } from 'src/app/services/auth/auth.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { SegmentChangeEventDetail } from '@ionic/angular';
import { Place } from 'src/app/models/places.model';
import { PlacesService } from 'src/app/services/places/places.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit, OnDestroy {
  loadedPlaces: Place[] = [];
  listedLoadedPlaces: Place[] = [];

  relevantPlaces: Place[] = [];

  private placesSub!: Subscription;

  filter: string = 'all';

  constructor(private placesService: PlacesService,private authService: AuthService) { }

  ngOnInit() {
    this.placesSub = this.placesService.places.subscribe((places: Place[]) => {
      this.loadedPlaces = places;
      this.relevantPlaces = this.loadedPlaces;

      this.listedLoadedPlaces = this.relevantPlaces.slice(1);
    });
  }

  onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>){
    // console.log(event.detail.value);
    if(event.detail.value === 'all'){
      this.relevantPlaces = this.loadedPlaces;
      this.listedLoadedPlaces = this.relevantPlaces.slice(1);
    }
    else{
      this.relevantPlaces = this.loadedPlaces.filter(place => place.userId !== this.authService.userId );
      this.listedLoadedPlaces = this.relevantPlaces.slice(1);
    }
  }

  ngOnDestroy(): void {
      this.placesSub.unsubscribe();
  }

}
