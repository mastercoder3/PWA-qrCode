import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HelperService } from '../helper.service';
import { ApiService } from '../api.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-form',
  templateUrl: './form.page.html',
  styleUrls: ['./form.page.scss'],
})
export class FormPage implements OnInit {

  rate:Array<any>;
  categoryId;
  ItemId;
  form;
  questions;
  buildForm;
  comment: string = '';
  flag;

  constructor(private activatedRoute: ActivatedRoute, private helper: HelperService, private api: ApiService, private router: Router) { }

// form;categoryId=EmGeE4R6fqszphXIGj4l;itemId=J0btypcueBpDgU40OhW0

  ngOnInit() {
    this.helper.presentLoading();
    this.activatedRoute.params.subscribe(res =>{
      this.categoryId = res.categoryId;
      this.ItemId = res.itemId;
      if(this.categoryId && this.ItemId){
        this.api.getFormInstance(this.categoryId, this.ItemId)
          .pipe(map(actions => actions.map(a =>{
            const data = a.payload.doc.data();
            const did = a.payload.doc.id;
            return {did, ...data}
          })))
          .subscribe(formData => {
            this.form = formData;
            this.api.getQuestions()
              .pipe(map(actions => actions.map(a =>{
                const data = a.payload.doc.data();
                const did = a.payload.doc.id;
                return {did, ...data}
              })))
                .subscribe(questionResponse =>{
                  this.questions = questionResponse;
                  this.flag = this.form[0].questionId;
                  if(this.flag.length > 0 && this.questions.length > 0){
                    this.buildForm = this.questions.filter(data => this.flag.indexOf(data.did) > -1);
                    this.helper.dismissLoading();
                    this.setForm();
                  }
                })
          })
      }
      else{
        setTimeout( () => {
          this.helper.dismissLoading();
          this.router.navigate(['dashboard/home']);
          this.helper.presentToast('No Form To Fill.');
        }, 1000);

      }
    });
  }

  setForm(){
    if(this.buildForm.length > 0){
      this.rate = new Array(this.buildForm.length);
      for(let i =0; i< this.buildForm.length; i++){
        this.rate[i] = {questionId: '', questionText: '', rating: 0};
      }
    }
  }
  setRate(item,i){
    this.rate[i].questionId = item.did;
    this.rate[i].questionText = item.text;
  }

  SubmitForm(){
    if(this.checkForms()){
      let data = {
        uid: localStorage.getItem('pid'),
        answers: this.rate,
        comment: this.comment
      }
      this.api.addToAnswer(data)
        .then(res => {
          this.helper.presentToast('Thank you for Filling the Form.');
          this.router.navigate(['dashboard/home']);
        }, err =>{
          this.helper.presentToast('Something Went wrong.');
        })
    }
    else{
      this.helper.presentToast('Please Fill All the Form.');
    }
  }
  
  checkForms(){
    let x = false;
    this.rate.forEach(a => {
      if(a.rating === 0){
        x = false;
      }
      else{
        x = true;
      }
    })
    return x;
  }
}
