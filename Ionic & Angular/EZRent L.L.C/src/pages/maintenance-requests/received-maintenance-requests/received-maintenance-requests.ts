import { DetailedMaintenanceRequestsPage } from './../detailed-maintenance-requests/detailed-maintenance-requests';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { RequestsService } from '../../../services/requests.service';
import { LocalStorageService } from '../../../services/local-storage.service';

@Component({
  selector: 'page-received-maintenance-requests',
  templateUrl: 'received-maintenance-requests.html',
})
export class ReceivedMaintenanceRequestsPage {

  public receivedData;
  public data:boolean;
  public userId:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,public requestsService:RequestsService,
  public localStorageService:LocalStorageService) {
  this.getData();
  }
  getData(){
    this.userId = this.localStorageService.get('userId');
    this.requestsService.getAllMaintenanceRequests().subscribe(response=>{
      if(response['maintenance_requests']['recieved'] && response['maintenance_requests']['recieved'].length>0){
        this.receivedData = response['maintenance_requests']['recieved'];
        this.data = true;
      }else{
        this.data = false;
      }

    });
  }
  viewDetails(id:any){
    this.navCtrl.push(DetailedMaintenanceRequestsPage,{id:id});
  }
  ionViewDidLoad() {
  }

}
