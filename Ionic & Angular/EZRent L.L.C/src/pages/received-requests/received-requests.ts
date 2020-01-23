import { RequestDetailsPage } from './../request-details/request-details';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { RequestsService } from '../../services/requests.service';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'page-received-requests',
  templateUrl: 'received-requests.html',
})
export class ReceivedRequestsPage {
  public receivedData;
  public data:boolean;
  public userId:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,public requestsService:RequestsService,
  public localStorageService:LocalStorageService) {
  this.getData();
  }
  getData(){
    this.userId = this.localStorageService.get('userId');
    this.requestsService.getAllRequests().subscribe(response=>{
      if(response['requests']['recieved'] && response['requests']['recieved'].length>0){
        this.receivedData = response['requests']['recieved'];
        this.data = true;
      }else{
        this.data = false;
      }

    });
  }
  viewDetails(id:any){
    this.navCtrl.push(RequestDetailsPage,{id:id});
  }
  ionViewDidLoad() {
  }

}
