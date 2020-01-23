import { Component } from '@angular/core';
import { NavController, NavParams,AlertController } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AccountAssociationPage } from '../account-association/account-association';
import { DwollaService } from '../../services/dwolla.service';
import { PaymentsPage } from '../payments/payments';
/**
 * Generated class for the UpdatePaymentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-update-payment',
  templateUrl: 'update-payment.html',
})
export class UpdatePaymentPage {
  public data:any;
  public onPropertySetupForm: FormGroup;

  constructor(public nav: NavController, public navParams: NavParams,
    private _fb: FormBuilder,public dwollaService:DwollaService,
    public alertCtrl: AlertController
    ) {
    this.data = this.navParams.get('data');
    this.onPropertySetupForm = this._fb.group({
      FirstName: ['', Validators.compose([
        Validators.required
      ])],
      LastName: ['', Validators.compose([
        Validators.required
      ])],
      Email: ['', Validators.compose([
        Validators.required
      ])]
      // Type: ['', Validators.compose([
      //   Validators.required
      // ])],
      // Address: ['', Validators.compose([
      //   Validators.required
      // ])],
    });

  }

  ionViewDidLoad() {
  }
  PropertyInfo() {
    if (this.onPropertySetupForm.valid) {
      this.dwollaService.dwollaUpdateUnverifiedCustomer(this.onPropertySetupForm.value).subscribe(response => {
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
  skip(){
    this.nav.setRoot(PaymentsPage);
  }

}
