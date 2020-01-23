import { NotificationService } from './../../../services/notification.service';
import { SentMaintenanceRequestsPage } from './../sent-maintenance-requests/sent-maintenance-requests';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { LoaderService } from './../../../services/loader-service';
import { RequestsService } from '../../../services/requests.service';
import { TenantService } from './../../../services/tenant.service';
import { LocalStorageService } from '../../../services/local-storage.service';
import { UserService } from '../../../services/user.service';
import { PopupService } from '../../../services/popup.service';

@Component({
  selector: 'page-create-maintenance-request',
  templateUrl: 'create-maintenance-request.html',
})
export class CreateMaintenanceRequestPage {

  public onRequestSetupForm: FormGroup;
  public tenants;
  public rollId;
  public data:any;
  public landLords;
  constructor(public navCtrl: NavController, public navParams: NavParams,private _fb: FormBuilder,public popup:PopupService,
  public loaderService:LoaderService,public requestsService:RequestsService,public tenantService:TenantService,
  public localStorageService:LocalStorageService,public userService:UserService,public notificationService:NotificationService) {
    this.loaderService.startLoader("Loading");
    this.onRequestSetupForm = this._fb.group({
      User: ['', Validators.compose([
        Validators.required
      ])],
      Title: ['', Validators.compose([
        Validators.required
      ])],
      Description: ['', Validators.compose([
        Validators.required
      ])],
    });
    this.rollId = this.localStorageService.get('roleID');
    if(this.rollId==3){
      this.getAllTenants();
    }else if(this.rollId==4){
      this.getAllLandlords();
    }
  }
  getAllTenants(){
    this.tenantService.getAllTenant().subscribe(response=>{
      this.loaderService.stopLoader();
      try{
      if(response.tenants){
        if(response.tenants[0].length>0){
          this.data = response.tenants[0];
        }else{
          this.data = null;
        }
      }else{
        this.data = null;
      }
    }catch(e){}
    });
  }
  getAllLandlords(){
    this.requestsService.getAllLandlords().subscribe(response=>{
      this.loaderService.stopLoader();
      try{
      if(response.landlords){
        if(response.landlords[0]){
          this.data = response.landlords;
        }else{
          this.data = null;
        }
      }else{
        this.data = null;
      }
    }catch(e){}
    });
  }
  ionViewDidLoad() {
  }
  addRequest(){
    if(this.onRequestSetupForm.valid){
      this.loaderService.startLoader("Creating request");      
      this.requestsService.createMaintenanceRequest(this.onRequestSetupForm.value).subscribe(response=>{
        this.loaderService.stopLoader();
        if(response['message_success']){
          this.notificationService.getAllNotifications().subscribe(res=>{});
          this.popup.showAlert("success",response['message_success']);
          this.navCtrl.setRoot(SentMaintenanceRequestsPage);
        }else{
          alert("error occurred please try again");
        }
      })
    }
    // else{
    //   alert("All fields are requiered");
    // }
    // this.store.select("tenant").subscribe((data: any) => {
    //   try {
    //     this.tenants = data.allTenant.tenants;
    //     if (data.allTenant.message_info) {
    //       // this.message = data.allTenant.message_info;
    //     }
    //   } catch (error) {

    //   }
    // });
    
  }

}
