import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { TenantService } from '../../services/tenant.service';
import { RemindersService } from '../../services/remider.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { RemindersPage } from '../reminders/reminders';
import { LoaderService } from '../../services/loader-service';
import { UserService } from '../../services/user.service';
import { NotificationService } from '../../services/notification.service';
import { PopupService } from '../../services/popup.service';

@Component({
  selector: 'page-edit-reminder',
  templateUrl: 'edit-reminder.html',
})
export class EditReminderPage {
  public reminderData:any;
  public onRemainder: FormGroup;
  public tenants:any;
  public userId:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,private _fb: FormBuilder,public loaderService:LoaderService,
  public tenantService:TenantService,public remindersService:RemindersService,public localStorageService:LocalStorageService,
  public userService:UserService,public notificationService:NotificationService,public popup:PopupService) {
    this.userId = this.localStorageService.get('userId');
    this.onRemainder = this._fb.group({
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
    this.reminderData = this.navParams.get('data');
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
    })
  }

  ionViewDidLoad() {
    
  }
  backToReminder(){
    this.navCtrl.setRoot(RemindersPage);
  }
  updateReminder(){
    if(this.onRemainder.valid) {
      this.loaderService.startLoader("Updating reminder");
      this.remindersService.updateReminder(this.onRemainder.value,this.reminderData['id']).subscribe(res=>{
        this.loaderService.stopLoader();
        if(res['message_success']){
          this.notificationService.getAllNotifications().subscribe(res=>{});
          this.popup.showAlert("success",res['message_success']);
          this.backToReminder();
        }else{
          alert("error occurred plese try again");
        }
      });
    }
    // else{
    //   alert("All fields are requiered");
    // }
  }

}
