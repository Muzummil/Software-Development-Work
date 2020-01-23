import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { RequestsService } from '../../services/requests.service';
import { LoaderService } from '../../services/loader-service';

@Component({
  selector: 'page-request-details',
  templateUrl: 'request-details.html',
})
export class RequestDetailsPage {
  public data;
  public id;
  constructor(public navCtrl: NavController, public navParams: NavParams,
  public requestsService:RequestsService,public loaderService:LoaderService) {
    this.loaderService.startLoader("Loading");
    this.loadData();
  }
  loadData(){
    this.id = this.navParams.get('id');
    this.requestsService.getSpecificRequest(this.id).subscribe(response=>{
      this.loaderService.stopLoader();
      this.data = response['request'];
    })
  }

  ionViewDidLoad() {
  }

}
