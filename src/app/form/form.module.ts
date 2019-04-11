import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FormPage } from './form.page';
import { BarRatingModule } from "ngx-bar-rating";

const routes: Routes = [
  {
    path: '',
    component: FormPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BarRatingModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FormPage]
})
export class FormPageModule {}
