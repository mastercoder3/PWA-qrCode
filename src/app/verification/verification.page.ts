import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.page.html',
  styleUrls: ['./verification.page.scss'],
})
export class VerificationPage implements OnInit {
  
  phone;
  code;
  verification= '';

  constructor(private activated: ActivatedRoute) { }

  ngOnInit() {
    this.activated.params.subscribe(data =>{
      this.phone = data.phone;
      this.code = data.code;
    });
  }


  submit(){
    if(this.verification !== ''){
      let signin =  firebase.auth.PhoneAuthProvider.credential(this.code, this.verification);
      firebase.auth().signInWithCredential(signin).then(success => {
        if(success.uid){
          console.log('logged in');
        }
      });
    }
  }



}
