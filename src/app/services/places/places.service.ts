import { AuthService } from 'src/app/services/auth/auth.service';
import { Injectable } from '@angular/core';
import { Place } from 'src/app/models/places.model';
import { BehaviorSubject, of } from 'rxjs';
import {  take,map,tap, delay, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

// [
//   new Place('p1','Manhattan Masion','In the heart of New York','https://media.tatler.com/photos/6256d9edc72b744ec1209466/3:2/w_1920,h_1280,c_limit/LanierHouse_13042022_220323_EJ_123_e_35_TH_0044-Edit_HIGH_RES.jpg',359.99,new Date(2023,1,2),new Date(2025,1,2),'admin'),
//   new Place('p2',"L'Amour Toujours",'A romantic place in Paris!','https://www.jetsetter.com//uploads/sites/7/2018/04/OYZG5PLW.jpeg',159.99,new Date(2023,1,2),new Date(2025,1,2),'admin'),
//   new Place('p3','The Foggy Palace','Not your average city trip!','https://www.boredpanda.com/blog/wp-content/uploads/2017/04/uk-smallest-castle-for-sale-mollys-lodge-12.jpg',399.99,new Date(2023,1,2),new Date(2025,1,2),'admin'),
// ]

interface fetchedPlace{
  availableFrom: string,
  availableTo: string,
  description: string,
  imageUrl: string,
  price: number,
  title: string, 
  userId: string
}


@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>([])


  constructor(private authService: AuthService,private http: HttpClient) { }

  get places(){
    return this._places.asObservable();
  }

  getPlace(id: string){
    return this.http.get<fetchedPlace>(`https://booking-project-18fb3-default-rtdb.europe-west1.firebasedatabase.app/offered-places/${id}.json`
    ).pipe(map(placeData => {
      return new Place(id,placeData.title,placeData.description,placeData.imageUrl,placeData.price,new Date(placeData.availableFrom),new Date(placeData.availableTo),placeData.userId)
    }));

  }

  addPlace( title: string, description: string, price: number, availableFrom: Date, availableTo: Date,imageUrl: string){
    const newPlace = new Place(Math.random().toString(),title,description,imageUrl,price,availableFrom,availableTo,this.authService.userId);
    let generatedId: string;
    return this.http.post<{name: string}>('https://booking-project-18fb3-default-rtdb.europe-west1.firebasedatabase.app/offered-places.json',{
      ...newPlace, 
      id: null
    }).pipe(
      switchMap(resData => {
        generatedId = resData.name;
        return this.places
      }),
      take(1),
      tap(places => {
        newPlace.id = generatedId;
        this._places.next(places.concat(newPlace));
      })
    );
  }

  fetchPlaces(){
    return this.http.get<{[key: string]:  fetchedPlace}>('https://booking-project-18fb3-default-rtdb.europe-west1.firebasedatabase.app/offered-places.json')
    .pipe(map(resData => {
      const places = [];
      for(const key in resData){
        if(resData.hasOwnProperty(key)){
          places.push(new Place(key,resData[key].title,resData[key].description,resData[key].imageUrl,resData[key].price,new Date(resData[key].availableFrom),new Date(resData[key].availableTo),resData[key].userId));
        }
      }
      return places;
    })
    ,tap(places => {
      this._places.next(places);
    })
    )
    
  }

  uploadImage(image: File){
    const uploadData = new FormData();
    uploadData.append('image',image);

    
    return this.http.post<{imageUrl: string,imagePath: string}>('https://us-central1-booking-project-18fb3.cloudfunctions.net/storeImage',
      uploadData
    );
  }

  updatePlace(placeId: string,title:string,description: string,price: number){
    let updatedPlaces: Place[];
    
    return this.places.pipe(
      take(1), 
      switchMap(places => {
        if(!places || places.length <= 0) {
          return this.fetchPlaces();
        }
        else{
          return of(places);
        }

      }),
      switchMap(places => {
        const isPlace = (pl: Place) => pl.id===placeId;
        const updatedPlaceIndex = places.findIndex(isPlace)
        console.log(updatedPlaceIndex);

        updatedPlaces = [...places];
        const oldPlace = updatedPlaces[updatedPlaceIndex];

        updatedPlaces[updatedPlaceIndex] = new Place(oldPlace.id,title,description,oldPlace.imageUrl,price,oldPlace.availableFrom,oldPlace.availableTo,oldPlace.userId);

        return this.http.put(`https://booking-project-18fb3-default-rtdb.europe-west1.firebasedatabase.app/offered-places/${placeId}.json`,{
          ...updatedPlaces[updatedPlaceIndex],
          id: null
        })
      }),
      tap(resData => {
        this._places.next(updatedPlaces);
      })
    )
  }

  deletePlace(placeId: string){
    return this.http.delete(`https://booking-project-18fb3-default-rtdb.europe-west1.firebasedatabase.app/offered-places/${placeId}.json`)
    .pipe(
      switchMap(() => {
        return this.places;
      }),
      take(1),
      tap(places => {
        this._places.next(places.filter(p => p.id !== placeId));
      })
    )
  }


}
