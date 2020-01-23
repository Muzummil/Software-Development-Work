import { NotificationService } from './../../services/notification.service';
import { UserService } from './../../services/user.service';
import { Component } from '@angular/core';
import { NavController, NavParams,AlertController } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { DwollaService } from '../../services/dwolla.service';
import * as dwolla from 'dwolla/dwolla.js';
declare var dwolla: any;

@Component({
  selector: 'page-account-association',
  templateUrl: 'account-association.html',
})
export class AccountAssociationPage {
  public onAccountAssociationForm: FormGroup;
  public associationData: any;
  addBank:boolean = false;
  finalRes:boolean=false;
  associationPortion:boolean = true;
  
  iavToken:any;
  // dwolla:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private _fb: FormBuilder,public dwollaService:DwollaService,
    private alertCtrl:AlertController,
    // ,public dwolla:Dwolla
    public userService:UserService,
    public notificationService:NotificationService
    ){
    this.notificationService.getAllNotifications().subscribe(res=>{});      
    this.onAccountAssociationForm = this._fb.group({
      AccountName: ['', Validators.compose([
        Validators.required
      ])],
      AccountNumber: ['', Validators.compose([
        Validators.required
      ])],
      RoutingNumber: ['', Validators.compose([
        Validators.required
      ])],
      AccountType: ['', Validators.compose([
        Validators.required
      ])],
    });
  }

  ionViewDidLoad() {
    this.associationPortion = true;
    this.getToken();
  }
  AccountAssociation(){
    this.associationData = this.onAccountAssociationForm.value;
    this.dwollaService.dwollaFunding(this.associationData).subscribe(response=>{
      if(response['Funding Source']){
        let alert = this.alertCtrl.create({
          title: 'Associated Successfuly',
          message: 'Do you want to add bank?',
          buttons: [
            {
              text: 'No',
              role: 'cancel',
              handler: () => {
                this.addBank = false;
                this.associationPortion = true;
              }
            },
            {
              text: 'Yes',
              handler: () => {
                this.addBank = true;
                this.associationPortion = false;
                this.getToken();
              }
            }
          ]
        });
        alert.present();
      }else{
        this.addBank = false;
        let alert = this.alertCtrl.create({
          title: 'Error occurred',
          message: 'Please Try Again',
          buttons: [
            {
              text: 'OK',
              handler: () => {
  
              }
            }
          ]
        });
        alert.present();
      }
    })

  }
  skip(){
    this.finalRes = true;
    this.addBank = true;
    this.finalRes = true;
    this.associationPortion = false;
  }
  backToAssociation(){
    this.finalRes = false;
    this.associationPortion = true;
  }
  getToken(){
    this.dwollaService.dwollaGetIavToken().subscribe(response=>{
       this.iavToken = response;
    })
  }
  script(){
      this.addBank = true;
      dwolla.configure('sandbox');
      dwolla.iav.start(this.iavToken, {
      container: 'iavContainer',
      stylesheets: [
        'http://fonts.googleapis.com/css?family=Lato&subset=latin,latin-ext',
        'http://myapp.com/iav/someStylesheet.css'
      ],
      microDeposits: false,
      fallbackToMicroDeposits: false
    }, function(err, res) {
      console.log('Error: ' + JSON.stringify(err) + ' -- Response: ' + JSON.stringify(res));
    });
  }
  start(){
    
  }
}
