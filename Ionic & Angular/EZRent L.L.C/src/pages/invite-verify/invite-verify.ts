import { Component, OnInit } from "@angular/core";
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NavController, ToastController } from 'ionic-angular';
import { HomePage } from "../home/home";
import { TenantInvitationService } from '../../services/tenant-invitation.service';

//pages

@Component({
  selector: 'page-invite-verify',
  templateUrl: 'invite-verify.html'
})
export class InviteVerify implements OnInit {
  public onVerifyCode: FormGroup
  public user$: any;
  public message: any;
  public sucess: any;
  public verifyCode: any;
  public landloardInfo: any;

  constructor(
    private _fb: FormBuilder,
    public toastCtrl: ToastController,
    public tenantInvitationService:TenantInvitationService,    
    public nav: NavController) {
    this.sucess = true;
  }

  // go to bar code page
  barCode() {
    //this.nav.setRoot(verifyCode);
  }

  back() {
    this.nav.setRoot(HomePage);
  }

  ngOnInit() {
    this.onVerifyCode = this._fb.group({
      Number: ['', Validators.compose([
        Validators.required
      ])],
    });

    // this.user$ = this.store.select("verifyInvite").subscribe((data: any) => {
    //   try {
    //     if (data.verifyInvitation.message_success) {
    //       this.sucess = false;
    //       this.verifyCode = this.onVerifyCode.value.Number;
    //       this.landloardInfo = data.verifyInvitation.data;
    //     } else if (data.verifyInvitation.message_danger) {
    //       this.sucess = true;
    //       this.message = data.verifyCode.message_danger;
    //     }
    //   } catch (err) {

    //   }
    // });

    // this.user$ = this.store.select("acceptInvite").subscribe((data: any) => {
    //   try {
    //     if (data.acceptInvitation.message_success) {
    //       this.message = data.acceptInvitation.message_success;
    //       //this.nav.setRoot(HomePage);
    //     } else {
    //       this.message = data.acceptInvitation.message_danger;
    //     }
    //   } catch (error) {

    //   }
    // });
  }

  onVerify() {
    console.log(this.onVerifyCode.value.Number.length);
    if(this.onVerifyCode.value.Number.length>0  && this.onVerifyCode.value.Number!='' && this.onVerifyCode.value.Number!=undefined){
      this.tenantInvitationService.verifyInvitaion(this.onVerifyCode.value.Number).subscribe(response=>{
        if (response['message_success']) {
          this.sucess = false;
          this.verifyCode = this.onVerifyCode.value.Number;
          this.landloardInfo = response['data'];
        } else if (response['message_danger']) {
          this.sucess = true;
          this.message = response['message_danger'];
        }
      })
    }else{
      this.message = "Enter code first";
    }
    // this.store.dispatch(
    //   this.invitationActions.verifyInvitaion({
    //     code_number: this.onVerifyCode.value.Number
    //   })
    // );
  }

  accept() {
    this.tenantInvitationService.acceptInvitaion(this.onVerifyCode.value.Number).subscribe(response=>{
      if (response['message_success']) {
        this.message = response['message_success'];
        this.nav.setRoot(HomePage);
      } else {
        this.message = response['message_danger'];
      }
    })
    // this.store.dispatch(
    //   this.invitationActions.acceptInvitaion({
    //     code_number: this.onVerifyCode.value.Number
    //   })
    // );
  }

}
