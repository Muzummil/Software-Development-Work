import { NotificationService } from './../../services/notification.service';
import { ReceivedMaintenanceRequestsPage } from './received-maintenance-requests/received-maintenance-requests';
import { SentMaintenanceRequestsPage } from './sent-maintenance-requests/sent-maintenance-requests';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { CreateMaintenanceRequestPage } from './create-maintenance-request/create-maintenance-request';
import { UserService } from '../../services/user.service';
@Component({
  selector: 'page-maintenance-requests',
  templateUrl: 'maintenance-requests.html',
})
export class MaintenanceRequestsPage {
  tab1Root = SentMaintenanceRequestsPage;
  tab2Root = ReceivedMaintenanceRequestsPage;
  tab3Root = CreateMaintenanceRequestPage;
  constructor(public navCtrl: NavController, public navParams: NavParams,
  public notificationService:NotificationService,public userService:UserService) {
    this.notificationService.getAllNotifications().subscribe(res=>{});    
  }

  ionViewDidLoad() {
  }

}
