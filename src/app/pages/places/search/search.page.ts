import { Component, OnInit } from '@angular/core';
import { SegmentChangeEventDetail } from '@ionic/angular';
import { Place } from 'src/app/models/places.model';
import { PlacesService } from 'src/app/services/places/places.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  loadedPlaces: Place[] = [];
  listedLoadedPlaces: Place[] = [];

  filter: string = 'all';

  constructor(private placesService: PlacesService) { }

  ngOnInit() {
    this.loadedPlaces = this.placesService.places;
    this.listedLoadedPlaces = this.loadedPlaces.slice(1);
  }

  onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>){
    // console.log(event.detail.value);
    this.filter = event.detail.value!
  }

}
