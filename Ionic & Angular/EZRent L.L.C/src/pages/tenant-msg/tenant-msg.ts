import { Component, OnInit } from "@angular/core";
import { NavController, NavParams } from 'ionic-angular';
import { HomePage } from "../home/home";
import { Storage } from "@ionic/storage";
import { InviteTenantPage } from '../invite-tenant/invite-tenant';

@Component({
  selector: 'page-tenant-msg',
  templateUrl: 'tenant-msg.html'
})
export class TenantMsgPage implements OnInit {
  public inviteNumber: any;
  public number: any;
  constructor(
    public storage: Storage,
    public navParams: NavParams,
    public nav: NavController) {

    this.number = navParams.get("phone_number");
  }

  ngOnInit() {
  }

  inviteMoreTenant() {
    this.nav.setRoot(InviteTenantPage);
  }

  homePage() {
    this.nav.setRoot(HomePage);
  }

}
