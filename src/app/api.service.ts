import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private afs: AngularFirestore) { }

  createUser(id,data){
    return this.afs.doc('users/'+id).set(data);
  }

  // getFormInstance(cat,item){
  //   return this.afs.collection('form', ref => ref.where('categoryId','==',cat).where('itemId','==',item)).snapshotChanges();
  // }

  // getQuestions(){
  //   return this.afs.collection('questions').snapshotChanges();
  // }

  addToAnswer(data){
    return this.afs.collection('answer').add(data)
  }

  getForm(id){
    return this.afs.doc('form/'+id).snapshotChanges();
  }

  getAllForms(){
    return this.afs.collection('form').snapshotChanges();
  }

  getAnswerById(uid,fid){
    return this.afs.collection('answer', ref => ref.where('uid', '==', uid).where('formId','==',fid)).valueChanges();
  }


}
