import { LoaderService } from './../../services/loader-service';
import { Component, OnInit } from "@angular/core";
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NavController, NavParams,AlertController } from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { HomePage } from "../home/home";
import { TenantMsgPage } from '../tenant-msg/tenant-msg';
import { TenantInvitationService } from '../../services/tenant-invitation.service';
import { PopupService } from '../../services/popup.service';
@Component({
  selector: 'page-invite-tenant',
  templateUrl: 'invite-tenant.html'
})
export class InviteTenantPage implements OnInit {

  public onInviteTenantForm: FormGroup;
  public sendInvitation$: any;
  public message: any;
  public appartmentID: any;
  public numberError:any;
  public invitationId:any;
  constructor(
    public storage: Storage,
    private _fb: FormBuilder,
    public navParams: NavParams,
    public popup:PopupService,
    public loaderService:LoaderService,
    public tenantInvitationService:TenantInvitationService,
    public nav: NavController,private alertCtrl: AlertController) {
    this.appartmentID = navParams.get("appartmentID");
  }


  ngOnInit() {
    this.onInviteTenantForm = this._fb.group({
      Number: ['', Validators.compose([
        Validators.required
      ])],
    });

    // this.sendInvitation$ = this.store.select("sendInvitate").subscribe((data: any) => {
    //   try {
    //     if (data.sendInvitation.message_success) {
    //       this.nav.setRoot(TenantMsgPage, { phone_number: this.onInviteTenantForm.value.Number });
    //     } else {
    //       this.message = data.sendInvitation.validation_errors.phone_number[0];
    //     }
    //   } catch (err) {
    //   }
    // });
  }

  back() {
    this.nav.setRoot(HomePage);
  }



  inviteTenent() {
    let alert2 = this.alertCtrl.create({
      title: 'Set invitation expiry',
      inputs: [
        {
          name: 'no_of_days',
          placeholder: 'Number of days of link to be expired(By default is 2 days)'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
          }
        },
        {
          text: 'Ok',
          handler: data => {
            if (data.no_of_days!=null && data.no_of_days!=undefined) {
              this.tenantInvitationService.varificationExpiry(data.no_of_days,this.invitationId).subscribe(response=>{
                this.popup.showAlert("success","Invitation expiry set successfully");
              })
            } else {
              alert2.present();
            }
          }
        }
      ]
    });

    this.loaderService.startLoader("Inviting Tennat");
    this.tenantInvitationService.sendInvitation(this.onInviteTenantForm.value.Number,this.appartmentID).subscribe(response=>{
    this.loaderService.stopLoader();
      if(response['message_success']){
        this.invitationId = response['invitation_id'];
        alert2.present();
        this.nav.setRoot(TenantMsgPage, { phone_number: this.onInviteTenantForm.value.Number });
      }else {
        try{
        if(response['validation_errors'] && response['validation_errors']['phone_number']){
          this.numberError =  response['validation_errors']['phone_number']
        }
        // else{
        //   this.numberError = "unverified number";
        // }
      }catch(e){}
    }
    });
    // this.store.dispatch(
    //   this.invitationActions.sendInvitation({
    //     phone_number: this.onInviteTenantForm.value.Number,
    //     appartmentID: this.appartmentID
    //   })
    // );
  }


}
