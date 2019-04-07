import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { QrcodeHomePage } from './qrcode-home.page';
import { NgQrScannerModule } from 'angular2-qrscanner';

const routes: Routes = [
  {
    path: '',
    component: QrcodeHomePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgQrScannerModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [QrcodeHomePage]
})
export class QrcodeHomePageModule {}
