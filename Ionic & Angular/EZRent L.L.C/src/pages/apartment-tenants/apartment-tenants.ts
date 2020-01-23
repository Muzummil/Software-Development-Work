import { Component, OnInit } from "@angular/core";
import { NavController, MenuController, NavParams, PopoverController } from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { InviteTenantPage } from '../invite-tenant/invite-tenant';
import { TenantActions } from "../../actions";
import { AppState } from "../../reducers";
import { Store } from "@ngrx/store";
import { PopoverPage } from '../popover/popover';

@Component({
  selector: 'page-apartment-tenants',
  templateUrl: 'apartment-tenants.html'
})
export class ApartmentTenantsPage implements OnInit {

  public tenants: any;
  public appartmentID: any;
  public message: any;
  public userRole: any;
  appartment$: any;
  constructor(
    public storage: Storage,
    private store: Store<AppState>,
    public menuCtrl: MenuController,
    public nav: NavController,
    public navParams: NavParams,
    private tenantActions: TenantActions,
    public popoverCtrl:PopoverController
  ) {
    this.message = " ";
    menuCtrl.enable(true);
    this.userRole = localStorage.getItem("roleID");
    this.appartmentID = navParams.get("appartmentID");
    this.store.dispatch(this.tenantActions.getAllTenantAppartmentID(this.appartmentID));
  }
  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopoverPage,{tennat:true,appartmentID: this.appartmentID});    
    popover.present({
      ev: myEvent
    });
  }
  ngOnInit() {
    this.store.select("tenant").subscribe((data: any) => {
      try {
        this.tenants = data.apartmentTenant.tenants;
        if (data.apartmentTenant.message_info) {
          this.message = data.apartmentTenant.message_info;
        }
      } catch (error) {

      }
    });
  }
  addTanent() {
    this.nav.setRoot(InviteTenantPage, { appartmentID: this.appartmentID });
  }

}
