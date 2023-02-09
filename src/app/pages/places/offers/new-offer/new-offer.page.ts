import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { PlacesService } from 'src/app/services/places/places.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

function base64toBlob(base64Data: any, contentType: any) {
  contentType = contentType || '';
  const sliceSize = 1024;
  const byteCharacters = window.atob(base64Data);
  const bytesLength = byteCharacters.length;
  const slicesCount = Math.ceil(bytesLength / sliceSize);
  const byteArrays = new Array(slicesCount);

  for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    const begin = sliceIndex * sliceSize;
    const end = Math.min(begin + sliceSize, bytesLength);

    const bytes = new Array(end - begin);
    for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, { type: contentType });
}

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
      }),
      image: new FormControl(null,{
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

  onImagePicked(imageData: string){
    let imageFile;
    try{
      imageFile = base64toBlob(imageData.replace('data:image/jpeg;base64', ''), 'image/jpeg');
      console.log(imageFile);
      this.form.patchValue({image: imageFile});
      console.log(this.form.value);
      
    }
    catch (err){
      console.log(err);
      return;
    }

    
  }

}
