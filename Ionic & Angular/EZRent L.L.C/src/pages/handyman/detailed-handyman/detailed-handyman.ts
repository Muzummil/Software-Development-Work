import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LoaderService } from '../../../services/loader-service';
import { HandymanService } from '../../../services/handyman.service';

@Component({
  selector: 'page-detailed-handyman',
  templateUrl: 'detailed-handyman.html',
})
export class DetailedHandymanPage {

  public data;
  public id;
  constructor(public navCtrl: NavController, public navParams: NavParams,
  public handymanService:HandymanService,public loaderService:LoaderService) {
    this.loaderService.startLoader("Loading");
    this.loadData();
  }
  loadData(){
    this.id = this.navParams.get('id');
    this.handymanService.getSpecificHandyman(this.id).subscribe(response=>{
      this.loaderService.stopLoader();
      this.data = response['handy_man'];
    })
  }

  ionViewDidLoad() {
  }

}
