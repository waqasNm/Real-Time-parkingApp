import { Injectable } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { AuthService } from './auth.service';
import { DataService } from './data.service';



@Injectable()
export class FeedbackService {

  feedback:FirebaseListObservable<any>;
  uid;
  feedbackData;
  user;
  state;
  constructor(private db:AngularFireDatabase,private af:AngularFireAuth, public auth:AuthService,public router:Router,private data:DataService) {
    // this.viewFeedbacks();
    // this.uid = auth.userState.uid;

    this.user = JSON.parse(localStorage.getItem("currentUser"));
    
    this.uid =this.user.userId;
    // auth.userState.subscribe(auth => { this.uid = auth.uid; return auth.uid});
    // console.log(this.uid);
    this.feedback = this.db.list('/feedbacks/' , { preserveSnapshot:true});
   

   }
   

  createFeedback(msg){
    this.user = JSON.parse(localStorage.getItem("currentUser"));
    // this.uid = this.af.auth.currentUser.uid;
    this.feedbackData = msg;
    this.feedbackData.userName = this.user.name;
    console.log(this.feedbackData);    
    this.feedback = this.db.list('/feedbacks/' + this.user.userId);
    this.feedback.push(msg)
    .then(_ => {
      this.router.navigate(['/dashboard'])
    })
    .catch(err => {
      console.log(err,"Error sending feedback");
    });
  }

  // feedbackVal = [];
  // viewFeedbacks(){
  //   // this.uid = this.af.auth.currentUser.uid; 
  //   if(this.user.userType === 'admin'){
  //     this.feedback = this.db.list('/feedbacks' , { preserveSnapshot:true});
  //     this.feedback.subscribe(snapshots => {
  //         this.feedbackVal = [];
  //         snapshots.forEach(data => {
  //           data.forEach(res => {
  //             console.log(res.val());
  //             this.feedbackVal.push(res.val())
  //           })
  //       })
  //     })      
  //   }else{
  //     this.feedback = this.db.list('/feedbacks/' + this.uid, { preserveSnapshot:true});
  //     this.feedback.subscribe(snapshots => {
  //       this.feedbackVal = [];
  //       snapshots.forEach(data => {
  //         console.log(data.val());
  //         this.feedbackVal.push(data.val())
  //     })
  //   })
  // }
  // }

  updateFeedback(key,obj){
    this.feedback.update(key,obj)
    .then(_ => {
      this.router.navigate(['/dashboard'])
    })
    .catch(err => {
      console.log(err,"Error sending feedback");
    });
  }

  deleteFeedback(key,userKey){
    this.feedback = this.db.list('/feedbacks/' + userKey , { preserveSnapshot:true});    
    this.feedback.remove(key)
    .then(_ => {console.log("Feedback Deleted Successfully!")})
    .catch(err => {console.log(err,"Error Deleting feedback")});
  }
}
