import { DisputesService } from './../../../services/disputes.service';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LocalStorageService } from '../../../services/local-storage.service';
import { EditDisputePage } from '../edit-dispute/edit-dispute';
import { LoaderService } from '../../../services/loader-service';

@Component({
  selector: 'page-received-disputes',
  templateUrl: 'received-disputes.html',
})
export class ReceivedDisputesPage {

  public receivedData;
  public data:boolean;
  public userId:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,public disputesService:DisputesService,
  public localStorageService:LocalStorageService,public loaderService:LoaderService) {
    this.loaderService.startLoader("Loading");
    this.getData();
  }
  getData(){
    this.userId = this.localStorageService.get('userId');
    this.disputesService.getAllDisputes().subscribe(response=>{
      this.loaderService.stopLoader();
      if(response['disputes']['recivied'] && response['disputes']['recivied'].length>0){
        this.receivedData = response['disputes']['recivied'];
        this.data = true;
      }else{
        this.data = false;
      }

    });
  }
  editDispute(id:any){
    this.navCtrl.push(EditDisputePage,{id:id});
  }

}
