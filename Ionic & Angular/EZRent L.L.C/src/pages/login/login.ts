import { UserService } from './../../services/user.service';
import { LocalStorageService } from './../../services/local-storage.service';
import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Events } from "ionic-angular";
import { ToastController } from "ionic-angular";
import { AppState } from "../../reducers";
import { AuthActions, UserActions } from "../../actions";
import { Storage } from "@ionic/storage";
import { Store } from "@ngrx/store";
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { LocalNotifications } from '@ionic-native/local-notifications';

//import pages
import { verifyNumber } from '../verify-number/verify-number';
import { HomePage } from '../home/home';
import { RegisterPage } from '../register/register';
import { LoaderService } from '../../services/loader-service';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  login: { username?: string; password?: string } = {};
  submitted = false;
  user: any;
  auth$: any;
  user$: any;
  about: any = {};
  isDriverToggled: boolean;
  public onLoginForm: FormGroup;
  userData: any;

  constructor(
    public facebook: Facebook,
    public _fb: FormBuilder,
    public nav: NavController,
    public menuCtrl: MenuController,
    public events: Events,
    public toastCtrl: ToastController,
    public store: Store<AppState>,
    public authActions: AuthActions,
    public userActions: UserActions,
    public storage: Storage,
    public userService:UserService,
    public loaderService:LoaderService,
    public localStorageService:LocalStorageService,
    public localNotifications:LocalNotifications
  ) { }

  ionViewDidLeave() {

  }
  setUsername(username: string): void {
    this.storage.set("username", username);
  }
  ngOnInit() {
    this.menuCtrl.swipeEnable(true);
    this.menuCtrl.enable(false);

    this.onLoginForm = this._fb.group({
      email: ['', Validators.compose([
        Validators.required
      ])],
      password: ['', Validators.compose([
        Validators.required
      ])]
    });

    this.auth$ = this.store.select("auth").subscribe((auth: any) => {
      if (auth.id_token == undefined) {
        const toast = this.toastCtrl.create({
          message: "Invalid username or password.",
          duration: 2000,
          position: "top"
        });
        toast.present();
        // this.store.dispatch(this.authActions.clearLogin());
      } else if (auth.id_token) {
        if(localStorage.length<=0){
          this.logoutAfterOneDay();
        }
        this.user$ = this.store.select("user").subscribe((data: any) => {
          this.user = data.user.user;
          try{
            if (this.user[0].is_verified == 0) {
              this.nav.setRoot(verifyNumber);
            } else if (this.user[0].is_verified == 1) {
              // this.loaderService.startLoader("Loading");
              this.nav.setRoot(HomePage);
              // setTimeout( () => {
              //   this.nav.setRoot(HomePage);                
              // }, 1000);
              // this.loaderService.stopLoader();
            }
            this.localStorageService.set('userId',this.user[0]['id']);
            this.localStorageService.set('name',this.user[0].name);
          }catch(error){}
        });
      }
    });

    
  }
  logoutAfterOneDay(){
    var now = new Date();
    var nextDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(), // the next day, ...
        // 10,3, 0 // ...at 00:00:00 hours
        12,0,0 // ...at 00:00:00 hours
    );
    // console.log("before",nextDay,nextDay.getTime());
    now.setHours(nextDay.getHours()+12);
    // now.setMinutes(nextDay.getMinutes()+2);
    // console.log("now after",now,now.getTime());
    this.localNotifications.schedule([
      {
        id: 122,
        text: 'Please login again',
        trigger: {at: nextDay},
        foreground: true
        // trigger: {at: new Date(new Date().getTime() + 2)},
        // data: "nothing special"
      },{
        id: 123,
        text: 'Please login again',
        trigger: {at: now},
        foreground: true
        // trigger: {at: new Date(new Date().getTime() + 2)},
        // data: "nothing special"
      }
    ]);
    this.localNotifications.on("click").subscribe(val=>{
      if(val){
        this.clearData();
      }
    });
    // nextDay.setHours(nextDay.getHours()+8);
    // console.log(nextDay,nextDay.getTime());
    // console.log(nextDay.getTime());
    // this.localNotifications.schedule({
    //   id: 123,
    //   text: 'Please login again on TheRentApp',
    //   trigger: {at: nextDay},
    //   // trigger: {at: new Date(new Date().getTime() + 2)},
    //   // data: "nothing special"
    // });
   
  }
  clearData(){
    this.userService.logoutUser.subscribe();
    this.facebook.logout();
    this.store.dispatch(this.authActions.clearLogin());
    this.store.dispatch(this.authActions.logout());
    this.storage.remove("auth_token");
    this.storage.remove("user");
    this.localStorageService.clear();
    this.localStorageService.set("setLogout",false);
    this.nav.setRoot(LoginPage);
    window.location.reload();
  }
  
  loginWithFB() {
    if(this.onLoginForm.valid){
      alert("Start");
      this.facebook.login(['public_profile', 'email']).then((res: FacebookLoginResponse) => {
        alert(res);
        const toast = this.toastCtrl.create({
          message: res.toString(),
          duration: 20000,
          position: "top"
        });
        toast.present();
        this.storage.set("auth_token", res.authResponse.accessToken);
        this.facebook.api('me?fields=id,name,email,first_name,picture.width(720).height(720).as(picture_large)', []).then(profile => {
         alert(profile);
          this.store.dispatch(
            this.userActions.register({
              name: profile['first_name'],
              email: profile['email'],
              number: profile['number'],
              password: profile['name'],
              role_id: "2"
            })
          );
        });
        this.nav.setRoot(HomePage);
      })
        .catch(e => console.log('Error logging into Facebook', e));
    }
  }
  // logoutAfterOneDay(){
  //   var now = new Date(new Date().getTime() + 20);
  //   console.log(now);
  //   console.log(now.getTime());
  //   // var now = new Date();
  //   var nextDay = new Date(
  //       now.getFullYear(),
  //       now.getMonth(),
  //       now.getDate(), // the next day, ...
  //       17, 52, 0 // ...at 00:00:00 hours
  //       // 0, 0, 0 // ...at 00:00:00 hours
  //   );
  //   console.log(nextDay,nextDay.getTime());
  //   console.log(nextDay.getTime());
  //   this.localNotifications.schedule({
  //     id: 122,
  //     text: 'Single ILocalNotification',
  //     trigger: {at: nextDay},
  //     // trigger: {at: new Date(new Date().getTime() + 2)},
  //     data: "nothing special"
  //   });



  //   if(this.localNotifications.isScheduled(122)){
  //     // this.localStorageService.set("setLogout",true);
  //     // var now = new Date();
  //     // var night = new Date(
  //     //     now.getFullYear(),
  //     //     now.getMonth(),
  //     //     now.getDate() + 1, // the next day, ...
  //     //     0, 0, 0 // ...at 00:00:00 hours
  //     // );
  //     console.log(now);
  //     // console.log(now.getMinutes());
  //     now.setMinutes(now.getMinutes()+1);
  //     // console.log(now.getMinutes(),now.getTime());
  //     // console.log("Mi",now.getMilliseconds());
  //     // let a = now.getMilliseconds() + 337500;
  //     let a = now.getMilliseconds() + 42375;
  //     // let a = now.getMilliseconds() + 86400000;
  //     // console.log(now.setMilliseconds(a));
  //     // console.log(a,"Mi222",now.getMilliseconds());
  //     // var msToMidnight = night.getTime() - now.getTime();
  //     // var msToMidnight = night.getTime() - now.getTime();
  //     // console.log(now);
  //     // console.log(night);
  //     // setTimeout(function(){ 
  //     //   alert("Hello");
        
  //     // }, 30000);             
  //     // setTimeout(this.doIt(), 30000);

  //     // setTimeout(function(){
  //     //   this.clearData();
  //     // }.bind(this), a);
      
  //     // setTimeout(this.doIt(), a);
  //     // setTimeout(function(){ 
  //     //   alert("Hello");
  //     //   this.doIt();
  //     //   // this.nav.setRoot(page.component); 
  //     // }, 2000);
  //     // setTimeout(this.doIt(),200000);
  //     // setTimeout(function() {
  //     //   console.log("timeout");
  //     // // is this a correct way to loop, in case of error when sync ???
  //     //   // myFunctionSync(err, resp) {
  //     //   // }
  //     //   console.log(msToMidnight);              
  //     // }, now.getTime());
  //   }
   
  // }
  
  register() {
    this.nav.setRoot(RegisterPage);
  }

  forgot() {
    //this.nav.setRoot(ForgotPassPage);
  }


  onLogin() {
    if(this.onLoginForm.valid){
      console.log("Starting");    
      this.loaderService.startLoader("varifying");
      this.store.dispatch(
        this.authActions.login({
          username: this.onLoginForm.value.email,
          password: this.onLoginForm.value.password
        })
      );
      this.loaderService.stopLoader();
    }
  }
}
