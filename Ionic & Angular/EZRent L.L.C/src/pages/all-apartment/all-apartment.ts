import { UserService } from './../../services/user.service';
import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';
import { AppState } from "../../reducers";
import { AppartementActions } from "../../actions";
import { Storage } from "@ionic/storage";
import { Store } from "@ngrx/store";
import { LoaderService } from '../../services/loader-service';
import { LocalStorageService } from '../../services/local-storage.service';
import { ApartmentTenantsPage } from '../apartment-tenants/apartment-tenants';
import { NotificationService } from '../../services/notification.service';
@Component({
  selector: 'page-all-apartment',
  templateUrl: 'all-apartment.html'
})
export class GetAllApartmentsPage {



  public apartments: any;
  public buildings$: any;
  public message: any;
  public apartmentsData: any;
  public user$: any;
  public user: any;
  public userRole: any;
  public userID: any;
  public bId:any;

  constructor(
    public storage: Storage,
    public nav: NavController,
    private store: Store<AppState>,
    public menuCtrl: MenuController,
    public userService:UserService,
    public notificationService:NotificationService,
    public loaderService:LoaderService,
    private appartementActions: AppartementActions,
    public localStorageService: LocalStorageService
  ) {

    this.storage.get('roleID').then(val => {
      this.userRole = val;
    });
    menuCtrl.enable(true);
    menuCtrl.isAnimating();
  }

  ngOnInit() {
    this.notificationService.getAllNotifications().subscribe(res=>{});    
    this.loaderService.startLoader("Loading Apartments");
    this.store.dispatch(this.appartementActions.getAllAppartement());
  }
  appartmentTenants(e:any) {
    this.nav.push(ApartmentTenantsPage, { appartmentID: e });
  }

  ionViewDidLoad() {
    this.loaderService.stopLoader();
    this.buildings$ = this.store.select("appartement").subscribe((data: any) => {
      try {
        this.apartmentsData = data.appartements;
        this.apartments = this.apartmentsData.apartments;
      } catch (error) {
      }
    });
  }
}
