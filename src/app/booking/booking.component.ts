import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { AuthService } from '../services/auth.service';
import { BookingService } from '../services/booking.service';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';


@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {
  bookingsDetail = [];
  bookingKeys = [];
  uid;
  user;
  userBookings:FirebaseListObservable<any>;
  constructor(public data:DataService,public auth:AuthService,public booking:BookingService, private db :AngularFireDatabase) {
      this.user = JSON.parse(localStorage.getItem('currentUser'));
    auth.userState.subscribe(auth => { this.uid = auth.uid; return auth.uid});
    booking.viewUserBookings();
  

   }

  ngOnInit() {
  }


  deleteBooking(i,userKey){    
    this.booking.deleteUserBooking(i,userKey);
  }

}
