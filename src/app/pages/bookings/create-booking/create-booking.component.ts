import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Place } from 'src/app/models/places.model';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss'],
})
export class CreateBookingComponent implements OnInit {
  @Input() selectedPlace: Place | any;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {}

  onBookPlace(){
    this.modalCtrl.dismiss({message: 'This is a dummy message'}, 'confirm','bookModal');
  }
  
  onCancel(){
    this.modalCtrl.dismiss(null,'cancel','bookModal');
  }

}
