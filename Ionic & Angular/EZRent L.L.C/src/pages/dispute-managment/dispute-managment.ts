import { ReceivedDisputesPage } from './received-disputes/received-disputes';
import { CreateDisputePage } from './create-dispute/create-dispute';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SentDisputesPage } from './sent-disputes/sent-disputes';
import { UserService } from '../../services/user.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'page-dispute-managment',
  templateUrl: 'dispute-managment.html',
})
export class DisputeManagmentPage {
  tab1Root = SentDisputesPage;
  tab2Root = ReceivedDisputesPage;
  tab3Root = CreateDisputePage;
  constructor(public navCtrl: NavController, public navParams: NavParams,public userService:UserService,
  public notificationService:NotificationService) {
    this.notificationService.getAllNotifications().subscribe(res=>{});
  }

  ionViewDidLoad() {
  }

}
