import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { RequestsService } from '../../../services/requests.service';
import { LoaderService } from '../../../services/loader-service';

@Component({
  selector: 'page-detailed-maintenance-requests',
  templateUrl: 'detailed-maintenance-requests.html',
})
export class DetailedMaintenanceRequestsPage {

  public data;
  public id;
  constructor(public navCtrl: NavController, public navParams: NavParams,
  public requestsService:RequestsService,public loaderService:LoaderService) {
    this.loaderService.startLoader("Loading");
    this.loadData();
  }
  loadData(){
    this.id = this.navParams.get('id');
    this.requestsService.getSpecificMaintenanceRequest(this.id).subscribe(response=>{
      this.loaderService.stopLoader();
      this.data = response['maintenance_request'];
    })
  }

  ionViewDidLoad() {
  }

}
