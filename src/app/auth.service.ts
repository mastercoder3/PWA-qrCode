import { Injectable } from '@angular/core';
import { auth } from 'firebase/app';
import { AngularFireAuth } from "@angular/fire/auth";
import { ApiService } from './api.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user;

  constructor(public afAuth: AngularFireAuth, private api: ApiService, private router: Router) { }

   // Sign in with Facebook
   FacebookAuth() {
    return this.AuthLogin(new auth.FacebookAuthProvider());
  }  

  // Auth logic to run auth providers
  AuthLogin(provider) {
    // console.log(provider)
    return this.afAuth.auth.signInWithPopup(provider)
    .then((result) => {
      this.user = result;
      this.api.createUser(result.user.uid, {
        email: this.user.additionalUserInfo.profile.email,
        name: this.user.additionalUserInfo.profile.name,
        imageURL: this.user.user.photoURL,
        type: 'facebook'
      })
        .then(res =>{
          localStorage.setItem('pid',result.user.uid)
          if(localStorage.getItem('formId'))
            {this.router.navigate(['/dashboard/form',{
              formId: localStorage.getItem('formId')
            }]);
            localStorage.removeItem('formId');}
            else
             this.router.navigate(['/dashboard/home']);
        }, err =>{
          console.log(err)
        })
    }).catch((error) => {
        console.log(error)
    })
  }

  async  loginWithGoogle() {
    return await this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider())
  }


  login(email,password){
    return this.afAuth.auth.signInWithEmailAndPassword(email,password);
  }

  signup(email,password){
    return this.afAuth.auth.createUserWithEmailAndPassword(email,password);
  }

}
