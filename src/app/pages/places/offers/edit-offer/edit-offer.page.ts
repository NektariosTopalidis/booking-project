import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Place } from 'src/app/models/places.model';
import { PlacesService } from 'src/app/services/places/places.service';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit, OnDestroy {
  form!: FormGroup;
  place: Place | any;

  private placeSub!: Subscription;

  constructor(private route: ActivatedRoute,private navCtrl: NavController,private placesService: PlacesService,private router: Router,private loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if(!paramMap.has('placeId')){
        this.navCtrl.navigateBack('places/tabs/offers');
        return;
      }

      this.placeSub = this.placesService.getPlace(paramMap.get('placeId')!).subscribe(place => {
        this.place = place;

        this.form = new FormGroup({
          title: new FormControl(this.place.title,{
            updateOn: 'blur',
            validators: [Validators.required]
          }),
          description: new FormControl(this.place.description,{
            updateOn: 'blur',
            validators: [Validators.required,Validators.maxLength(256)]
          }),
          price: new FormControl(this.place.price,{
            updateOn: 'blur',
            validators: [Validators.required,Validators.min(1)]
          })
        })
      });
    })

  }


  onUpdateOffer(){
    if(!this.form.valid){
      return;
    }

    this.loadingCtrl.create({
      message: 'Updating place...'
    }).then(loaderEl => {
      loaderEl.present();

      this.placesService.updatePlace(this.place.id,this.form.value.title,this.form.value.description,this.form.value.price)
      .subscribe(() => {
        loaderEl.dismiss();
        this.form.reset();
        this.router.navigate(['/places/tabs/offers']);
      })
    })

  }

  ngOnDestroy(): void {
    this.placeSub.unsubscribe();
  }
}
