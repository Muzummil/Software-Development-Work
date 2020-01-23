import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { Store } from "@ngrx/store";
import { AppState } from "../../reducers";
import { TenancyActions } from "../../actions";
import { TenancyService } from '../../services/tenancy.service';
import { HomePage } from '../../pages/home/home';

@Component({
  selector: 'page-user-details',
  templateUrl: 'user-details.html'
})
export class UserDetailsPage {

  public tenantProperty: any;


  constructor(
    public storage: Storage,
    public nav: NavController,
    public tenancyActions: TenancyActions,
    private store: Store<AppState>,
    private alertCtrl: AlertController,
    private tenancyService: TenancyService
  ) {
    storage.get('tenantPropertyID').then((val) => {
      this.store.dispatch(this.tenancyActions.getTenancyById(val));
    });

    this.store.select("tenancy").subscribe((data: any) => {
      try {
        this.tenantProperty = data.tenancy.tenancy;

      } catch (error) {
      }
    });
  }

  payRent(rentAmount:any){
  }

  public presentConfirm(id) {
    let alert = this.alertCtrl.create({
      title: '',
      message: 'Are you sure you want to remove John Doe as a Tenant ?',
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
            this.tenancyService.deleteTenancy(id).subscribe(res => {
              if (res.message_success) {
                this.nav.setRoot(HomePage);
              }
            });
          }
        }
      ]
    });
    alert.present();
  }
}
