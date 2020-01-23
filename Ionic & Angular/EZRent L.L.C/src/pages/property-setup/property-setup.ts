import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NavController, Platform, ActionSheetController, AlertController, NavParams } from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { HomePage } from '../home/home';
import { AppState } from "../../reducers";
import { Store } from "@ngrx/store";
import { BuildingActions } from "../../actions";
import { AppartmentSetupPage } from '../apartment-setup/apartment-setup';

@Component({
  selector: 'page-property-setup',
  templateUrl: 'property-setup.html'
})
export class PropertySetupPage implements OnInit {

  public event = {
    month: '1990-02-19',
    timeStarts: '07:43',
    timeEnds: '1990-02-20'
  }

  public userRole: any;
  public onPropertySetupForm: FormGroup;
  public buildingData: any;
  public states: any[];
  public sState: any;
  addBuilding$: any;
  addressMessage: any;
  cityMessage: any;
  nameMessage: any;
  no_of_apartmentsMessage: any;
  stateMessage: any;
  zip_codeMessage: any;
  formatMessage: any;

  constructor(
    public storage: Storage,
    private _fb: FormBuilder,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private store: Store<AppState>,
    public nav: NavController,
    public platform: Platform,
    private buildingActions: BuildingActions,
    public actionsheetCtrl: ActionSheetController
  ) { 
      this.initializeState();
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
  initializeState(){
    this.states = [
      {name: 'Alabama'},{name: 'Alaska'},{name: 'Arizona'},{name: 'Arkansas'},
      {name: 'California'},{name: 'Colorado'},{name: 'Connecticut'},{name: 'Delaware'},
      {name: 'Florida'},{name: 'Georgia'},{name: 'Hawaii'},{name: 'Idaho'},
      {name: 'Illinois'},{name: 'Indiana'},{name: 'Iowa'},{name: 'Kansas'},
      {name: 'Kentucky'},{name: 'Louisiana'},{name: 'Maine'},{name: 'Maryland'},
      {name: 'Massachusetts'},{name: 'Michigan'},{name: 'Minnesota'},{name: 'Mississippi'},
      {name: 'Missouri'},{name: 'Montana'},{name: 'Nebraska'},{name: 'Nevada'},
      {name: 'New Hampshire'},{name: 'New Jersey'},{name: 'New Mexico'},{name: 'New York'},
      {name: 'North Carolina'},{name: 'North Dakota'},{name: 'Ohio'},{name: 'Oklahoma'},
      {name: 'Oregon'},{name: 'Pennsylvania'},{name: 'Rhode Island'},{name: 'South Carolina'},
      {name: 'South Dakota'},{name: 'Tennessee'},{name: 'Texas'},{name: 'Utah'},
      {name: 'Vermont'},{name: 'Virginia'},{name: 'Washington'},{name: 'West Virginia'},
      {name: 'Wisconsin'},{name: 'Wyoming'}
    ];
  }
  ngOnInit() {
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
        Validators.required,
      ])],
      Noapartments: ['', Validators.compose([
        Validators.required
      ])],
      formatApartments: ['', Validators.compose([
        Validators.required
      ])]
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
        this.storage.set("buildingID", data.building.building_id);
        this.nav.setRoot(AppartmentSetupPage, { formatAppartment: this.onPropertySetupForm.value.formatApartments });
      }
    });
  }

  PropertyInfo() {
    console.log(this.sState);
    console.log(this.onPropertySetupForm.value);
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
