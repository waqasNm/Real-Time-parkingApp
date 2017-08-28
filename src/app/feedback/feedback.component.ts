import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl } from '@angular/forms';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { FeedbackService } from '../services/feedback.service';

import {Subject} from 'rxjs/Subject';
import {debounceTime} from 'rxjs/operator/debounceTime';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {
  private _success = new Subject<string>();
  private _error = new Subject<string>();

  successMessage: string;
  errorMessage:string;

  fbForm;
  user;
  feedArr = [];
  feedKey = [];
  isTrue:boolean = false;
  replyText;
  reply = {};
  feedback:FirebaseListObservable<any>;
  
  constructor( public fb: FeedbackService, private db: AngularFireDatabase) { 
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    this.viewFeedbacks();
  }

viewFeedbacks(){
    // this.uid = this.af.auth.currentUser.uid; 
    if(this.user.userType === 'admin'){
      this.feedback = this.db.list('/feedbacks' , { preserveSnapshot:true});
      this.feedback.subscribe(snapshots => {
          this.feedArr = [];
          this.feedKey = [];
          snapshots.forEach(data => {
            data.forEach(res => {
              console.log(res.val());
              this.feedArr.push(res.val())
              this.feedKey.push(res.key)
            })
        })
      })      
    }else{
      this.feedback = this.db.list('/feedbacks/' + this.user.userId, { preserveSnapshot:true});
      this.feedback.subscribe(snapshots => {
        this.feedArr = [];
        this.feedKey = [];
        snapshots.forEach(data => {
          console.log(data.val());
          this.feedArr.push(data.val())
          this.feedKey.push(data.key)
      })
    })
  }
  }

  ngOnInit():void {
     this._success.subscribe((message) => this.successMessage = message);
    debounceTime.call(this._success, 5000).subscribe(() => this.successMessage = null);

    this._error.subscribe((message) => this.errorMessage = message);
    debounceTime.call(this._error, 5000).subscribe(() => this.errorMessage = null);

    this.fbForm = new FormGroup ({
      title : new FormControl(""),
      description : new FormControl(""),
      userId : new FormControl(this.user.userId)
    })
  }

  sendFb(fb){
    console.log(fb);
    this.fb.createFeedback(fb);
    this.fbForm.reset();
  }

  sendReply(fb,index){

    console.log(this.feedKey[index]);
    console.log(this.replyText);
    fb.Reply = fb.Reply || [];
    var obj = {
      text:this.replyText,
      name:this.user.name,
      userId:this.user.userId
    }
    fb.Reply.push(obj);
    this.fb.updateFeedback(fb.userId + "/" + this.feedKey[index],{Reply:fb.Reply});
    this.replyText = "";
    
  }


  deleteFeedback(index,userKey){
    console.log(index);
    console.log(userKey);
    console.log(this.feedKey[index]);
    this._success.next('Feedback Deleted!');
    this.fb.deleteFeedback(this.feedKey[index],userKey);
  }

}
