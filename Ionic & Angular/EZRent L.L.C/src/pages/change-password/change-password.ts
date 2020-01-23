import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NavController, MenuController } from 'ionic-angular';

import { AppState } from "../../reducers";
import { Store } from "@ngrx/store";
import { UserActions } from "../../actions";
import { HomePage } from '../home/home';

//pages

@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html'
})
export class ChangePassPage {
  public onChangeForm: FormGroup
  public user$: any;
  public message: any;

  constructor(
    private _fb: FormBuilder,
    private store: Store<AppState>,
    private userActions: UserActions,
    public menuCtrl: MenuController,
    public nav: NavController) {
    menuCtrl.enable(true);

  }

  ngOnInit() {
    this.onChangeForm = this._fb.group({
      currentPassword: ['', Validators.compose([
        Validators.required
      ])],
      newPassword: ['', Validators.compose([
        Validators.required
      ])],
    });

    this.user$ = this.store.select("passwordChange").subscribe((data: any) => {
      if (data.passwordChange.validation_errors) {
        this.message = data.passwordChange.validation_errors.new_password;
      } else if (data.passwordChange.error) {
        this.message = data.passwordChange.error;
      } else if (data.passwordChange.message_success) {
        this.nav.setRoot(HomePage);
      }
    });

  }

  onChangePassword() {
    this.store.dispatch(
      this.userActions.changePassword({
        changeCurrentPassword: this.onChangeForm.value.currentPassword,
        changeNewPassword: this.onChangeForm.value.newPassword
      })
    );
  }


}
