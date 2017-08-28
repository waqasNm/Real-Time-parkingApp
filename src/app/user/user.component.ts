import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl } from '@angular/forms';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  
  usersVal = [];
  usersKey = [];
  constructor(public data:DataService) {
    this.data.users.subscribe(snapshots => {
      this.usersVal = [];
      this.usersKey = [];
      snapshots.forEach(user => {
        console.log(user.val());
        this.usersKey.push(user.key);
        this.usersVal.push(user.val());
      })
    })
   }

  ngOnInit() {
   
  }

  deleteUser(index){
    console.log(index);
    console.log(this.usersKey[index]);
    this.data.deleteBooking(this.usersKey[index]);
    this.data.deleteFeedback(this.usersKey[index]);
    this.data.deleteUser(this.usersKey[index]);
  }

}
