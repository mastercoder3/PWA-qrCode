import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.page.html',
  styleUrls: ['./verification.page.scss'],
})
export class VerificationPage implements OnInit {
  
  phone;
  code;
  verification= '';
  recaptchaVerifier;

  constructor(private activated: ActivatedRoute , private api: ApiService, private router: Router,private auth: AngularFireAuth) { }

  ngOnInit() {
    this.activated.params.subscribe(data =>{
      this.phone = data.phone;
      this.code = data.code;
    });
    firebase.auth().languageCode = 'en';
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
      'size': 'invisible',
      'callback': function(response) {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        // this.phoneLogin();
       
      }
    });
  }

  sendAgain(){
    this.auth.auth.signInWithPhoneNumber('+1'+this.phone, this.recaptchaVerifier)
    .then((confirmationResult) => {
        this.code = confirmationResult.verificationId;
     
    }).catch((error) => {
      // Error; SMS not sent
      // ...
    });
  }


  submit(){
    if(this.verification !== ''){
      let signin =  firebase.auth.PhoneAuthProvider.credential(this.code, this.verification);
      firebase.auth().signInWithCredential(signin).then(success => {
        if(success.uid){
          this.api.createUser(success.uid,{
            phone: this.phone,
            type: 'phone'
          })
          .then(res =>{
            localStorage.setItem('pid',success.uid)
             this.router.navigate(['/dashboard/home']);
          }, err =>{
            console.log(err);
          })
        }
      });
    }
  }



}
