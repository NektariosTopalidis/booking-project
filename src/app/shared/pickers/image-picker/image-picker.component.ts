import { Component, OnInit, Output,EventEmitter, Input } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType } from '@capacitor/camera';
import { CameraSource } from '@capacitor/camera/dist/esm/definitions';
import { Platform } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
})
export class ImagePickerComponent implements OnInit {
  @Output() imagePick = new EventEmitter<string>();
  @Input() showPreview = false;
  selectedImage: string | undefined = undefined;

  usePicker: boolean = false;
  
  constructor(private platform: Platform,private _sanitizer: DomSanitizer) { }
  
  ngOnInit() {
    if((this.platform.is('mobile') && !this.platform.is('hybrid')) || this.platform.is('desktop')){
      this.usePicker = true;
    }
  }
  
  onPickImage(){
    if(!Capacitor.isPluginAvailable('Camera')){
      return;
    }

    Camera.getPhoto({
      quality: 80,
      source: CameraSource.Prompt,
      correctOrientation: true,
      height: 320,
      width: 200,
      resultType: CameraResultType.Base64
    })
    .then(image =>{
      this.selectedImage = 'data:image/jpg;base64,' + image.base64String;
      this.imagePick.emit(this.selectedImage);
    })
    .catch(err => {
      console.log(err);
      return false;
    });
  }
}