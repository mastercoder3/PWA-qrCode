import { Injectable } from '@angular/core';
import { auth } from 'firebase/app';
import { AngularFireAuth } from "@angular/fire/auth";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public afAuth: AngularFireAuth) { }

   // Sign in with Facebook
   FacebookAuth() {
    return this.AuthLogin(new auth.FacebookAuthProvider());
  }  

  // Auth logic to run auth providers
  AuthLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
    .then((result) => {
        console.log('You have been successfully logged in!')
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
