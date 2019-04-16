import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';
import { ApiService } from '../api.service';
import { AuthService } from '../auth.service';
import { HelperService } from '../helper.service';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.page.html',
  styleUrls: ['./user-settings.page.scss'],
})
export class UserSettingsPage implements OnInit {
  newEmail;
  user;
  oldPassword;
  password;

  constructor(private api: ApiService, private auth: AuthService, private helper: HelperService) { }

  ngOnInit() {
    this.api.getUser(localStorage.getItem('pid'))
      .subscribe(res =>{
        this.user = res;
      })
  }

  count=0;

  changeEmail(){
    if(this.newEmail){ 
      this.helper.presentLoading();
      firebase.auth().onAuthStateChanged( user => {
        if(user){
         user.updateEmail(this.newEmail).then(res =>{
            this.helper.presentToast('You Email Has been Changed.');
            this.user.email = this.newEmail;
            this.newEmail = '';
            this.count =0;
            
            this.api.updateUser(localStorage.getItem('pid'),this.user);
            this.helper.dismissLoading()
          }), err => {
            this.count += 1;
            if(this.count === 2){
              this.helper.dismissLoading();
              this.helper.presentToast('Cannot Change Email.')
            }
            if(this.user){
              this.auth.login(this.user.email, this.user.password)
                .then(res =>{
                  this.helper.dismissLoading()
                  this.changeEmail();
                 

                },err =>{
                  this.helper.presentToast(err.message)
                  this.helper.dismissLoading()
                })
            }
            
          }
        }
        else{
          this.helper.presentToast('Cannot Change passowrd Right now, come back later.');
        }
        
      });
  }
}

count1=0;

changePassword(){
  if(this.oldPassword !== '' && this.password !== ''){
      if(this.oldPassword === this.user.password){
        this.helper.presentLoading();
        firebase.auth().onAuthStateChanged( user => {
          if(user){
           user.updatePassword(this.password)
            .then(res =>{
              this.helper.presentToast('Your Password Has been Changed.');
              this.newEmail = '';
              this.user.password = this.password;
              this.oldPassword='';
               this.password='';
               this.api.updateUser(localStorage.getItem('pid'),this.user);
              this.count1 =0;
              this.helper.dismissLoading()
            }, err =>{
              this.count1 += 1;
              if(this.count1 === 2){
                this.helper.dismissLoading();
                this.helper.presentToast('Cannot Change Password.')
              }
              if(this.user){
                this.auth.login(this.user.email, this.user.password)
                  .then(res =>{
                    this.helper.dismissLoading()
                    this.changePassword();
                    
  
                  },err =>{
                    this.helper.presentToast(err.message)
                    this.helper.dismissLoading()
                  })
              }
            })
          }
          else{
            this.helper.presentToast('Cannot Change passowrd Right now, come back later.');
          }
          
        });
    }
    else{
      this.helper.presentToast('You entered Wrong Password.');
      this.oldPassword='';
      this.password='';
    }
  }
 
}

}
