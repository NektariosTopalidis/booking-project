import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from './services/auth/auth.service';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style  } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit,OnDestroy{
  private authSub?: Subscription;
  private previousAuthState = false;

  constructor(private authService: AuthService,private platform: Platform,private router: Router) {
    this.initializeApp();
  }

  ngOnInit(): void {
    this.authSub = this.authService.userIsAuthenticated.subscribe(isAuth => {
      if(!isAuth && this.previousAuthState !== isAuth){
        this.router.navigate(['/auth']);
      }
      this.previousAuthState = isAuth;
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if(Capacitor.isPluginAvailable('SplashScreen')){
        SplashScreen.hide();
      }
    });
  }

  onLogout(){
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.authSub?.unsubscribe();
  }

}
