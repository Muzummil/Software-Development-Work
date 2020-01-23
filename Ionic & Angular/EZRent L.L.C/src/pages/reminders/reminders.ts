import { PopupService } from './../../services/popup.service';
import { NotificationService } from './../../services/notification.service';
import { LoaderService } from './../../services/loader-service';
import { TenantService } from './../../services/tenant.service';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { RemindersService } from '../../services/remider.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { EditReminderPage } from '../edit-reminder/edit-reminder';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'page-reminders',
  templateUrl: 'reminders.html',
})
export class RemindersPage {
  public reminders:any;
  public data:boolean;
  public activeReminderButton:boolean=true;
  public userId:any;
  public tenants:any;
  public rollId:any;
  public detailData:any;
  public backButton:boolean=false;
  public backButtonForView:boolean=false;
  public addData:boolean=false;
  public viewDetailsPart:boolean=false;
  public onPropertySetupForm: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams,public popup:PopupService,
  public remindersService:RemindersService,public localStorageService:LocalStorageService,
  private _fb: FormBuilder,public tenantService:TenantService,public userService:UserService,
  public loaderService:LoaderService,public notificationService:NotificationService) {
    this.onPropertySetupForm = this._fb.group({
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

    this.loaderService.startLoader("Loading reminders");
    this.userId = this.localStorageService.get('userId');
    this.rollId = this.localStorageService.get('rollID');
    this.tenantService.getAllTenant().subscribe(response=>{
      try{
      if(response.tenants){
        if(response.tenants[0].length>0){
          this.tenants = response.tenants[0];
        }else{
          this.tenants = null;
        }
      }else{
        this.tenants = null;
      }
      
    }catch(e){}
    });
  }
  ionViewDidLoad() {
    this.getAllReminders();
  }
  getAllReminders(){
    this.notificationService.getAllNotifications().subscribe(res=>{});    
    this.remindersService.getReminders().subscribe(response=>{
      this.loaderService.stopLoader();
      if(response['reminders'] && response['reminders'].length>0){
        this.data = true;
        this.addData = false;
        this.reminders = response['reminders'];
      }else{
        this.data = false;
        this.addData = false;
      }
    })
  }
  activeReminder(){
    this.addData = true;
    this.data = false;
    this.activeReminderButton = false;
    this.viewDetailsPart = false;
    this.backButtonForView = false;
    this.backButton = true;
  }
  backToReminder(){
    this.loaderService.startLoader("Loading reminders");
    this.activeReminderButton = true;
    this.viewDetailsPart = false
    this.getAllReminders();
    this.backButtonForView = false;
  }
  viewDetails(id:any){
    this.data = false;
    this.activeReminderButton = false;
    this.backButtonForView = true;
    this.remindersService.getSpecificReminder(id).subscribe(response=>{
      this.detailData = response.reminder;
      this.viewDetailsPart = true;
      
      // this.loaderService.stopLoader();
      // if(response['reminders'] && response['reminders'].length>0){
      //   this.data = true;
      //   this.addData = false;
      //   this.reminders = response['reminders'];
      // }else{
      //   this.data = false;
      //   this.addData = false;
      // }
    })
  }
  editReminder(data:any){
    this.navCtrl.push(EditReminderPage,{data:data})
  }
  deleteReminder(id:any){
    this.loaderService.startLoader("Deleting")
    this.remindersService.deleteReminder(id).subscribe(response=>{
      this.loaderService.stopLoader();
      if(response['message_success']){
        this.getAllReminders();
      }
    })
  }
  addReminder(){
    if(this.onPropertySetupForm.valid){
      this.loaderService.startLoader("Creating reminder");      
      this.remindersService.createReminder(this.onPropertySetupForm.value).subscribe(response=>{
        this.loaderService.stopLoader();
        if(response['message_success']){
          this.notificationService.getAllNotifications().subscribe(res=>{});          
          this.popup.showAlert("success",response['message_success']);
          this.activeReminderButton = true;
          this.getAllReminders();
        }else{
          alert("Error occurred please try again");
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
