import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ApiService } from '../api.service';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { HelperService } from '../helper.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  form: FormGroup;
  recaptchaVerifier;

  constructor(private fb: FormBuilder, private auth: AuthService, private api: ApiService, private helper: HelperService,
    private router: Router,
    private authh: AngularFireAuth) { }

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', Validators.compose([
        Validators.required, Validators.email
      ])],
      password: ['', Validators.required],
      phone:['', Validators.required]
   })
   firebase.auth().languageCode = 'en';
   this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
     'size': 'invisible',
     'callback': function(response) {
       // reCAPTCHA solved, allow signInWithPhoneNumber.
       // this.phoneLogin();
      
     }
   });
  }

  submit(form){
    if(form.value.phone.length === 10){
      this.helper.presentLoading();
      this.authh.auth.signInWithPhoneNumber('+1'+form.value.phone, this.recaptchaVerifier)
      .then((confirmationResult) => {
        this.helper.dismissLoading();
        let func = (data) =>{
          if(data.data === '' || !data.data){
            this.helper.presentToast('Failed to authenticate User.');
            return;
          }
          this.helper.presentLoading();
          let signin =  firebase.auth.PhoneAuthProvider.credential(confirmationResult.verificationId, data.data);
          firebase.auth().signInWithCredential(signin).then(success => {
            this.auth.signup(form.value.email, form.value.password)
            .then(res =>{
              this.api.createUser(res.user.uid, {email: form.value.email, password: form.value.password, type: 'signup'})
                .then(ress => {
                  localStorage.setItem('pid',res.user.uid)
              if(localStorage.getItem('formId'))
                {
                  this.helper.dismissLoading();
                  this.router.navigate(['/dashboard/form',{
                  formId: localStorage.getItem('formId')
                }]);
                localStorage.removeItem('formId');}
                else{
                  this.helper.dismissLoading();
                  this.router.navigate(['/dashboard/home']);
                }
                
                }, err =>{
                  console.log(err)
                  this.helper.dismissLoading();

                })
            }, err => {
              console.log(err)
              this.helper.dismissLoading();
            })
      }, err =>{
        this.helper.dismissLoading();

      });
        }
        this.helper.presentAlertPrompt('Enter Verification Code','Verification Code',func)
        
      }).catch((error) => {
        // Error; SMS not sent
        // ...
      });
    }
    else{
      this.helper.presentToast('Please Fill the Fields Correctly.');
    }
   
  }

}
