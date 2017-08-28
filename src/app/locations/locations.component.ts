import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl } from '@angular/forms';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { BookingService } from '../services/booking.service';
import { DataService } from '../services/data.service';
import { AuthService } from '../services/auth.service';

import {Subject} from 'rxjs/Subject';
import {debounceTime} from 'rxjs/operator/debounceTime';




@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.css']
})
export class LocationsComponent implements OnInit {
  private _success = new Subject<string>();
  private _error = new Subject<string>();

  successMessage: string;
  errorMessage:string;


  // public changeSuccessMessage() {
  //   this._success.next(`${new Date()} - Message successfully changed.`);
  // }

  places:FirebaseObjectObservable<any>;
  placesVal = [];
  parkingTime;
  uid;
  user;
  bookingsDetail = [];
  bookings:FirebaseListObservable<any>;
  // errorMessage;
  constructor(
    private db:AngularFireDatabase,
    public auth:AuthService,
    public bookService:BookingService,
    private af:AngularFireAuth,
    public data:DataService) {
    this.getPlaces();
    auth.userState.subscribe(auth => { this.uid = auth.uid; return auth.uid});
    
    this.data.bookings.subscribe((data) => {
      data.forEach(bookData => { 
        bookData.forEach(snapshot => {
          console.log(snapshot.val());
          this.bookingsDetail.push(snapshot.val());
        })
     })
    })

    // this.reservedSlots();    
    
   }
  
  

  ngOnInit():void {

    this._success.subscribe((message) => this.successMessage = message);
    debounceTime.call(this._success, 5000).subscribe(() => this.successMessage = null);

    this._error.subscribe((message) => this.errorMessage = message);
    debounceTime.call(this._error, 5000).subscribe(() => this.errorMessage = null);

     this.parkingTime = new FormGroup ({
      date: new FormControl(""),
      time: new FormControl(""),
      hours: new FormControl("")
    })
  }

  /*View Places of Parking*/
  slots = [];
  placesKey = [];
  getPlaces(){
    this.places = this.db.object('/places',{preserveSnapshot:true});
    this.places.subscribe(snapshot =>{
      this.placesVal = [];
      this.placesKey = [];
      this.slots = [];
      snapshot.forEach(places =>{
        console.log(places.val());
        console.log(places.val().slots);
        // this.slots.push(places.val().slots);
        this.placesVal.push(places.val())
        this.placesKey.push(places.key)
        this.slots.push(places.val().slots)
        console.log(this.slots);
      })
    })
  }
  /*Book Parking*/
  booking:FirebaseObjectObservable<any>;
  selectedSlot;
  selectSlot(i){
    console.log("slot-" + i);
    this.selectedSlot = i;
    // this.booking = this.db.object('/bookParking/');
  }

   book = false;
   currentBookingDetails;
   demoFunc(date){
     this.currentDate = new Date();    
     console.log(this.currentDate);     
     console.log(new Date(date));     
     if(new Date(date) < this.currentDate){
       console.log("date cannot be past date");
       this.errorMessage = "date cannot be past date";
       this._error.next(this.errorMessage);
    }else{
      console.log("no issue");
    }
   }
   
  bookParking(booking, locIndex){
    this.book = true
    console.log(locIndex);
    this.currentDate = new Date();    
    this.selectedDate = new Date(booking.date + " " + booking.time);
    this.currentBookingDetails = booking;
    this.currentBookingDetails.timeStamp = this.selectedDate.getTime();
    this.currentBookingDetails.placeId = this.placesKey[locIndex];        
    console.log(booking);
    this.reservedSlots();
    this.parkingTime.reset();  
    
    
  }

  /*View booking*/
  viewBooking:boolean = false; 
  view(index){
    this.viewBooking = true;
    console.log(index);
    console.log(this.placesKey[index]);
  }
  /*reserved slot*/
  reserved(i){
    console.log(i);
    // console.log(this.data.userName);
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    console.log(this.user.name);
    console.log(this.placesKey[i]);
    console.log(this.selectedSlot);
    console.log(this.currentBookingDetails);
    this.currentBookingDetails.reservedSlot = this.selectedSlot;
    this.currentBookingDetails.userId = this.uid;
    this.currentBookingDetails.userName = this.user.name;
    this.checkDateTime(this.currentBookingDetails);
    // this.data.addBooking(this.currentBookingDetails) 
    console.log(this.currentBookingDetails);
  }


