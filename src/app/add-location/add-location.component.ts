import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl } from '@angular/forms';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-add-location',
  templateUrl: './add-location.component.html',
  styleUrls: ['./add-location.component.css']
})
export class AddLocationComponent implements OnInit {

  addPlaceForm;
  slots = [];
  constructor(private data:DataService) { }

  ngOnInit() {
     this.addPlaceForm = new FormGroup({
      place : new FormControl(""),
      numOfSlots : new FormControl("")
    })
  }

  add(place){
    console.log(place);
    const obj = place;
    this.slots = [];
    // console.log(place.numOfSlots);
    for(var i = 0;i < place.numOfSlots;i++){
      this.slots.push(i+1);
      // console.log("Slot no:" +this.slots[i]);
    }
    obj.slots = this.slots;
    console.log(obj);
    this.data.addParkingPlaces(obj);
    this.addPlaceForm.reset();
  }

}
