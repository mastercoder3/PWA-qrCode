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
  formId;

  constructor(private activatedRoute: ActivatedRoute, private helper: HelperService, private api: ApiService, private router: Router) {
   }

// form;categoryId=EmGeE4R6fqszphXIGj4l;itemId=J0btypcueBpDgU40OhW0

  ngOnInit() {
    this.helper.presentLoading();
    this.activatedRoute.params.subscribe(res =>{
     this.formId = res.formId;
      if(this.formId){
        this.api.getForm(this.formId)
          .pipe(map(actions => {
            const data = actions.payload.data();
            const did = actions.payload.id;
            return {did, ...data};
          }))
          .subscribe(res =>{
            this.form = res;
            this.helper.dismissLoading();
            this.setForm();
            this.api.getAnswerById(localStorage.getItem('pid'),this.formId)
              .subscribe(ress =>{
                this.flag = ress;
                if(this.form.oneTime){
                  this.helper.presentToast('You Already filled this form.');
                  this.router.navigate(['/dashboard/home']);
                }
                else if(this.flag.length> 0){
                  if( Date.now() - new Date(this.flag[0].time.toDate()).getTime() < 86400000){
                    this.helper.presentToast('Cannot Fill this form at the moment. Comeback later.');
                  this.router.navigate(['/dashboard/home']);
                  }
                  
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
    if(this.form.questions.length > 0){
      this.rate = new Array(this.form.questions.length);
      for(let i =0; i< this.form.questions.length; i++){
        this.rate[i] = { questionText: '', rating: 0};
      }
    }
  }
  setRate(item,i){
    this.rate[i].questionText = item;
  }

  SubmitForm(){
    if(this.checkForms()){
      let data = {
        uid: localStorage.getItem('pid'),
        answers: this.rate,
        comment: this.comment,
        formId: this.formId,
        time: new Date()
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
