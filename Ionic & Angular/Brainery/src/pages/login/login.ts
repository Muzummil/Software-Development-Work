import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserService,CacheService } from '../../app/shared/services';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { HomePage } from '../home/home';
/**import { FormsModule   }   from '@angular/forms';

 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  public userName:any;
  public password:any;
  public showLoginErr:boolean=false;
  public showLoginEmptyErr:boolean=false;
  constructor(public navCtrl: NavController, public navParams: NavParams,public userService:UserService,public cacheService:CacheService) {
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }
  login(){
  	console.log("kk",this.userName,this.password);
    if(this.userName, this.password,this.password.length>=5){
    this.userService.login(this.userName, this.password).subscribe(response=>{
      console.log(response);
      if(response.success==true){
        this.cacheService.setIndependent('token',response.token);
        this.cacheService.setIndependent('user_id',response.id);
        this.cacheService.setIndependent('user_name',response.name);
        this.cacheService.setIndependent('user_branch',response.branch);

        this.navCtrl.push(HomePage);
      }
      else{
        this.showLoginErr = true;
      }
      // if(!_.isEmpty(response)){
      //   console.log("looo");
      // }

    })
  }
  else{
    this.showLoginErr = false;
    this.showLoginEmptyErr = true;
  }
  }

}
