// import { SearchFilterPipe } from '../search-filter.pipe';
import { Component, OnInit } from "@angular/core";
import { NavController, NavParams, MenuController, ModalController, PopoverController, } from "ionic-angular";
import { Store } from "@ngrx/store";
import { AppState } from "../../reducers";
import { BuildingActions } from "../../actions";
import { Storage } from "@ionic/storage";
import { AuthActions } from "../../actions";
import { AppartmentPreviewPage } from '../appartmentPreview.ts/appartmentPreview';
import { TenantSuccessPage } from '../tenant-success/tenant-success';
import { LocalStorageService } from '../../services/local-storage.service';
import { NotificationService } from "../../services/notification.service";
import { UserService } from "../../services/user.service";
// import { LoaderService } from '../../services/loader-service';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Facebook } from '@ionic-native/facebook';
import { LoginPage } from "../login/login";
import { PopoverPage } from "../popover/popover";
import { TenantInvitationService } from "../../services/tenant-invitation.service";
import { LoaderService } from "../../services/loader-service";
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage implements OnInit {

  public buildings: any;
  public defaultBuildings: any;
  public buildings$: any;
  public buildingsID: any;
  public buildingsID$: any;
  public message: any;
  public user$: any;
  public user: any;
  public userRole: any;
  public userID: any;
  public name:string;
  public searchText:any;
  public varificationCode:any;
  public buildingSearchFlag:boolean=true;

  constructor(
    public storage: Storage,
    public nav: NavController,
    public facebook: Facebook, 
    private store: Store<AppState>,
    public navParams: NavParams,
    public authActions: AuthActions,
    public userService:UserService,
    public menuCtrl: MenuController,
    public modalCtrl: ModalController,
    public popoverCtrl: PopoverController,
    public localStorageService:LocalStorageService,
    public notificationService:NotificationService,
    private buildingActions: BuildingActions,
    public tenantInvitationService:TenantInvitationService,
    public loaderService:LoaderService,
    public localNotifications:LocalNotifications
  ) {
    this.name = this.localStorageService.get("name");
    // this.localStorageService.userUpdate.subscribe(response=>{
    //   if(response=="update"){
    //     // window.location.reload();
    //   }
    // });
    // this.storage.get('roleID').then(val => {
    //   this.userRole = val;
    // });
    this.userRole = this.localStorageService.get("roleID");
    menuCtrl.enable(true);
    menuCtrl.isAnimating();
    this.onNotification();
  }
  async onNotification(){
    // this.localNotifications.isTriggered(1).then(res=>{
    //   alert(res);
    // })
    // this.localNotifications.get(122).then(res=>{
    //   alert(res);
    //   alert(res.data);
    // })
    // this.localNotifications.isPresent(122).then(val=>{
    //   alert("present");      
    //   alert(val);
    //   if(val){
    //     // this.clearData();
    //   }
    // });
    this.localNotifications.on("click").subscribe(val=>{
      if(val){
        this.clearData();
      }
    });
    this.localNotifications.on("trigger").subscribe(val=>{
      if(val){
        this.clearData();
      }
    });
    this.localNotifications.on("clear").subscribe(val=>{
      if(val){
        this.clearData();
      }
    });
    this.localNotifications.on("clearall").subscribe(val=>{
      if(val){
        this.clearData();
      }
    });
    
    // this.localNotifications.isTriggered(1).subscribe(res=>{
    //   alert(res);
    //   // this.clearData();
    // })
  }
  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopoverPage);
    popover.present({
      ev: myEvent
    });
  }
  clearData(){
    this.userService.logoutUser.subscribe();
    this.facebook.logout();
    this.store.dispatch(this.authActions.clearLogin());
    this.store.dispatch(this.authActions.logout());
    this.storage.remove("auth_token");
    this.storage.remove("user");
    this.localStorageService.clear();
    this.localStorageService.set("setLogout",false);
    this.nav.setRoot(LoginPage);
    window.location.reload();
  }
  ngOnInit() {
    this.userRole = this.localStorageService.get("roleID");    
    // this.loaderService.startLoader("Loading Data");
    this.store.dispatch(this.buildingActions.getAllBuildings());
    this.notificationService.getAllNotifications().subscribe(res=>{});
  }
  apartmentPreview(data) {
    this.localStorageService.set("buildingID",data.id);
    this.localStorageService.set("buildingName",data.name);
    this.storage.set("buildingID", data.id);
    this.nav.push(AppartmentPreviewPage);
  }
  checkInvitation() {
    this.nav.setRoot(TenantSuccessPage);
  }
  onVerify() {
    console.log(this.varificationCode);
    if(this.varificationCode.length>0  && this.varificationCode!='' && this.varificationCode!=undefined){
      this.loaderService.startLoader("verifying");
      this.tenantInvitationService.verifyInvitaion(this.varificationCode).subscribe(response=>{
        if (response['message_success']) {
          this.ngOnInit();
          this.loaderService.stopLoader();        
        } else if (response['message_danger']) {
          this.loaderService.stopLoader();                  
          alert("Invalid code please try with a valid one");
        }
      })
    }else{
      alert("Enter code first");
    }
    // this.store.dispatch(
    //   this.invitationActions.verifyInvitaion({
    //     code_number: this.onVerifyCode.value.Number
    //   })
    // );
  }
  
  ionViewDidLoad() {
    // this.loaderService.stopLoader();
    this.buildings$ = this.store.select("buildings").subscribe((data: any) => {
      try {
        this.buildings = data.building.buildings;
        this.defaultBuildings = data;
        if (this.buildings.length == 0) {
          this.message = true;
        } if (data.building.message_alert) {
          this.message = true;
        } else {
          this.message = false;
        }
      } catch (error) {
      }
    });
  }
}
