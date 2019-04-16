import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.page.html',
  styleUrls: ['./user-settings.page.scss'],
})
export class UserSettingsPage implements OnInit {
  newEmail;

  constructor() { }

  ngOnInit() {
  }

  changeEmail(){
    if(this.newEmail){

      firebase.auth().onAuthStateChanged( user => {
        if(user){
         user.updateEmail(this.newEmail).then(res =>{
            console.log(res)
          }), err => {
            console.log(err);
          }
        }
        
      });
      // var user = firebase.auth().currentUser;

      // user.updateEmail(this.newEmail).then(res =>{
      //   console.log(res)
      // }), err => {
      //   console.log(err);
      // }
  }
}

}
