import { Component, OnInit } from "@angular/core";
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NavController, ToastController } from 'ionic-angular';
import { TermsCondtionsPage } from '../terms-conditions/terms-conditions';
import { AppState } from "../../reducers";
import { Store } from "@ngrx/store";
import { UserActions } from "../../actions";

//pages

@Component({
  selector: 'page-verify-code',
  templateUrl: 'verify-code.html'
})
export class verifyCode implements OnInit {
  public onVerifyCode: FormGroup
  public user$: any;
  public message: any;

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
    this.onVerifyCode = this._fb.group({
      Number: ['', Validators.compose([
        Validators.required
      ])],
    });


  }

  onVerify() {
    this.store.dispatch(
      this.userActions.verifyCode({
        code_number: this.onVerifyCode.value.Number
      })
    );
  }

  ionViewDidLoad() {
    this.user$ = this.store.select("verifyCode").subscribe((data: any) => {
      try {
        if (data.verifyCode.message_success) {
          this.nav.setRoot(TermsCondtionsPage);
        } else {
          this.message = data.verifyCode.message_danger;
        }
      } catch (err) {
      }
    });
  }


}
