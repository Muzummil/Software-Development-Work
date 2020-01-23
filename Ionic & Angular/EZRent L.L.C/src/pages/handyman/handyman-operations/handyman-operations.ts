import { LoaderService } from './../../../services/loader-service';
import { NotificationService } from './../../../services/notification.service';
import { HandymanPage } from './../../handyman/handyman';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HandymanService } from '../../../services/handyman.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { PopupService } from '../../../services/popup.service';

@Component({
  selector: 'page-handyman-operations',
  templateUrl: 'handyman-operations.html',
})
export class HandymanOperationsPage {
  public updateData:any;
  public apartments:any;
  public update:boolean=false;
  public onRequestSetupForm: FormGroup;
  public skills = [
    {
      name: 'Trim',
    },
    {
      name: 'Roofing',
    },
    {
      name: 'Machines',
    },
    {
      name: 'Plumbing',
    },
    {
      name: 'Iron Work',
    },
    {
      name: 'Power Tools',
    },
    {
      name: 'Demolition',
    },
    {
      name: 'Electrical',
    },
    {
      name: 'Maintenance',
    },
    {
      name: 'Construction',
    },
    {
      name: 'Pipe Fitting',
    },
    {
      name: 'Refrigeration',
    },
    {
      name: 'Heavy Equipment Operation',
    },
    {
      name: 'other',
    },
    
  ]
  constructor(public navCtrl: NavController, public navParams: NavParams,public notificationService:NotificationService,
  public handymanService:HandymanService,private _fb: FormBuilder,public userService:UserService,public loaderService:LoaderService,
  public popup:PopupService) {
    this.onRequestSetupForm = this._fb.group({
      name: ['', Validators.compose([
        Validators.required
      ])],
      contact: ['', Validators.compose([
        Validators.required
      ])],
      location: ['', Validators.compose([
        Validators.required
      ])],
      apartment: ['', Validators.compose([
        Validators.required
      ])],
      skills: ['', Validators.compose([
        Validators.required
      ])],

    });
    this.getApartments();
    if(this.navParams.get('data') && this.navParams.get('data')!=null){
      this.updateData = this.navParams.get('data');
      this.update = true;
    }else{
      this.updateData = null;
      this.update = false;
    }
  }
  getApartments(){
    this.handymanService.getAllApartments().subscribe(response=>{
      if(response['apartments'] && response['apartments'].length>0){
        this.apartments = response['apartments'];
      }else{
        alert("No apartment found");
      }
    })
  }
  handymanAction(selection:any){
    if(this.onRequestSetupForm.valid){
      if(selection=="add"){
        this.loaderService.startLoader("working");
        this.handymanService.createHandyman(this.onRequestSetupForm.value).subscribe(response=>{
          this.loaderService.stopLoader();
          if(response['message_success']){
            this.notificationService.getAllNotifications().subscribe(res=>{});
            this.popup.showAlert("success",response['message_success']);
            this.navCtrl.setRoot(HandymanPage);
          }else{
            alert("error occurred please try again");
          }
        })
      }else{
        this.loaderService.startLoader("Loading reminders");
        this.handymanService.updateHandyman(this.onRequestSetupForm.value,this.updateData['id']).subscribe(response=>{
          this.loaderService.stopLoader();
          if(response['message_success']){
            this.notificationService.getAllNotifications().subscribe(res=>{});
            this.popup.showAlert("success",response['message_success']);
            this.navCtrl.setRoot(HandymanPage);
          }else{
            alert("error occurred please try again");
          }
        })
      }
    }
  }
  ionViewDidLoad() {
    
  }

}
