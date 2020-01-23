import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NavController, Platform, ActionSheetController, AlertController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { AppState } from "../../reducers";
import { Store } from "@ngrx/store";
import { PaymentsBankPage } from '../payments-bank/payments-bank';
import { DwollaService } from '../../services/dwolla.service';
import { AccountAssociationPage } from '../account-association/account-association';
@Component({
  selector: 'page-payments-account',
  templateUrl: 'payments-account.html'
})
export class PaymentsAccountPage implements OnInit {

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

  constructor(
    private _fb: FormBuilder,
    public alertCtrl: AlertController,
    private store: Store<AppState>,
    public nav: NavController,
    public platform: Platform,
    public actionsheetCtrl: ActionSheetController,
    public dwollaService: DwollaService
  ) {

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


  // go to Appartment Setup page
  skip() {
    this.nav.push(PaymentsBankPage);
  }
  createAccount() {

  }

  ngOnInit() {
    this.onPropertySetupForm = this._fb.group({
      FirstName: ['', Validators.compose([
        Validators.required
      ])],
      LastName: ['', Validators.compose([
        Validators.required
      ])],
      Email: ['', Validators.compose([
        Validators.required
      ])],
      // Type: ['', Validators.compose([
      //   Validators.required
      // ])],
      // Address: ['', Validators.compose([
      //   Validators.required
      // ])],
    });

    this.addBuilding$ = this.store.select("buildings").subscribe((data: any) => {
      if (data.building.validation_errors) {
        this.buildingData = data.building.validation_errors;

        this.nameMessage = this.buildingData.name;
        this.addressMessage = this.buildingData.address;
        this.cityMessage = this.buildingData.city;
        this.stateMessage = this.buildingData.state;
        this.zip_codeMessage = this.buildingData.zip_code;
        this.no_of_apartmentsMessage = this.buildingData.no_of_apartments;
        this.formatMessage = this.buildingData.apart_no_format;

      } else if (data.building.message_success) {
        this.nav.setRoot(HomePage);
      }
    });
  }

  PropertyInfo() {
    if (this.onPropertySetupForm.valid) {
      this.dwollaService.dwollaCreateUnverifiedCustomer(this.onPropertySetupForm.value).subscribe(response => {
      
        if(response['message_success']){
          let alert = this.alertCtrl.create({
            title: 'Account Added Successfuly',
            message: 'Do you want to Associate Bank Account?',
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
        }else{
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
    }else{
      let alert = this.alertCtrl.create({
        title: 'Error',
        message: 'All Fields are required',
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
  }
  presentConfirm() {
    // let alert = this.alertCtrl.create({
    //   title: 'Success',
    //   message: 'Your account has been created successfully',
    //   buttons: [
    //     {
    //       text: 'OK',
    //       handler: () => {

    //       }
    //     }
    //   ]
    // });
    // alert.present();
  }

}
