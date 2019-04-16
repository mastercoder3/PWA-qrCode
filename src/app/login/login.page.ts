import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ApiService } from '../api.service';
import { HelperService } from '../helper.service';

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
  constructor(private auth: AngularFireAuth, private router: Router, private authService: AuthService , private api: ApiService, private helper: HelperService) {
    if(localStorage.getItem('pid'))
    this.router.navigate(['dashboard/home']);
   }

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
    if(this.phone.length > 1){
      this.phoneLogin();
      
    }
    else{
      if(this.userData.email !== '' && this.userData.password !==''){
        this.authService.login(this.userData.email,this.userData.password)
          .then(res =>{
            if(res){
              localStorage.setItem('pid',res.user.uid)
              if(localStorage.getItem('formId'))
                {this.router.navigate(['/dashboard/form',{
                  formId: localStorage.getItem('formId')
                }]);
                localStorage.removeItem('formId');}
                else
                this.router.navigate(['/dashboard/home']);
            }
          }, err =>{
            console.log(err)
          })
      }
    }
  }

  code;

  phoneLogin(goto?) {
    this.auth.auth.signInWithPhoneNumber(this.phone, this.recaptchaVerifier)
      .then((confirmationResult) => {
        if(goto === 'no'){
          this.code = confirmationResult.verificationId;
        }
        else{
          this.router.navigate(['verification', {
            phone: this.phone,
            code: confirmationResult.verificationId
          }])
        }
        
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
        if(res.additionalUserInfo.isNewUser){
          // let ok = (data) =>{
          //   if(data.data){
          //     this.phone = data.data;
          //     this.phoneLogin('no');
          //     this.helper.presentLoading();

          //     let code = (data) =>{
          //       if(data.data){
          //         this.helper.presentLoading();
          //         let signin =  firebase.auth.PhoneAuthProvider.credential( this.code, data.data);
          //         firebase.auth().signInWithCredential(signin).then(success => {
          //           if(success.uid){
          //                 this.api.createUser(res.user.uid, {
          //                 email: res.user.email,
          //                 name: res.user.displayName,
          //                 imageURL: res.user.photoURL,
          //                 phone: this.phone,
          //                 type: 'google'
          //               }).then(ress =>{
          //                 this.helper.dismissLoading();
          //                 localStorage.setItem('pid',res.user.uid)
          //                 this.router.navigate(['/dashboard/home']);
          //               }, err =>{
          //                 this.helper.presentToast(err.message);
          //                 this.helper.dismissLoading();
          //               })
          //           }
          //         });
          //       }
          //     };
          //     setTimeout(()=> {
          //       this.helper.dismissLoading();
          //       this.helper.presentAlertPrompt('Please Enter Confirmation Code.','Confirmation Code',code);
          //     }, 2000);

          //   }
          // }
          // this.helper.presentAlertPrompt('Please Enter your Phone number to continue.','(xxx) xxx - xxxx',ok);
          this.api.createUser(res.user.uid, {
            email: res.user.email,
            name: res.user.displayName,
            imageURL: res.user.photoURL,
            phone: this.phone,
            type: 'google'
          }).then(ress =>{
            this.helper.dismissLoading();
            localStorage.setItem('pid',res.user.uid)
            if(localStorage.getItem('formId'))
            {this.router.navigate(['/dashboard/form',{
              formId: localStorage.getItem('formId')
            }]);
            localStorage.removeItem('formId');}
            else
             this.router.navigate(['/dashboard/home']);
          }, err =>{
            this.helper.presentToast(err.message);
            this.helper.dismissLoading();
          })
        }
        else{
          localStorage.setItem('pid',res.user.uid)
          if(localStorage.getItem('formId'))
            {this.router.navigate(['/dashboard/form',{
              formId: localStorage.getItem('formId')
            }]);
            localStorage.removeItem('formId');}
            else
             this.router.navigate(['/dashboard/home']);
        }
        
        
      }, err => {
        this.helper.presentToast(err.message);
      });
  }

}
