import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MaterialModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk';
import 'hammerjs';
import { RouterModule } from '@angular/router';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

/*Angularfire2*/
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';

/*Components*/
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { UserComponent } from './user/user.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LocationsComponent } from './locations/locations.component';
import { AdminComponent } from './admin/admin.component';
import { BookingComponent } from './booking/booking.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { AddLocationComponent } from './add-location/add-location.component';

/*Services*/
import { AuthService } from './services/auth.service';
import { DataService } from './services/data.service';
import { BookingService } from './services/booking.service';
import { FeedbackService } from './services/feedback.service';
import { AuthGuardService } from './services/auth-guard.service';



export const config = {
    apiKey: "AIzaSyCQJj9E9iA5YBG9dQcB0IcPbPc-FJF5ZmU",
    authDomain: "parkingapp-8fd64.firebaseapp.com",
    databaseURL: "https://parkingapp-8fd64.firebaseio.com",
    projectId: "parkingapp-8fd64",
    storageBucket: "",
    messagingSenderId: "1061197654669"
  };

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserComponent,
    RegisterComponent,
    DashboardComponent,
    LocationsComponent,
    AdminComponent,
    BookingComponent,
    FeedbackComponent,
    AddLocationComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
    BrowserAnimationsModule,
    MaterialModule,
    CdkTableModule,
    AngularFireModule.initializeApp(config),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    RouterModule.forRoot([
      { path: '', 
        component: DashboardComponent, 
        canActivate: [AuthGuardService] 
      },
      { 
        path:'users',
        component:UserComponent
      },
      { 
        path:'login',
        component:LoginComponent
      },
      { 
        path:'register',
        component:RegisterComponent
      },
      {
        path:'locations',
        component:LocationsComponent
      },
      {
        path:'admin',
        component:AdminComponent
      },
      {
        path:'viewbookings',
        component:BookingComponent
      },
      {
        path:'feedback',
        component:FeedbackComponent
      },
      {
        path:'addlocation',
        component:AddLocationComponent
      },
      {
        path:'dashboard',
        component:DashboardComponent
      }
    ])
  ],
  providers: [AuthService,DataService,BookingService,FeedbackService,AuthGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
