import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './services/auth.service';
import { DataService } from './services/data.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  userName;
  bool;
  currentUser;
  adminState = false;
  constructor(public auth:AuthService,public data:DataService, public router:Router) {
    data.getLoggedInUserName.subscribe(name => { this.loggedName(name)});
     this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    //  this.currentUser.subscribe(user =>{
    //   //  this.userName = user.name
    //   console.log(user);
    //  })
    if(!this.currentUser){
      console.log("No user info")
      this.adminState = false;
      this.router.navigate(['/login']);
    }else if(this.currentUser.userType === 'admin'){
      console.log("Admin");
      this.adminState = true;
    }else{
      console.log("User");
      this.adminState = false;      
    }

    if(this.auth.userState){
      console.log(this.auth.userState);
      // this.data.showUser();
      // this.router.navigate['/user']
    }else{
      console.log("no login info");
    }
    
   }

  private loggedName(name:Object): void {
        this.userName = name['user'];
        this.bool = name['state'];
        // localStorage.setItem('data',name);
        console.log(this.userName)
        console.log(this.bool)
    }

  logout(){
    this.auth.logout();
    localStorage.removeItem('currentUser');
    this.adminState = false;
    // this.userName = "";
    // this.bool = false;
    console.log("Logout");
  }
}
