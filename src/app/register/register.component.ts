import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  signupForm;
  constructor(private auth:AuthService) { }

  ngOnInit() {
    this.signupForm = new FormGroup ({
      name: new FormControl("waqas"),
      email: new FormControl(""),
      password: new FormControl(""),
      userType: new FormControl("user")   
    })
  }

  signup(user) {
    this.auth.signup(user.email, user.password,user)
    console.log(user);
    this.signupForm.reset();
    console.log("Signed in");
  }

}
