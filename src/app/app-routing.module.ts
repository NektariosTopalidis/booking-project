import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth/guard/auth.guard';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth.module').then( m => m.AuthPageModule)
  },
  {
    path: 'places',
    canLoad: [AuthGuard],
    loadChildren: () => import('./pages/places/places.module').then( m => m.PlacesPageModule)
  },
  {
    path: 'bookings',
    canLoad: [AuthGuard],
    loadChildren: () => import('./pages/bookings/bookings.module').then( m => m.BookingsPageModule)
  },
  {
    path: '',
    redirectTo: 'places',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
