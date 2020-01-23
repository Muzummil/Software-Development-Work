import { DetailedDisputesPage } from './../../detailed-disputes/detailed-disputes';
import { EditDisputePage } from './../edit-dispute/edit-dispute';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LocalStorageService } from '../../../services/local-storage.service';
import { LoaderService } from '../../../services/loader-service';
import { DisputesService } from '../../../services/disputes.service';

@Component({
  selector: 'page-sent-disputes',
  templateUrl: 'sent-disputes.html',
})
export class SentDisputesPage {

  public sentData;
  public data:boolean;
  public userId:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
  public disputesService:DisputesService,public localStorageService:LocalStorageService,
  public loaderService:LoaderService) {
    this.loaderService.startLoader("Loading");
    this.getData();
  }
  getData(){
    this.userId = this.localStorageService.get('userId');
    this.disputesService.getAllDisputes().subscribe(response=>{
      this.loaderService.stopLoader();
      if(response['disputes']['created'] && response['disputes']['created'].length>0){
        this.sentData = response['disputes']['created'];
        this.data = true;
      }else{
        this.data = false;
      }

    });
  }
  editRequest(data:any){
    this.navCtrl.push(EditDisputePage,{data:data});
  }
  deleteRequest(id:any){
    this.loaderService.startLoader("Deleting")
    this.disputesService.deleteDispute(id).subscribe(response=>{
      this.loaderService.stopLoader();
      if(response['message_success']){
        this.getData();
      }
    })
  }
  viewDetails(id:any){
    this.navCtrl.push(DetailedDisputesPage,{id:id});
  }

  ionViewDidLoad() {
  }

}
