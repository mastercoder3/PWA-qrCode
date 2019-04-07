import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  recaptchaVerifier;
  phone='';
  userData = {
    email: '',
    password: ''
  }
  constructor(private auth: AngularFireAuth, private router: Router, private authService: AuthService , private api: ApiService) { }

  ngOnInit() {
    firebase.auth().languageCode = 'en';


  }

  Login(){
    console.log(this.phone)
    if(this.phone.length > 1){
      this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
        'size': 'invisible',
        'callback': function(response) {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          // this.phoneLogin();
          this.phoneLogin();
        }
      });
      
    }
    else{
      if(this.userData.email !== '' && this.userData.password !==''){
        this.authService.login(this.userData.email,this.userData.password)
          .then(res =>{
            if(res){
              localStorage.setItem('pid',res.user.uid)
              this.router.navigate(['/dashboard/home']);
            }
          }, err =>{
            console.log(err)
          })
      }
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
    this.authService.FacebookAuth()
  }

  googleLogin(){
    this.authService.loginWithGoogle()
      .then(res => {
        this.api.createUser(res.user.uid, {
          email: res.user.email,
          name: res.user.displayName,
          imageURL: res.user.photoURL,
          type: 'google'
        }).then(ress =>{
          localStorage.setItem('pid',res.user.uid)
          this.router.navigate(['/dashboard/home']);
        }, err =>{
          console.log(err )
        })
        
      }, err => {
        console.log(err)
      });
  }

}
