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

  minDate!: Date;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    let currentDate = new Date();

    let selectedDay = currentDate.getDate();
    let selectedYear = currentDate.getFullYear();
    let selectedMonth = currentDate.getMonth();
    let minDay = selectedDay + 3;
    this.minDate = new Date(selectedYear,selectedMonth,minDay)
  }

  onBookPlace(){
    this.modalCtrl.dismiss({message: 'This is a dummy message'}, 'confirm','bookModal');
  }
  
  onCancel(){
    this.modalCtrl.dismiss(null,'cancel','bookModal');
  }

  test(startDateCtrl: Date){
    let selectedDay = startDateCtrl.getDate();
    let selectedYear = startDateCtrl.getFullYear();
    let selectedMonth = startDateCtrl.getMonth();
    let minDay = selectedDay + 3;
    this.minDate = new Date(selectedYear,selectedMonth,minDay)

    console.log(this.minDate);
    
  }



}
