import { NotificationService } from './../../../services/notification.service';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LocalStorageService } from '../../../services/local-storage.service';
import { LoaderService } from '../../../services/loader-service';
import { RequestsService } from '../../../services/requests.service';
import { DetailedMaintenanceRequestsPage } from '../detailed-maintenance-requests/detailed-maintenance-requests';
import { EditMaintenanceRequestPage } from '../edit-maintenance-request/edit-maintenance-request';
@Component({
  selector: 'page-sent-maintenance-requests',
  templateUrl: 'sent-maintenance-requests.html',
})
export class SentMaintenanceRequestsPage {

  public sentData;
  public data:boolean;
  public userId:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
  public requestsService:RequestsService,public localStorageService:LocalStorageService,
  public loaderService:LoaderService,public notificationService:NotificationService) {
    this.loaderService.startLoader("Loading");
    this.getData();
  }
  getData(){
    this.notificationService.getAllNotifications().subscribe();    
    this.userId = this.localStorageService.get('userId');
    this.requestsService.getAllMaintenanceRequests().subscribe(response=>{
      this.loaderService.stopLoader();
      if(response['maintenance_requests']['sent'] && response['maintenance_requests']['sent'].length>0){
        this.sentData = response['maintenance_requests']['sent'];
        this.data = true;
      }else{
        this.data = false;
      }

    });
  }
  editRequest(data:any){
    this.navCtrl.push(EditMaintenanceRequestPage,{data:data});
  }
  deleteRequest(id:any){
    this.loaderService.startLoader("Deleting")
    this.requestsService.deleteMaintenanceRequest(id).subscribe(response=>{
      this.loaderService.stopLoader();
      if(response['message_success']){
        this.getData();
      }
    })
  }
  viewDetails(id:any){
    this.navCtrl.push(DetailedMaintenanceRequestsPage,{id:id});
  }

  ionViewDidLoad() {
  }

}
