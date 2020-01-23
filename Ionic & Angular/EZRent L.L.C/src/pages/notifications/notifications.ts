import { DetailedNotificationsPage } from './detailed-notifications/detailed-notifications';
import { UserService } from './../../services/user.service';
import { NotificationService } from './../../services/notification.service';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LoaderService } from '../../services/loader-service';

@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})
export class NotificationsPage {
  public tenancyError:boolean=false;
  public unReadCheck:boolean=false;
  public readCheck:boolean;
  public readNotifications:any;
  public unReadNotifications:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,public notificationService:NotificationService,
  public userService:UserService,public loaderService:LoaderService) {
    this.loaderService.startLoader("Loading");    
    this.getNotifications();
    this.loaderService.stopLoader();
  }
  getNotifications(){
    this.notificationService.getAllNotifications().subscribe(response=>{
      if(response['notifications'].read && response['notifications'].read.length>0){
        this.readNotifications = response['notifications'].read;
        this.readCheck = true;        
      }
      if(response['notifications'].unread && response['notifications'].unread.length>0){
        this.unReadCheck = true;
        this.unReadNotifications = response['notifications'].unread;
      }if(response['notifications'].unread.length<1 && response['notifications'].read.length<1){
        this.userService.checkTenancy().subscribe(response=>{
          if(!response){
            this.tenancyError = true;
            this.readCheck = false;      
            this.unReadCheck = false;
          }
        });
      }
    });
  }
  viewDetails(id:any){
    this.navCtrl.push(DetailedNotificationsPage,{id:id});
  }
  deleteReminder(id:any){
    this.loaderService.startLoader("Deleting");
    this.notificationService.deleteNotification(id).subscribe(response=>{
      this.loaderService.stopLoader();      
      if(response['message_success']){
        this.getNotifications();
      }
    })
  }
  ionViewDidLoad() {
  }

}
