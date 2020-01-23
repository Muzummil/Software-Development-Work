import { Component } from "@angular/core";
import { NavController, NavParams, MenuController, ModalController, PopoverController, AlertController } from "ionic-angular";
import { Store } from "@ngrx/store";
import { AppState } from "../../reducers";
import { BuildingActions } from "../../actions";
import { Storage } from "@ionic/storage";
import { InviteTenantPage } from '../invite-tenant/invite-tenant';
import { UserDetailsPage } from '../user-details/user-details';
import { ApartmentTenantsPage } from '../apartment-tenants/apartment-tenants';
import { LocalStorageService } from '../../services/local-storage.service';

import { LoaderService } from '../../services/loader-service';
import { PopoverPage } from "../popover/popover";

@Component({
  selector: 'page-appartmentPreview',
  templateUrl: 'appartmentPreview.html'
})

export class AppartmentPreviewPage {

  public buildings: any;
  public formatAppartment: any;
  public buildings$: any;
  public buildingsID: any;
  public buildingsID$: any;
  public message: any;
  buildingID: any;
  public userRole: any;
  public price: any;
  public id: any;
  public buildingName:string;
  public preview:boolean=false;

  constructor(
    public storage: Storage,
    public nav: NavController,
    private store: Store<AppState>,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    public modalCtrl: ModalController,
    public popoverCtrl: PopoverController,
    private buildingActions: BuildingActions,
    public loaderService:LoaderService,
    private localStorageService:LocalStorageService
  ) {
    this.userRole = this.localStorageService.get("roleID");
    this.buildingName = this.localStorageService.get("buildingName");
    menuCtrl.enable(true);
    menuCtrl.isAnimating();
    storage.get('buildingID').then((val) => {
      this.loaderService.startLoader("Loading Data");
      this.store.dispatch(this.buildingActions.getBuildingById(val));
      this.loaderService.stopLoader();
    });
    this.buildingsID$ = this.store.select("buildings").subscribe((data: any) => {
      try {
        this.buildingsID = data.buildingID.building[0].apartments;
        this.id = data.buildingID.building[0].id;
        this.formatAppartment = data.buildingID.building[0].apart_no_format;
        if (this.buildingsID.length == 0) {
          this.message = true;
        } else {
          this.message = false;
        }

      } catch (error) {
      }
    });
  }
  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopoverPage,{itself:true,formatAppartment:this.formatAppartment,buildingId:this.id});
    popover.present({
      ev: myEvent
    });
  }
  appartmentDetails(e) {
    this.storage.set("tenantPropertyID", e);
    this.nav.push(UserDetailsPage, { userDetails: e });
  }
  appartmentTenants(e) {
    this.nav.push(ApartmentTenantsPage, { appartmentID: e });
  }
  addTanent(idAppartment) {
    this.storage.set("appartmentID", idAppartment);
    this.nav.setRoot(InviteTenantPage);
  }
}
