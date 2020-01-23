import {Component} from "@angular/core";
import { NavController, App } from 'ionic-angular';
import {LoginPage} from "../login/login";
import { UserService} from '../../app/shared/services';


@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  constructor(public app:App,public nav: NavController,private userService:UserService) {
  }

  // logout
  logout() {
  	this.userService.logout().subscribe(response=>{
  		// console.log(response);
  		const root = this.app.getRootNav();
      root.popToRoot();
	  	this.nav.push(LoginPage);
  	})
    this.nav.setRoot(LoginPage);
  }
}