  /*Check user date, time and slot*/
   currentDate;
  currentMonth;
  selectedDate;
  startDate;
  endDate;
  startTime;
  endTime;
  flag:boolean = false;
  checkDateTime(data){
    this.currentDate = new Date();
    // this.currentMonth = this.currentDate.getMonth();
    // console.log(data.date);
    // console.log(data.time);
    this.selectedDate = new Date(data.date + " " + data.time);
    console.log(this.currentDate);
    console.log(this.selectedDate);
    if(this.selectedDate < this.currentDate){
      console.log("date cannot be past date");
      this.errorMessage = "date cannot be past date";
       this._success.next(`${this.errorMessage} - Message successfully changed.`);
    }else{
      console.log("good to go!");
      this.endDate = new Date(this.selectedDate);
      this.endDate.setHours(this.endDate.getHours() + data.hours);
      console.log(this.endDate);
      

      /*fetch Booking details of others from database and check for available slots*/
      
      for(let i = 0; i < (this.bookingsDetail && this.bookingsDetail.length || 0) ; i++){

      if(this.bookingsDetail[i].reservedSlot != this.selectedSlot){
        console.log("slot availabe");
        this.flag = true;
        // continue;
        break;
      }else{

      this.startTime = new Date(this.bookingsDetail[i].timeStamp)
      console.log(this.bookingsDetail[i].hours);
      console.log(this.bookingsDetail[i].timeStamp);
      console.log(this.bookingsDetail[i].date);
      this.endTime = new Date(this.startTime);
      this.endTime.setHours(Number(this.endTime.getHours())  + Number(this.bookingsDetail[i].hours) )
      console.log(this.startTime);
      console.log(this.endTime);
     
      if(this.selectedDate >= this.startTime && this.selectedDate <= this.endTime ||
          this.endDate >= this.startTime && this.endDate <= this.endTime){
            console.log("Slot is Already Reserved");
            this.flag = false;
          }else{
            console.log("Slot is Availabe");
            this.flag = true;
            
          }
      }
    }
    if(this.flag){
      this.data.addBooking(data) 
      console.log("booking added successfully!")      
    }else{
      console.log("Some Error Occur");
    }
  }

}
  /**/


  /*Reserved Slots color change Event*/
    bookedSlots = []; 
    availableSlots = [];
    startArr = [];
    endArr = [];
    reservedSlots(){

    //   for(var i = 0; i < (this.bookingsDetail && this.bookingsDetail.length || 0); i++){
    //     for(var a = 0; a < this.placesKey.length; a++){
    //       if(this.bookingsDetail[i].placeId === this.placesKey[a]){
    //         for(var s = 0; s < this.slots[a].length; s++){
    //           if(this.bookingsDetail[i].reservedSlot === this.slots[a][s]){
    //             console.log("place id: " + this.placesKey[a]);
    //             console.log("place Slot: " + this.slots[a][s]);
    //             console.log("reservedSLot: " + this.bookingsDetail[i].reservedSlot);
    //             break;
                
    //           }
    //         }
    //        break; 
    //     }
    //   }
    //   // break;        
    // }
    
      this.endDate = new Date(this.selectedDate);
      this.endDate.setHours(this.endDate.getHours() + this.currentBookingDetails.hours);
      this.bookedSlots = [];
      this.availableSlots = [];
      this.startArr = [];
      this.endArr = [];
    for(var i = 0; i < (this.bookingsDetail && this.bookingsDetail.length || 0); i++){
      this.startTime = new Date(this.bookingsDetail[i].timeStamp)
      this.endTime = new Date(this.startTime);
      this.endTime.setHours(Number(this.endTime.getHours())  + Number(this.bookingsDetail[i].hours) )
      console.log(this.selectedDate);
      console.log(this.startTime);
      if(this.bookingsDetail[i].placeId === this.currentBookingDetails.placeId){
        
        console.log("place id matched!");
        if(this.selectedDate >= this.startTime && this.selectedDate <= this.endTime ||
          this.endDate >= this.startTime && this.endDate <= this.endTime){
            console.log("Already Reserved Slots");
            this.bookedSlots.push(this.bookingsDetail[i].reservedSlot);
            console.log(this.bookedSlots);
            this.startArr = this.placesVal[i].slots.slice(0,this.bookingsDetail[i].reservedSlot-1);
            this.endArr = this.placesVal[i].slots.slice(this.bookedSlots);
            console.log(this.placesVal[i].slots.slice(0,this.bookingsDetail[i].reservedSlot-1));
            console.log(this.placesVal[i].slots.slice(this.bookedSlots));
            this.availableSlots = this.startArr.concat(this.endArr);
            console.log(this.availableSlots);
            // this.flag = false;
        }else{
            console.log("Slot is Availabe");
            // this.flag = true;
            
          }

        //break;
      }
    }
    // console.log("location:" + locationKey);
    // console.log("Slot:" + slot);
    // console.log("current booking:" + this.currentBookingDetails.date);
  }

  /**/

}
