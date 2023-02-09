import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AuthResponseData, AuthService } from 'src/app/services/auth/auth.service';




@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  isLogin: boolean = true;

  constructor(private authService: AuthService,private router: Router,private loadingCtrl: LoadingController,private alertCtrl: AlertController) { }

  ngOnInit() {
  }

  authenticate(form: NgForm,email: string,password: string){
    this.loadingCtrl.create({keyboardClose: true, message: 'Logging in...'}).then(loadingEl => {
      loadingEl.present();
      let authObs: Observable<AuthResponseData>;
      if(this.isLogin){
        authObs = this.authService.login(email,password);
      }
      else{
        authObs = this.authService.singup(email,password);
      }
      authObs.subscribe(resData => {
        console.log(resData);
        loadingEl.dismiss();
        
        this.router.navigateByUrl('/places/tabs/search');
      }, errRes => {
        loadingEl.dismiss();
        const code = errRes.error.error.message;
        let message = 'Could not sign you up. Please try again.'; 
        if(code == 'EMAIL_EXISTS'){
          message = 'This email address already exists.';
        }
        else if(code == 'EMAIL_NOT_FOUND'){
          message = 'Email address could not be found.'
        }
        else if(code == 'INVALID_PASSWORD'){
          message = 'This password is not correct.'
        }
        this.showAlert(message,form);
      });



    })
  }


  onSubmit(form: NgForm){
    if(!form.valid){
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    this.authenticate(form,email,password);
    form.resetForm();
  }


  private showAlert(message: string,form: NgForm){
    this.alertCtrl.create({
      header: 'Authentication failed',
      message: message,
      buttons: [
        'Okay'
      ]
    }).then(alertEl => {
      alertEl.present();
    })
  }

  onSwitch(){
    this.isLogin = !this.isLogin
  }
}
