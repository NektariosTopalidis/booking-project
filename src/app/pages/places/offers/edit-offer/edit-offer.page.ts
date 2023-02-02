import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Place } from 'src/app/models/places.model';
import { PlacesService } from 'src/app/services/places/places.service';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit {
  form!: FormGroup;
  place: Place | any;

  constructor(private route: ActivatedRoute,private navCtrl: NavController,private placesService: PlacesService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if(!paramMap.has('placeId')){
        this.navCtrl.navigateBack('places/tabs/offers');
        return;
      }

      this.place = this.placesService.getPlace(paramMap.get('placeId')!);
    })

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
  }


  onUpdateOffer(){
    if(!this.form.valid){
      return;
    }

    console.log(this.form.value);
    this.form.reset();
  }

}
