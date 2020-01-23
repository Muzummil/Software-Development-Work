import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NavController, Platform, ActionSheetController, AlertController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { AppState } from "../../reducers";
import { Store } from "@ngrx/store";
import { BuildingActions } from "../../actions";

@Component({
  selector: 'page-payments-bank',
  templateUrl: 'payments-bank.html'
})
export class PaymentsBankPage implements OnInit {

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
    private buildingActions: BuildingActions,
    public actionsheetCtrl: ActionSheetController
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


  ngOnInit() {
    this.onPropertySetupForm = this._fb.group({
      Name: ['', Validators.compose([
        Validators.required
      ])],
      AccountNumber: ['', Validators.compose([
        Validators.required
      ])],
      AccountType: ['', Validators.compose([
        Validators.required
      ])],
      RoutingNumber: ['', Validators.compose([
        Validators.required
      ])],
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
    this.store.dispatch(
      this.buildingActions.addBuilding({
        data: this.onPropertySetupForm.value,
      })
    );
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
