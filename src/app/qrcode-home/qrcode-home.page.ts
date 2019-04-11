import {Component, ViewChild, ViewEncapsulation, OnInit} from '@angular/core';
import {QrScannerComponent} from 'angular2-qrscanner';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-qrcode-home',
  templateUrl: './qrcode-home.page.html',
  styleUrls: ['./qrcode-home.page.scss'],
})
export class QrcodeHomePage implements OnInit {

    flag: Array<any>;
    index: number = 0;
    devices = 0;
    $ob: Subscription;

  constructor(private router: Router){}

  @ViewChild(QrScannerComponent) qrScannerComponent: QrScannerComponent ;
 
  ngOnInit() {
    setTimeout( () => {
        this.openQr();
    }, 1000);
  }

  openQr(){
    this.qrScannerComponent.getMediaDevices().then(devices => {
        const videoDevices: MediaDeviceInfo[] = [];
        for (const device of devices) {
            if (device.kind.toString() === 'videoinput') {
                videoDevices.push(device);
            }
        }
        if (videoDevices.length > 0){
            let choosenDev;
            this.devices = videoDevices.length;
            this.flag = videoDevices;
            for (let i = 0; i< videoDevices.length; i ++){
                if (videoDevices[i].label.includes('back')){
                    choosenDev = videoDevices[i];
                    this.index = i;
                    break;
                }
            }
            if (choosenDev) {
                this.qrScannerComponent.chooseCamera.next(choosenDev);
            } else {
                this.qrScannerComponent.chooseCamera.next(videoDevices[0]);
            }
        }
    });

   this.$ob =  this.qrScannerComponent.capturedQr.subscribe(result => {
        alert(result);
    });
  }

  switch(){
    if(this.index + 1 === this.flag.length){
      this.index = 0;
      this.qrScannerComponent.chooseCamera.next(this.flag[0]);
      this.$ob.unsubscribe();
    }
    else{
      this.index ++;
      this.qrScannerComponent.chooseCamera.next(this.flag[this.index]);
      this.$ob.unsubscribe();
    }
    this.$ob =  this.qrScannerComponent.capturedQr.subscribe(result => {
      alert(result);
  });
  }

}
