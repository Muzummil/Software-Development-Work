import { Component, OnInit } from "@angular/core";
import { NavController } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Storage } from "@ionic/storage";
import { AppState } from "../../reducers";
import { Store } from "@ngrx/store";
import { UserSelectionActions } from "../../actions";
import { HomePage } from '../home/home';

@Component({
  selector: 'page-profile-update',
  templateUrl: 'profile-update.html'
})


export class ProfileUpdate implements OnInit {
  public roleID: any;
  public user$: any;
  public user: any;
  public userDetails: any;

  public event = {
    month: '1990-02-19',
    timeStarts: '07:43',
    timeEnds: '1990-02-20'
  }
  public onLandlordForm: FormGroup;
  userCategory$: any;

  constructor(
    public storage: Storage,
    public nav: NavController,
    private store: Store<AppState>,
    private _fb: FormBuilder,
    private userSelection: UserSelectionActions
  ) {
    storage.get('roleID').then((val) => {
      this.roleID = val;
    });

  }

  ngOnInit() {
    this.user$ = this.store.select("user").subscribe((data: any) => {
      this.user = data.user.user;
      if (this.user[0].landloard) {
        this.userDetails = this.user[0].landloard;
      } else if (this.user[0].tenant) {
        this.userDetails = this.user[0].tenant;
      }
    });

    this.onLandlordForm = this._fb.group({
      fullName: [this.user[0].name, Validators.compose([
        Validators.required
      ])],
      date: [this.userDetails.date_of_birth, Validators.compose([
        Validators.required
      ])],
      gender: [this.userDetails.gender, Validators.compose([
        Validators.required
      ])],
      ethnicity: [this.userDetails.race, Validators.compose([
        Validators.required
      ])],
      education: [this.userDetails.education, Validators.compose([
        Validators.required
      ])],
      maritalStatus: [this.userDetails.marital_status, Validators.compose([
        Validators.required
      ])],
      yearlyIncome: ['$500', Validators.compose([
        Validators.required
      ])]
    });

    this.userCategory$ = this.store.select("userCategory").subscribe((data: any) => {
      if (data.userSelected[0] == "message_success") {
        this.nav.setRoot(HomePage);
      }
    });
  }

  propertSetup() {
    this.store.dispatch(
      this.userSelection.userSelection({
        data: this.onLandlordForm.value,
        role: this.roleID
      })
    );
  }

}
