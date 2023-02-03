import { AuthService } from 'src/app/services/auth/auth.service';
import { Injectable } from '@angular/core';
import { Place } from 'src/app/models/places.model';
import { BehaviorSubject } from 'rxjs';
import {  take,map,tap, delay } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>(
    [
      new Place('p1','Manhattan Masion','In the heart of New York','https://media.tatler.com/photos/6256d9edc72b744ec1209466/3:2/w_1920,h_1280,c_limit/LanierHouse_13042022_220323_EJ_123_e_35_TH_0044-Edit_HIGH_RES.jpg',359.99,new Date(2023,1,2),new Date(2025,1,2),'admin'),
      new Place('p2',"L'Amour Toujours",'A romantic place in Paris!','https://www.jetsetter.com//uploads/sites/7/2018/04/OYZG5PLW.jpeg',159.99,new Date(2023,1,2),new Date(2025,1,2),'admin'),
      new Place('p3','The Foggy Palace','Not your average city trip!','https://www.boredpanda.com/blog/wp-content/uploads/2017/04/uk-smallest-castle-for-sale-mollys-lodge-12.jpg',399.99,new Date(2023,1,2),new Date(2025,1,2),'admin'),
    ]
  )


  constructor(private authService: AuthService) { }

  get places(){
    return this._places.asObservable();
  }

  getPlace(id: string){
    return this.places.pipe(take(1), map((places: Place[])=> {
      return {...places.find(p => p.id === id)};
    }));
  }

  addPlace( title: string, description: string, price: number, availableFrom: Date, availableTo: Date){
    let img = 'https://media.tatler.com/photos/6256d9edc72b744ec1209466/3:2/w_1920,h_1280,c_limit/LanierHouse_13042022_220323_EJ_123_e_35_TH_0044-Edit_HIGH_RES.jpg';
    const newPlace = new Place(Math.random().toString(),title,description,img,price,availableFrom,availableTo,this.authService.userId);

    return this.places
    .pipe(
      take(1),
      delay(1000),
      tap(places => {
        this._places.next(places.concat(newPlace));
      })
    );
  }

  updatePlace(placeId: string,title:string,description: string,price: number){
    return this.places.pipe(take(1), delay(1000) ,tap(places => {
      const isPlace = (pl: Place) => pl.id===placeId;
      const updatedPlaceIndex = places.findIndex(isPlace)
      console.log(updatedPlaceIndex);

      const updatedPlaces = [...places];
      const oldPlace = updatedPlaces[updatedPlaceIndex];

      updatedPlaces[updatedPlaceIndex] = new Place(oldPlace.id,title,description,oldPlace.imageUrl,price,oldPlace.availableFrom,oldPlace.availableTo,oldPlace.userId);

      this._places.next(updatedPlaces);
    }));
  }


}
