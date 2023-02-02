import { Injectable } from '@angular/core';
import { Place } from 'src/app/models/places.model';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private _places: Place[] = [
    new Place('p1','Manhattan Masion','In the heart of New York','https://media.tatler.com/photos/6256d9edc72b744ec1209466/3:2/w_1920,h_1280,c_limit/LanierHouse_13042022_220323_EJ_123_e_35_TH_0044-Edit_HIGH_RES.jpg',359.99,new Date(2023,1,2),new Date(2025,1,2)),
    new Place('p2',"L'Amour Toujours",'A romantic place in Paris!','https://www.jetsetter.com//uploads/sites/7/2018/04/OYZG5PLW.jpeg',159.99,new Date(2023,1,2),new Date(2025,1,2)),
    new Place('p3','The Foggy Palace','Not your average city trip!','https://www.boredpanda.com/blog/wp-content/uploads/2017/04/uk-smallest-castle-for-sale-mollys-lodge-12.jpg',399.99,new Date(2023,1,2),new Date(2025,1,2)),
  ];


  get places(){
    return [...this._places];
  }

  getPlace(id: string){
    return {...this._places.find(p => p.id === id)};
  }

  constructor() { }
}
