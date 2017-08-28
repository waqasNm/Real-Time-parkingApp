import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { AuthService } from './auth.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';

@Injectable()
export class BookingService {

  user;
  userBookings:FirebaseListObservable<any>;  
  
  constructor(private data:DataService,private db:AngularFireDatabase,public auth:AuthService,private af: AngularFireAuth) { 

  }
  bookingsDetail = [];
  bookingKeys = [];
  viewUserBookings(){
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    if(this.user.userType === "admin"){
      this.userBookings = this.db.list('/bookings',{preserveSnapshot:true});
      this.userBookings.subscribe(snapshots => {
        this.bookingsDetail = [];
        this.bookingKeys = [];
          snapshots.forEach(data => {
            data.forEach(res => {
                console.log(res.val());
                this.bookingsDetail.push(res.val());
                this.bookingKeys.push(res.key);
            }) 
          })
        })
    }else{
      this.userBookings = this.db.list('/bookings/' +this.user.userId,{preserveSnapshot:true});
      this.userBookings.subscribe(snapshots => {
      this.bookingsDetail = [];
      this.bookingKeys = [];
        snapshots.forEach(data => {
          console.log(data.val());
          this.bookingsDetail.push(data.val());
          this.bookingKeys.push(data.key);
        })
      })
    }    
    
  }

  deleteUserBooking(key,userKey){
    this.userBookings = this.db.list('/bookings/' + userKey,{preserveSnapshot:true})
    this.userBookings.remove(this.bookingKeys[key])
    .then(_ => { console.log("Booking Deleted!")})
    .catch(err => {console.log(err,"Error on deleteing this booking ")});
  }
 
}
