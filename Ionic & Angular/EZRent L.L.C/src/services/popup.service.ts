import { Injectable } from '@angular/core';
import { AlertController,ToastController} from "ionic-angular";
import { Events } from 'ionic-angular';
@Injectable()

export class PopupService {

  public alert:any;
  public toast:any;
  constructor(public alertCtrl: AlertController,public toastCtrl: ToastController,
              public events:Events) {
  }
  public showAlert(title:string,message:string){
    this.alert = this.alertCtrl.create({
        title:title,
        message:message,
        buttons:[{
          text: 'Ok',
          handler: data => {
          }
        }]
      });
    this.alert.present();
  }
  public hideAlert(){
    this.alert.dismiss();
  }
  public showTokenExpiry(){
    this.alert = this.alertCtrl.create({
        title:'Token Expired',
        message:'Please login Again',
        buttons:[{
          text: 'Ok',
          handler: data => {
            this.logout();
          }
        }]
      });
    this.alert.present();
  }
  public hideTokenExpiry(){
    this.alert.dismiss();
  }
  logout() {
      localStorage.clear();
      this.hideTokenExpiry();
      this.events.publish('logout');
      // this.trigerLogout.next({});
      // this.trigerLogout.complete({});
      // this.navCtrl.push(LoginPage);
      // this.navCtrl.pop();
  }
  public showToast(message:string,time:number,position:string){
    this.toast = this.toastCtrl.create({
      message:message,
      duration:time,
      position:position,
      cssClass:'dark-trans',
      closeButtonText: 'OK',
      showCloseButton: true
    });
    this.toast.present();
  }
  public hideToast(){
  	this.toast.dismiss();
  }
}