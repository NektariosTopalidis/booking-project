import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  isLogin: boolean = true;

  constructor(private authService: AuthService,private router: Router,private loadingCtrl: LoadingController) { }

  ngOnInit() {
  }

  onLogin(form: NgForm){
    this.loadingCtrl.create({keyboardClose: true, message: 'Logging in...'}).then(loadingEl => {
      loadingEl.present();

      this.authService.login();
      setTimeout(() => {
        loadingEl.dismiss();
        form.reset();
        this.router.navigateByUrl('/places/tabs/search');
      },1500)
    })
  }


  onSubmit(form: NgForm){
    if(!form.valid){
      return;
    }
    const username = form.value.username;
    const password = form.value.password;

    if(this.isLogin){
      this.onLogin(form);
    }
    else{
      const email = form.value.email
    }

  }

  onSwitch(){
    this.isLogin = !this.isLogin
  }
}
