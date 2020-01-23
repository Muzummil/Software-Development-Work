import { Component, OnInit } from "@angular/core";
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NavController, ToastController } from 'ionic-angular';
import { AppState } from "../../reducers";
import { Store } from "@ngrx/store";
import { UserActions } from "../../actions";
import { verifyCode } from "../verify-code/verify-code";

//pages

@Component({
  selector: 'page-verify-number',
  templateUrl: 'verify-number.html'
})
export class verifyNumber implements OnInit {
  public onVerifyNumber: FormGroup
  public user$: any;
  public user: any;
  public verifyNumber$: any;
  public message: any;
  public unver:boolean=false;

  constructor(
    private _fb: FormBuilder,
    public toastCtrl: ToastController,
    private store: Store<AppState>,
    private userActions: UserActions,
    public nav: NavController) {

  }

  // go to bar code page
  barCode() {
    //this.nav.setRoot(verifyCode);
  }

  ngOnInit() {
    this.user$ = this.store.select("user").subscribe((data: any) => {
      this.user = data.user.user;
    });

    this.onVerifyNumber = this._fb.group({
      Number: [this.user[0].phone, Validators.compose([
        Validators.required
      ])],
    });


  }

  onVerify() {
    this.store.dispatch(
      this.userActions.verifyNumber({
        phone_number: this.onVerifyNumber.value.Number
      })
    );
  }
  ionViewDidLoad() {
    this.verifyNumber$ = this.store.select("verifyNumber").subscribe((data: any) => {
      try {
        if (data.verifyNumber.message_success) {
          this.nav.setRoot(verifyCode);
        } else if(data.verifyNumber.validation_errors){
          this.message = data.verifyNumber.validation_errors.phone_number;
        }else if(data.verifyNumber.error){
          this.unver = true;
          this.message = "Your phone number is not varified enter a varified number here";
        }
      } catch (err) {
      }
    });
  }

}
