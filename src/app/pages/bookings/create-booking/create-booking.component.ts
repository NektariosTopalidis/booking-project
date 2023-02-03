import { NgForm } from '@angular/forms';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Place } from 'src/app/models/places.model';



@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss'],
})
export class CreateBookingComponent implements OnInit {
  @Input() selectedPlace: Place | any;

  @ViewChild('f', { static: true }) form: NgForm | any;

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
    if(!this.form.valid){
      return;
    }

    this.modalCtrl.dismiss({
      bookingData: {
        firstName: this.form.value['first-name'],
        lastName: this.form.value['last-name'],
        guests: this.form.value['guest-number'],
        startDate: this.form.value['fromDate'],
        endDate: this.form.value['toDate']
      }
    }, 'confirm','bookModal');
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
