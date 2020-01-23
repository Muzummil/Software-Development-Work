import { Component, OnInit } from "@angular/core";
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NavController, MenuController, ToastController, AlertController } from "ionic-angular";
import { LoginPage } from '../login/login';
import { Store } from "@ngrx/store";
import { AppState } from "../../reducers";
import { UserActions } from "../../actions";
import { LoaderService } from '../../services/loader-service';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage implements OnInit {
  public onRegisterForm: FormGroup;
  register$: any;
  userNameMessage: any;
  emailMessage: any;
  numberMessage: any;
  passwordMessage: any;
  num:any;

  constructor(
    private _fb: FormBuilder,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public nav: NavController,
    public menu: MenuController,
    private userActions: UserActions,
    private store: Store<AppState>,
    public loaderService:LoaderService        
  ) {
    this.menu.swipeEnable(false);
    this.menu.enable(false);
  }

  ngOnInit() {
    this.onRegisterForm = this._fb.group({
      firstName: ['', Validators.compose([
        Validators.required
      ])],
      lastName: ['', Validators.compose([
        Validators.required
      ])],
      email: ['', Validators.compose([
        Validators.required,
      ])],
      password: ['', Validators.compose([
        Validators.required,
        Validators.pattern('^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$'),
      ])],
      pnumber: ['', Validators.compose([
        Validators.required
      ])]
    });

    this.register$ = this.store.select("register").subscribe((user: any) => {
      if (user.register.validation_errors) {
        var error = user.register.validation_errors;
        this.userNameMessage = error.name;
        this.emailMessage = error.email;
        this.numberMessage = error.phone;
        this.passwordMessage = error.password;
      } else if (user.register.success) {
        this.presentConfirm();
      }
    });
  }

  // go to login page
  login() {
    this.store.dispatch(this.userActions.clearRegister());
    this.nav.setRoot(LoginPage);
  }
  onKey(e){
    if(e!=undefined && e!=null){
      if(e.length==3){
        this.num = "("+e+")";
      }
      if(e.length==8){
        this.num = e+"-";
      }
    }
  }
  onRigister() {
      this.loaderService.startLoader("Processing Please wait");
      this.store.dispatch(
      this.userActions.register({
          name: this.onRegisterForm.value.firstName+this.onRegisterForm.value.lastName,
          email: this.onRegisterForm.value.email,
          number: "+11"+this.onRegisterForm.value.pnumber,
          password: this.onRegisterForm.value.password,
          role_id: "2"
        })
      );
      this.loaderService.stopLoader();
  }

  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: 'Success',
      message: 'Your account has been created successfully. You can login now.',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.nav.setRoot(LoginPage);
          }
        }
      ]
    });
    alert.present();
    this.store.dispatch(this.userActions.clearRegister());
  }
}
