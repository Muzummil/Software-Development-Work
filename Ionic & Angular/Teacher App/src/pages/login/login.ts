import { Component } from '@angular/core';
import { UserService,CacheService } from '../../app/shared/services';
import { SharedModule } from '../../app/shared';
import { HomePage } from '../home/home';
import { AlertController, MenuController,NavController, NavParams,LoadingController } from "ionic-angular";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  public userName:any;
  public password:any;
  public showLoginErr:boolean=false;
  public showLoginEmptyErr:boolean=false;
  constructor(public nav: NavController,public menu: MenuController,public navCtrl: NavController,
              public navParams: NavParams,public userService:UserService,
              public cacheService:CacheService,
              public loginErrorCtrl: AlertController,
              public loginLengthErrorCtrl: AlertController,
              public shared:SharedModule,public loadingCtrl: LoadingController) {
    this.menu.swipeEnable(false);
  }
  ionViewDidLoad() {
    let loginCheck:boolean = this.shared.loginCheck();
    if(loginCheck){
      this.nav.setRoot(HomePage);
    }
    // console.log('ionViewDidLoad LoginPage');
  }
  login(){
  let loader = this.loadingCtrl.create({
    content: "Please wait...",
    duration: 2000
  });
  if(this.userName==undefined && this.password==undefined){
      // console.log("empty");
      let emptyError = this.loginErrorCtrl.create({
        title:'Login Error',
        message:'All Fields are Required',
        buttons:[{
          text: 'Cancel',
          handler: data => {
            // console.log('Cancel clicked');
          }
        }]
      });
      emptyError.present();
    }else if(this.userName, this.password,this.password.length>=5){
      loader.present();
    this.userService.login(this.userName, this.password).subscribe(response=>{
      // console.log(response);
      if(response.success==true){
        this.cacheService.setIndependent('token',response.token);
        this.cacheService.setIndependent('user_id',response.id);
        this.cacheService.setIndependent('user_name',response.name);
        this.cacheService.setIndependent('user_branch',response.branch);
        loader.dismiss();
        this.nav.setRoot(HomePage);
      }else{
        let loginError = this.loginErrorCtrl.create({
        title:'Login Error',
        message:'Invalid Username or Password',
        buttons:[{
          text: 'Cancel',
          handler: data => {
            // console.log('Cancel clicked');
            }
            }]
          });
         loginError.present();
        }
      // if(!_.isEmpty(response)){
      //   console.log("looo");
      // }

    })
  }else{
    console.log("njjnn");
    let loginLength = this.loginLengthErrorCtrl.create({
        title:'Length Error',
        message:'Invalid Length of Username or Password',
        buttons:[{
          text: 'Cancel',
          handler: data => {
            // console.log('Cancel clicked');
            }
            }]
          });
         loginLength.present();
    //EMAIL PASSWORD ERROR
  }
 }
}
