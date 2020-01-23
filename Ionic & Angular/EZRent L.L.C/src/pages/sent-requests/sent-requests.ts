import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { RequestsService } from '../../services/requests.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { LoaderService } from '../../services/loader-service';
import { EditRequestPage } from '../../pages/edit-request/edit-request';
import { RequestDetailsPage } from '../request-details/request-details';
@Component({
  selector: 'page-sent-requests',
  templateUrl: 'sent-requests.html',
})
export class SentRequestsPage {
  public sentData;
  public data:boolean;
  public userId:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
  public requestsService:RequestsService,public localStorageService:LocalStorageService,
  public loaderService:LoaderService) {
    this.loaderService.startLoader("Loading");
    this.getData();
  }
  getData(){
    this.userId = this.localStorageService.get('userId');
    this.requestsService.getAllRequests().subscribe(response=>{
      this.loaderService.stopLoader();
      if(response['requests']['sent'] && response['requests']['sent'].length>0){
        this.sentData = response['requests']['sent'];
        this.data = true;
      }else{
        this.data = false;
      }

    });
  }
  editRequest(data:any){
    this.navCtrl.push(EditRequestPage,{data:data});
  }
  deleteRequest(id:any){
    this.loaderService.startLoader("Deleting")
    this.requestsService.deleteRequest(id).subscribe(response=>{
      this.loaderService.stopLoader();
      if(response['message_success']){
        this.getData();
      }
    })
  }
  viewDetails(id:any){
    this.navCtrl.push(RequestDetailsPage,{id:id});
  }
  ionViewDidLoad() {
  }

}
