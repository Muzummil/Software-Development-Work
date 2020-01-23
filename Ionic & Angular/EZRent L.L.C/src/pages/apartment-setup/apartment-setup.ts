import { NotificationService } from './../../services/notification.service';
import { Component, OnInit } from "@angular/core";
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { AppState } from "../../reducers";
import { Store } from "@ngrx/store";
import { HomePage } from '../home/home';
import { LoaderService } from '../../services/loader-service';
import { AppartementService } from '../../services/appartement.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'page-apartment-setup',
  templateUrl: 'apartment-setup.html'
})
export class AppartmentSetupPage implements OnInit {

  public event = {
    month: '1990-02-19',
    timeStarts: '07:43',
    timeEnds: '1990-02-20'
  }

  public onAppartmentSetupForm: FormGroup;
  public appartmentFormat: any;
  bathroomsMessage: any;
  bedroomsMessage: any;
  late_feeMessage: any;
  rent_priceMessage: any;
  appartmentMessage: any;
  dueDateMessage: any;
  firstPaymentMessage: any;
  buildingID: any;
  public userRole: any;
  public apartmentData: any;
  public GraceDays:any;
  public bId: any; 
  public data: any;
  public dueDate:any;

  constructor(
    private _fb: FormBuilder,
    public storage: Storage,
    private store: Store<AppState>,
    public navParams: NavParams,
    public nav: NavController,
    private appartementService: AppartementService,
    public loaderService:LoaderService,
    public userService:UserService,
    public notificationService:NotificationService    
  ) {
    this.appartmentFormat = navParams.get("formatAppartment");
    storage.get('buildingID').then((val) => {
      this.buildingID = val;
    });
  }
  appartment$: any;
  inviteTenant() {
    this.nav.setRoot(HomePage);
  }

  ngOnInit() {
    this.notificationService.getAllNotifications().subscribe(res=>{});    
    this.onAppartmentSetupForm = this._fb.group({

      AppartmentNumber: ['', Validators.compose([
        Validators.required
      ])],
      Tenants: ['', Validators.compose([
        Validators.required
      ])],
      BedRoom: ['', Validators.compose([
        Validators.required
      ])],
      BathRoom: ['', Validators.compose([
        Validators.required
      ])],
      rentPrice: ['', Validators.compose([
        Validators.required
      ])],
      firstPayment: ['', Validators.compose([
        Validators.required
      ])],
      firstDueDate: ['', Validators.compose([
        Validators.required
      ])],
      GraceDays: ['', Validators.compose([
        Validators.required
      ])],
      LateFee: ['', Validators.compose([
        Validators.required
      ])],
    });
    this.appartment$ = this.store.select("appartement").subscribe((data: any) => {

    });
  }

  // AppartmentInfo() {
  //   this.store.dispatch(
  //     this.apartementActions.addAppartement({
  //       data: this.onAppartmentSetupForm.value,
  //       buildingID: this.buildingID
  //     })
  //   );
  // }
  AppartmentInfo() {
    this.loaderService.startLoader("Adding Apartment");    
    this.apartmentData = this.onAppartmentSetupForm.value;
    this.bId = this.buildingID;
    this.appartementService.addAppartement2(this.apartmentData, this.bId).subscribe((data: any) => {
      if (data.validation_errors) {
        this.bathroomsMessage = data.validation_errors.bathrooms;
        this.bedroomsMessage = data.validation_errors.bedrooms;
        this.late_feeMessage = data.validation_errors.late_fee_surcharge;
        this.rent_priceMessage = data.validation_errors.rent_price;
        this.appartmentMessage = data.validation_errors.apart_no;
        this.dueDateMessage = data.validation_errors.due_date;
        this.GraceDays = data.validation_errors.GraceDays;        
        this.firstPaymentMessage = data.validation_errors.first_payment_due;
      } else if (data.message_success) {
        this.nav.setRoot(HomePage);
      }
    });
    this.loaderService.stopLoader();    
  }
}
