import { NotificationService } from './../../services/notification.service';
import { UserService } from './../../services/user.service';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SentRequestsPage } from '../../pages/sent-requests/sent-requests';
import { ReceivedRequestsPage } from '../../pages/received-requests/received-requests';
import { CreateRequestPage } from '../../pages/create-request/create-request';
@Component({
  selector: 'page-requests',
  templateUrl: 'requests.html',
})
export class RequestsPage {

  tab1Root = SentRequestsPage;
  tab2Root = ReceivedRequestsPage;
  tab3Root = CreateRequestPage;
  
  constructor(public navCtrl: NavController, public navParams: NavParams,
  public userService:UserService,public notificationService:NotificationService) {
    this.notificationService.getAllNotifications().subscribe(res=>{});    
  }

  ionViewDidLoad() {
  }

}
