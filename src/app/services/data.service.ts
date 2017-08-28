import { Injectable,EventEmitter,Output } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';



 @Injectable()
export class DataService {
  
  @Output() getLoggedInUserName: EventEmitter<any> = new EventEmitter();


  users: FirebaseObjectObservable<any[]>;
  userProfile: FirebaseObjectObservable<any>;
  addPlaces:FirebaseListObservable<any>;
  bookings:FirebaseListObservable<any>;  
  userDetails;
  uid;
  state;
  userName;
  userType;
  userState;
  user:FirebaseObjectObservable<any>;
  constructor(private db: AngularFireDatabase, private af: AngularFireAuth, public router: Router) {
    af.authState.subscribe(auth => {this.uid = auth.uid;});
     this.bookings = this.db.list('/bookings' ,{ preserveSnapshot:true});
     this.users = db.object('/users',{preserveSnapshot:true});
  }
 
  addUser = function (user) {
    this.uid = this.af.auth.currentUser.uid; 
    this.users = this.db.object('/users/'+ this.uid);    
    this.users.set(user);
  }

  deleteUser(key){
    console.log(key);
    const user = this.db.object('/users/' + key).remove();
    user.then(_ => {console.log("user Deleted Successfull");})
    .catch(err => { console.log(err,"error occur deleting user");})
  }
  showUser = function ():Observable<any>{
    this.uid = this.af.auth.currentUser.uid; 
    console.log(this.uid);
    this.userProfile = this.db.object('/users/' + this.uid, { preserveSnapshot: true });
    this.userProfile.subscribe(snapshot => {
      this.userName = "";
      console.log(snapshot.val());
      console.log(snapshot.val().userType)
      console.log(snapshot.val().name);
      this.userName = snapshot.val().name;
      this.userType = snapshot.val().userType;
      console.log(this.userName);
      localStorage.setItem('currentUser',JSON.stringify({userId:this.uid,name:this.userName,userType:this.userType}))
      if(snapshot.val() === null){
          console.log('Your Account is Blocked by Admin!')
          this.router.navigate(['/logIn']);
      }else {
          if(snapshot.val().userType === 'admin'){
            console.log('Admin Login');
            // this.stateCompany = false;
            this.state = 'user'; 
            this.userState = true;         
            this.router.navigate(['/admin']);
          }else {
            console.log('User login');
            this.userState = true;                     
            this.router.navigate(['/dashboard']);
          } 
        }
        this.getLoggedInUserName.emit({user:this.userName,state:this.userState, type: this.userType}); 
      
    })
    return this.userName;
  }

  addParkingPlaces(place){
    this.addPlaces = this.db.list('/places');
    this.addPlaces.push(place);
  }

  bookParking:FirebaseListObservable<any>;
  addBooking(booking){
    this.bookParking = this.db.list('/bookings/' + this.uid);
    this.bookParking.push(booking);
    console.log(booking);
  }

  deleteBooking(key){
    console.log('/bookings/' + key);
    const booking = this.db.list('/bookings/'+key).remove()
    booking.then(_ => {console.log("Booking Deleted!");})
    .catch(err => { console.log(err,"Error on Deleteing booking");});
    // this.bookParking.remove(key);
  }

  // feedbacks:FirebaseListObservable<any>;
  deleteFeedback(key){
    console.log('/feedbacks/' + key);
    const feedback = this.db.list('/feedbacks/' + key).remove()
    feedback.then(_ => { console.log("Feedback Deleted!");})
    .catch(err => { console.log(err,"Error on Deleteing Feedback");})
  }

}
