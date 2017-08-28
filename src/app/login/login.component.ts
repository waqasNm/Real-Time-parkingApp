import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm;
  constructor(private auth:AuthService) { }

  ngOnInit() {
    this.loginForm = new FormGroup ({
      email: new FormControl("yaseen@gmail.com"),
      password: new FormControl("abc123")
    })
  }
  login(user) {
    this.auth.login(user.email, user.password);
    // this.isTrue = false;
    console.log(user);
    this.loginForm.reset();
  }

}
