import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { NotificationService } from '../../../services/notification.service';
import { LoaderService } from '../../../services/loader-service';

@Component({
  selector: 'page-detailed-notifications',
  templateUrl: 'detailed-notifications.html',
})
export class DetailedNotificationsPage {
  public data:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
  public notificationService:NotificationService,public loaderService:LoaderService) {
    this.loaderService.startLoader("Loading");
    this.getDetails();
  }
  getDetails(){
    let id = this.navParams.get('id');
    this.notificationService.readNotification(id).subscribe(response=>{
      this.loaderService.stopLoader();      
      this.data = response['notification'];
      this.notificationService.getAllNotifications().subscribe();
    })
  }
  ionViewDidLoad() {
  }

}
