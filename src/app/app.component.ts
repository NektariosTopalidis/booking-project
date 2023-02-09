import { Component } from '@angular/core';
import { AuthService } from './services/auth/auth.service';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style  } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private authService: AuthService,private platform: Platform,private router: Router) {
    this.initializeApp();
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
    this.router.navigateByUrl('/auth');
  }

}
