import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  username = '';
  password = '';

  constructor(private authService: AuthService,private router: Router,private loadingCtrl: LoadingController) { }

  ngOnInit() {
  }

  onLogin(){
    this.loadingCtrl.create({keyboardClose: true, message: 'Logging in...'}).then(loadingEl => {
      loadingEl.present();

      this.authService.login();
      setTimeout(() => {
        this.username = '';
        this.password = '';
        loadingEl.dismiss();
        this.router.navigateByUrl('/places/tabs/search');
      },1500)
    })
  }
}
