import { SentRequestsPage } from './../sent-requests/sent-requests';
import { RequestsService } from './../../services/requests.service';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TenantService } from '../../services/tenant.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { LoaderService } from '../../services/loader-service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { NotificationService } from '../../services/notification.service';
import { PopupService } from '../../services/popup.service';

@Component({
  selector: 'page-edit-request',
  templateUrl: 'edit-request.html',
})
export class EditRequestPage {
  public requestData:any;
  public onRequest: FormGroup;
  public data:any;
  public rollId;
  public userId:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,private _fb: FormBuilder,public loaderService:LoaderService,
  public tenantService:TenantService,public requestsService:RequestsService,public localStorageService:LocalStorageService,
  public userService:UserService,public notificationService:NotificationService,public popup:PopupService) {
      this.onStart();
  }
  public onStart(){
    this.onRequest = this._fb.group({
      User: ['', Validators.compose([
        Validators.required
      ])],
      Title: ['', Validators.compose([
        Validators.required
      ])],
      Description: ['', Validators.compose([
        Validators.required
      ])]
    });
    this.requestData = this.navParams.get('data');
    this.rollId = this.localStorageService.get('roleID');
    if(this.rollId==3){
      this.getAllTenants();
    }else if(this.rollId==4){
      this.getAllLandlords();
    }
  }
  getAllTenants(){
    this.tenantService.getAllTenant().subscribe(response=>{
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

  updateRequest(){
    if(this.onRequest.valid) {
      this.loaderService.startLoader("Updating requests");
      this.requestsService.updateRequest(this.onRequest.value,this.requestData['id']).subscribe(res=>{
        this.loaderService.stopLoader();
        if(res['message_success']){
          this.notificationService.getAllNotifications().subscribe(res=>{});
          this.popup.showAlert("success",res['message_success']);
          this.navCtrl.setRoot(SentRequestsPage);
          // this.backToReminder();
        }else{
          alert("Error occurred plese try again");
        }
      });
    }
    // else{
    //   alert("All fields are requiered");
    // }
  }
  ionViewDidLoad() {
  }

}
