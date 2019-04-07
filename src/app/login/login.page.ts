import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  recaptchaVerifier;
  phone='';

  constructor(private auth: AngularFireAuth, private router: Router, private authService: AuthService) { }

  ngOnInit() {
    firebase.auth().languageCode = 'en';

    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
      'size': 'invisible',
      'callback': function(response) {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        // this.phoneLogin();
      }
    });
  }

  Login(){
    if(this.phone > ''){
      this.phoneLogin();
    }
    else{

    }
  }

  phoneLogin() {
    this.auth.auth.signInWithPhoneNumber(this.phone, this.recaptchaVerifier)
      .then((confirmationResult) => {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        // console.log(confirmationResult);
        this.router.navigate(['verification', {
          phone: this.phone,
          code: confirmationResult.verificationId
        }])
      }).catch((error) => {
        // Error; SMS not sent
        // ...
      });
  }

  fbLogin(){
    this.authService.FacebookAuth().then(res =>{
      console.log(res);
    }, err =>{
      console.log(err)
    })
  }

}
