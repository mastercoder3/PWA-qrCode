import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  form: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthService, private api: ApiService) { }

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', Validators.compose([
        Validators.required, Validators.email
      ])],
      password: ['', Validators.required]
   })
  }

  submit(form){
    this.auth.signup(form.value.email, form.value.password)
      .then(res =>{
        this.api.createUser(res.user.uid, {email: form.value.email, password: form.value.password, type: 'signup'})
          .then(res => {
            console.log('user created')
          }, err =>{
            console.log(err)
          })
      }, err => {
        console.log(err)
      })
  }

}
