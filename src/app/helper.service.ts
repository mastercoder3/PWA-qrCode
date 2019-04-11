import { Injectable } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  loading;

  constructor(public alertController: AlertController, public loadingController: LoadingController, public toastController: ToastController) { }

  async presentAlertPrompt(h,p,ok) {
    const alert = await this.alertController.create({
      header: h,
      inputs: [
        {
          name: 'data',
          type: 'text',
          placeholder: p
        }
      ],
      buttons: [ {
          text: 'Ok',
          handler: ok
        }
      ],
      backdropDismiss: false
    });

    await alert.present();
  }

  async presentLoading() {
     this.loading = await this.loadingController.create({
      message: 'Please Wait......'
    });
    await this.loading.present();

  }

  async dismissLoading(){
    await this.loading.dismiss();
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000,
      showCloseButton: true,
      position: 'top',
      closeButtonText: 'Done'
    });
    toast.present();
  }
}
