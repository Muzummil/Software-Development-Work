import { DisputesService } from './../../services/disputes.service';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LoaderService } from '../../services/loader-service';
@Component({
  selector: 'page-detailed-disputes',
  templateUrl: 'detailed-disputes.html',
})
export class DetailedDisputesPage {

  public data;
  public id;
  constructor(public navCtrl: NavController, public navParams: NavParams,
  public disputesService:DisputesService,public loaderService:LoaderService) {
    this.loaderService.startLoader("Loading");
    this.loadData();
  }
  loadData(){
    this.id = this.navParams.get('id');
    this.disputesService.getSpecificDispute(this.id).subscribe(response=>{
      this.loaderService.stopLoader();
      this.data = response['dispute'];
    })
  }

  ionViewDidLoad() {
  }

}
