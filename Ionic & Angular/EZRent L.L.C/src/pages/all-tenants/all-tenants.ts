import { NotificationService } from './../../services/notification.service';
import { Component, OnInit } from "@angular/core";
import { NavController, MenuController } from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { TenantActions } from "../../actions";
import { AppState } from "../../reducers";
import { Store } from "@ngrx/store";
import { LoaderService } from '../../services/loader-service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'page-all-tenants',
  templateUrl: 'all-tenants.html'
})
export class AllTenantsPage implements OnInit {

  public tenants: any;
  public message: any;

  constructor(
    public storage: Storage,
    private store: Store<AppState>,
    public menuCtrl: MenuController,
    public nav: NavController,
    private tenantActions: TenantActions,
    public loader:LoaderService,
    public userService:UserService,
    public notificationService:NotificationService
  ) {
    this.loader.startLoader("Loading Tennats");
    menuCtrl.enable(true);
    this.store.dispatch(this.tenantActions.getAllTenant());
    this.loader.stopLoader();    
  }
  appartment$: any;

  ngOnInit() {
    this.notificationService.getAllNotifications().subscribe(res=>{});    
    this.store.select("tenant").subscribe((data: any) => {
      try {
        this.tenants = data.allTenant.tenants;
        if (data.allTenant.message_info) {
          this.message = data.allTenant.message_info;
        }
      } catch (error) {

      }
    });
  }



}
