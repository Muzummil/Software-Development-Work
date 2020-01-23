import { DetailedHandymanPage } from './detailed-handyman/detailed-handyman';
import { HandymanOperationsPage } from './handyman-operations/handyman-operations';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LocalStorageService } from '../../services/local-storage.service';
import { LoaderService } from '../../services/loader-service';
import { HandymanService } from '../../services/handyman.service';

@Component({
  selector: 'page-handyman',
  templateUrl: 'handyman.html',
})
export class HandymanPage {

  public sentData;
  public data:boolean;
  public userId:any;
  public handyman:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
  public localStorageService:LocalStorageService,public handymanService:HandymanService,
  public loaderService:LoaderService) {
    this.loaderService.startLoader("Loading");
    this.getData();
  }
  getData(){
    this.userId = this.localStorageService.get('userId');
    this.handymanService.getAllHandymans().subscribe(response=>{
      this.loaderService.stopLoader();
      if(response['handy_men'] && response['handy_men'].length>0){
        this.handyman = response['handy_men'];
        this.data = true;
      }else{
        this.data = false;
      }

    });
  }
  addHandyman(){
    this.navCtrl.push(HandymanOperationsPage);
  }
  editRequest(data:any){
    this.navCtrl.push(HandymanOperationsPage,{data:data});
  }
  deleteRequest(id:any){
    this.loaderService.startLoader("Deleting")
    this.handymanService.deleteHandyman(id).subscribe(response=>{
      this.loaderService.stopLoader();
      if(response['message_success']){
        this.getData();
      }
    })
  }
  viewDetails(id:any){
    this.navCtrl.push(DetailedHandymanPage,{id:id});
  }

  ionViewDidLoad() {
  }

}
