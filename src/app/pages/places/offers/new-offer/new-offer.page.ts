import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { PlacesService } from 'src/app/services/places/places.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss'],
})
export class NewOfferPage implements OnInit {
  form!: FormGroup;

  constructor(private placesService: PlacesService,private router: Router,private loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null,{
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      description: new FormControl(null,{
        updateOn: 'blur',
        validators: [Validators.required,Validators.maxLength(256)]
      }),
      price: new FormControl(null,{
        updateOn: 'blur',
        validators: [Validators.required,Validators.min(1)]
      }),
      fromDate: new FormControl(null,{
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      toDate: new FormControl(null,{
        updateOn: 'blur',
        validators: [Validators.required]
      })
    })
  }

  onCreateOffer(){
    if(!this.form.valid){
      return;
    }
    this.loadingCtrl.create({
      message: 'Creating place...'
    }).then(loaderEl => {
      loaderEl.present();
      this.placesService.addPlace(this.form.value.title,this.form.value.description,+this.form.value.price,new Date(this.form.value.fromDate),new Date(this.form.value.toDate))
      .subscribe(() => {
        loaderEl.dismiss();
        this.form.reset();
        this.router.navigate(['/places/tabs/offers']);
      });
    })
  }

}
