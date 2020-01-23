import { NotificationService } from './../../services/notification.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NavController, Platform, ActionSheetController, AlertController } from 'ionic-angular';
import { AppState } from "../../reducers";
import { Store } from "@ngrx/store";
import { Storage } from "@ionic/storage";
import { BuildingActions } from "../../actions";
import { PaymentsAccountPage } from '../payments-account/payments-account';
import { DwollaService } from '../../services/dwolla.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { AccountAssociationPage } from '../account-association/account-association';
import { LoaderService } from '../../services/loader-service';
import { UpdatePaymentPage } from '../update-payment/update-payment';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'page-payments',
  templateUrl: 'payments.html'
})
export class PaymentsPage implements OnInit {

  skip() {
    this.nav.push(PaymentsAccountPage);
  }


  public event = {
    month: '1990-02-19',
    timeStarts: '07:43',
    timeEnds: '1990-02-20'
  }

  public onPropertySetupForm: FormGroup;
  public buildingData: any;
  addBuilding$: any;
  addressMessage: any;
  cityMessage: any;
  nameMessage: any;
  no_of_apartmentsMessage: any;
  stateMessage: any;
  zip_codeMessage: any;
  formatMessage: any;
  userRole: any;
  hasAccount:boolean;
  accountDetails:any;

  constructor(
    public storage: Storage,
    private _fb: FormBuilder,
    public alertCtrl: AlertController,
    private store: Store<AppState>,
    public nav: NavController,
    public platform: Platform,
    private buildingActions: BuildingActions,
    public actionsheetCtrl: ActionSheetController,
    public dwollaService: DwollaService,
    public loader:LoaderService,
    public userService:UserService,
    public notificationService:NotificationService,
    public localStorageService: LocalStorageService
  ) {
    this.userRole = this.localStorageService.get("roleID");
    this.loader.startLoader("Loading Payment Data");
    this.notificationService.getAllNotifications().subscribe(res=>{});    
  }
  openMenu() {
    let actionSheet = this.actionsheetCtrl.create({
      title: 'Apartment Numbering Format',
      cssClass: 'myaction',
      buttons: [
        {
          text: '<ion-item><ion-label>Go</ion-label><ion-radio checked="true" value="go"></ion-radio></ion-item><ion-item><ion-label>Rust</ion-label><ion-radio value="rust"></ion-radio></ion-item>',
          role: 'destructive',
          icon: !this.platform.is('ios') ? 'trash' : null,
          handler: () => {
          }
        },
        {
          text: 'Save',
          role: 'Save', // will always sort to be on the bottom
          icon: !this.platform.is('ios') ? 'close' : null,
          handler: () => {
          }
        }
      ]
    });
    actionSheet.present();
  }


  ngOnInit() {
    this.userRole = this.localStorageService.get("roleID");
    this.loader.stopLoader();
    this.dwollaService.dwollaCheckAccount().subscribe(response => {
      if(this.userRole == "3"){
        if (response['message_alert']) {
          this.hasAccount = false;
          let alert = this.alertCtrl.create({
            title: 'You did not have bank account',
            message: 'Do you want to create Bank Account?',
            buttons: [
              {
                text: 'No',
                role: 'cancel',
                handler: () => {
                }
              },
              {
                text: 'Yes',
                handler: () => {
                  this.nav.push(PaymentsAccountPage);
                  
                }
              }
            ]
          });
          alert.present();
        }else{
          this.hasAccount = true;
          this.accountDetails = response['dwoll_account'];
          if(response['dwoll_account'][0]['dwolla_funding_source']!=null){
          }else{
            let alert = this.alertCtrl.create({
              title: 'You have not associated funding source',
              message: 'Do you want to associate funding source?',
              buttons: [
                {
                  text: 'No',
                  role: 'cancel',
                  handler: () => {
                  }
                },
                {
                  text: 'Yes',
                  handler: () => {
                    this.nav.push(AccountAssociationPage);
                    
                  }
                }
              ]
            });
            alert.present();
          }
        }
      } else if(this.userRole == "4"){
        if (response['message_alert']) {
          this.hasAccount = false;
          let alert = this.alertCtrl.create({
            title: 'You did not have bank account',
            message: 'Do you want to create Bank Account?',
            buttons: [
              {
                text: 'No',
                role: 'cancel',
                handler: () => {
                }
              },
              {
                text: 'Yes',
                handler: () => {
                  this.nav.push(PaymentsAccountPage);
                  
                }
              }
            ]
          });
          alert.present();
          // this.nav.push(PaymentsAccountPage);
        }else{
          this.hasAccount = true;
          this.accountDetails =  response['dwoll_account'];
          if(response['dwoll_account'][0]['dwolla_funding_source']!=null){
            this.dwollaService.dwollaGetIavToken().subscribe(response=>{
            })
          }else{
            let alert = this.alertCtrl.create({
              title: 'You have not associated funding source',
              message: 'Do you want to associate funding source/Bank Account?',
              buttons: [
                {
                  text: 'No',
                  role: 'cancel',
                  handler: () => {
                  }
                },
                {
                  text: 'Yes',
                  handler: () => {
                    this.nav.push(AccountAssociationPage);
                    
                  }
                }
              ]
            });
            alert.present();
          }
        }
      }
     
    })

    this.onPropertySetupForm = this._fb.group({
      BuildingName: ['', Validators.compose([
        Validators.required
      ])],
      Address: ['', Validators.compose([
        Validators.required
      ])],
      City: ['', Validators.compose([
        Validators.required
      ])],
      State: ['', Validators.compose([
        Validators.required
      ])],
      Entercode: ['', Validators.compose([
        Validators.required
      ])],
      Noapartments: ['', Validators.compose([
        Validators.required
      ])],
      formatApartments: ['', Validators.compose([
        Validators.required
      ])]
    });

    this.addBuilding$ = this.store.select("buildings").subscribe((data: any) => {

    });
  }

  PropertyInfo() {
    this.store.dispatch(
      this.buildingActions.addBuilding({
        data: this.onPropertySetupForm.value,
      })
    );
  }
  updateAccount(){
    this.nav.push(UpdatePaymentPage,{'data':this.accountDetails});
  }
}
