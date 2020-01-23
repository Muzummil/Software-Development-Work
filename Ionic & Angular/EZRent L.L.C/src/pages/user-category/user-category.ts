import { Component, OnInit } from "@angular/core";
import { NavController } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Storage } from "@ionic/storage";
import { AppState } from "../../reducers";
import { Store } from "@ngrx/store";
import { UserSelectionActions } from "../../actions";
import { PropertySetupPage } from '../property-setup/property-setup';
import { HomePage } from '../home/home';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'page-user-category',
  templateUrl: 'user-category.html'
})


export class userCategory implements OnInit {
  public userType: any;
  public roleID: any;
  public user$: any;
  public user: any;

  public event = {
    month: '1990-02-19',
    timeStarts: '07:43',
    timeEnds: '1990-02-20'
  }
  public onLandlordForm: FormGroup;
  userCategory$: any;

  constructor(
    public nav: NavController,
    private store: Store<AppState>,
    public storage: Storage,
    private _fb: FormBuilder,
    private userSelection: UserSelectionActions,
    public localStorageService: LocalStorageService
  ) {
    this.userType = 'User';

  }

  ngOnInit() {
    this.user$ = this.store.select("user").subscribe((data: any) => {
      this.user = data.user.user;
    });

    this.onLandlordForm = this._fb.group({
      fullName: [this.user[0].name, Validators.compose([
        Validators.required
      ])],
      date: ['', Validators.compose([
        Validators.required
      ])],
      gender: ['Male', Validators.compose([
        Validators.required
      ])],
      ethnicity: ['White', Validators.compose([
        Validators.required
      ])],
      education: ['Matric', Validators.compose([
        Validators.required
      ])],
      maritalStatus: ['Single', Validators.compose([
        Validators.required
      ])],
      yearlyIncome: ['$500', Validators.compose([
        Validators.required
      ])]
    });

    this.userCategory$ = this.store.select("userCategory").subscribe((data: any) => {
      if (data.userSelected[0] == "message_success") {
        if (this.userType == 'Tenant') {
          this.nav.setRoot(HomePage);

        } else if (this.userType == 'Landlord') {
          this.nav.setRoot(PropertySetupPage);
        }
      }
    });
  }

  // go to Landlord Information page
  landlord(type) {
    if (type == 'Tenant') {
      this.userType = 'Tenant';
      this.roleID = '4';
      this.localStorageService.set("roleID",4);
      // this.localStorageService.set("update","false");      
    } else if (type == 'Landlord') {
      this.userType = 'Landlord';
      this.roleID = '3';
      this.localStorageService.set("roleID",3);
      // this.localStorageService.set("update","false");      
    }
  }
  propertSetup() {
    this.storage.set("roleID", this.roleID);
    this.store.dispatch(
      this.userSelection.userSelection({
        data: this.onLandlordForm.value,
        role: this.roleID
      })
    );
  }

}
