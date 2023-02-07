import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
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
  placeId!: string;
  private placeSub!: Subscription;

  isLoading: boolean = false;

  constructor(private route: ActivatedRoute,private navCtrl: NavController,private placesService: PlacesService,private router: Router,private loadingCtrl: LoadingController,private alertCtrl: AlertController) { }


  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {


      if(!paramMap.has('placeId')){
        this.navCtrl.navigateBack('places/tabs/offers');
        return;
      }
      this.placeId = paramMap.get('placeId')!;
      this.isLoading = true;
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
        });

        this.isLoading = false;
      },  error => {
        this.alertCtrl.create({
          header: 'An error occured!',
          message: 'Place could not be fetched. Please try again later.',
          buttons: [
            {
              text: 'Okay',
              handler: () => {
                this.router.navigate(['/places/tabs/offers']);
                setTimeout(() => {
                  this.router.navigate(['/places/tabs/offers']);
                },10)
              }
            }
          ]
        }).then(alertEl => {
          alertEl.present();
        })
      }
      );

      
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
