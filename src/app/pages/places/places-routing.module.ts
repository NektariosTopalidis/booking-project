import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlacesPage } from './places.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/places/tabs/search',
    pathMatch: 'full'
  },
  {
    path: 'tabs',
    component: PlacesPage,
    children:[
      {
        path: 'search',
        loadChildren: () => import('./search/search.module').then( m => m.SearchPageModule)
      },
      {
        path: 'offers',
        loadChildren: () => import('./offers/offers.module').then( m => m.OffersPageModule)
      }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlacesPageRoutingModule {}
