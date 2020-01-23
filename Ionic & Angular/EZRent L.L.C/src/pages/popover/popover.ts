import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { LandloardBuildingPage } from '../landloard-building/landloard-building';
import { AppartmentSetupPage } from '../apartment-setup/apartment-setup';
import { AppartementService } from '../../services/appartement.service';
import { HomePage } from '../home/home';
import { PropertySetupPage } from '../property-setup/property-setup';
import { InviteTenantPage } from '../invite-tenant/invite-tenant';

@Component({
  selector: 'page-popover',
  templateUrl: 'popover.html',
})
export class PopoverPage {
  public buildingId:any;
  public appartmentID:any;
  public formatAppartment:any;
  public previewPage:boolean=false;
  public tenantPage:boolean=false;
  constructor(public navCtrl: NavController, public navParams: NavParams,public alertCtrl:AlertController,
  public appartementService:AppartementService,) {
    if(this.navParams.get("itself")){
      this.previewPage = true;
      this.tenantPage = false;
      this.formatAppartment = this.navParams.get("formatAppartment");
      this.buildingId = this.navParams.get("buildingId");
      console.log(this.navParams.data);
    }else if(this.navParams.get("tennat")){
      this.tenantPage = true;
      this.previewPage = false;
      this.appartmentID = this.navParams.get("appartmentID");
      console.log(this.appartmentID);
    }
  }
  addProperty(){
    this.navCtrl.push(LandloardBuildingPage);
  }
  editProfile(){

  }
  addTenant(){
    this.navCtrl.push(InviteTenantPage, { appartmentID:this.appartmentID});    
  }
  editProperty(){
    this.navCtrl.push(PropertySetupPage);
  }
  addAppartment(){
    this.navCtrl.push(AppartmentSetupPage, { formatAppartment: this.formatAppartment });
  }
  editApartment(){

  }
  delApartment(){
    let alert = this.alertCtrl.create({
      title: 'Confirm Leave',
      message: 'Are you sure you want to permanently delete this apartment from this property?',
      buttons: [
        {
          text: 'No',
          handler: () => {

          }
        },
        {
          text: 'Yes',
          role: 'Yes',
          handler: () => {
            this.appartementService.delappartment(this.appartmentID).subscribe(res => {
              if (res.message_success) {
                this.navCtrl.setRoot(HomePage);
              }
            })
          }
        }
      ]
    });
    alert.present();
  }
  delBuilding() {
    let alert = this.alertCtrl.create({
      title: 'Confirm Leave',
      message: 'Are you sure you want to permanently delete this building from your portfolio?',
      buttons: [
        {
          text: 'No',
          handler: () => {

          }
        },
        {
          text: 'Yes',
          role: 'Yes',
          handler: () => {
            this.appartementService.delBuilding(this.buildingId).subscribe(res => {
              if (res.message_success) {
                this.navCtrl.setRoot(HomePage);
              }
            });
          }
        }
      ]
    });
    alert.present();
  }
}
