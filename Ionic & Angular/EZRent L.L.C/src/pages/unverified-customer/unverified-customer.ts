import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NavController, Platform, ActionSheetController, AlertController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { AppState } from "../../reducers";
import { Store } from "@ngrx/store";
import { BuildingActions } from "../../actions";
import { AppartmentSetupPage } from '../apartment-setup/apartment-setup';

@Component({
  selector: 'page-unverified-customer',
  templateUrl: 'unverified-customer.html'
})
export class UnverifiedCustomerPage implements OnInit {

  public event = {
    month: '1990-02-19',
    timeStarts: '07:43',
    timeEnds: '1990-02-20'
  }

  public onUnverifiedCustomerPageForm: FormGroup;
  addBuilding$: any;

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


  // go to Appartment Setup page
  skip() {
    this.nav.setRoot(HomePage);
  }

  ngOnInit() {
    this.onUnverifiedCustomerPageForm = this._fb.group({
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
    });

    this.addBuilding$ = this.store.select("buildings").subscribe((data: any) => {
      if (data.building.message_success) {
        this.nav.setRoot(AppartmentSetupPage);
      }
    });
  }

  PropertyInfo() {
    this.store.dispatch(
      this.buildingActions.addBuilding({
        data: this.onUnverifiedCustomerPageForm.value,
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
