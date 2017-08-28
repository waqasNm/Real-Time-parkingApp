import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';
import { DataService } from './data.service';


@Injectable()
export class AuthService {
  userState: Observable<firebase.User>;
  constructor(private af: AngularFireAuth,private data:DataService, public router : Router) {
    this.userState = af.authState;
    // this.userState.subscribe(auth => {console.log(auth.uid)});
    // console.log(af.auth.currentUser.getIdToken);
    
   }

    signup(email: string, password: string,user ) {
    this.af.auth.createUserWithEmailAndPassword(email, password)
      .then(value => {
        console.log('Success!', value);
        this.data.addUser(user);
        this.router.navigate(['/login']);

      })
      .catch(err => {
        console.log('Something went wrong:',err.message);
      });    
  }
  
  isTrue;
  login(email: string, password: string) {
    this.af.auth.signInWithEmailAndPassword(email, password)
      .then(value => {
        console.log('Nice, it worked!');
      })
      .then(value => {
         this.data.showUser();
        //  this.isTrue = false;                   
        //   this.getLoggedInName.emit(this.isTrue);
        // this.router.navigate(['/user']);
        
      })
      .catch(err => {
        console.log('Something went wrong:',err.message);
      });
      return this.isTrue;
  }

  logout() {
    this.af.auth.signOut();
    console.log('logOut');
     this.router.navigate(['/login']);
  }

}
