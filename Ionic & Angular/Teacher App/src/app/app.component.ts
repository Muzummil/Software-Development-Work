import { Component, ViewChild } from "@angular/core";
import { Platform, Nav,App} from "ionic-angular";

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
// import { Keyboard } from '@ionic-native/keyboard';

import { UserService,CacheService} from './shared/services';

import { LoginPage } from "../pages/login/login";

export interface MenuItem {
    title: string;
    component: any;
    icon: string;
}

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;
  public name:string;
  appMenuItems: Array<MenuItem>;

  constructor(
    public app:App,
    public platform: Platform,
    public statusBar: StatusBar,
    public userService:UserService,
    public splashScreen: SplashScreen,
    public cacheService:CacheService,
    // public keyboard: Keyboard
  ) {
    this.initializeApp();

    // this.appMenuItems = [
    //   {title: 'Home', component: HomePage, icon: 'home'},
    //   {title: 'Local Weather', component: LocalWeatherPage, icon: 'partly-sunny'}
    // ];
  }

  initializeApp() {
    this.name = this.cacheService.getIndependent('user_name');
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.

      //*** Control Splash Screen
      // this.splashScreen.show();
      // this.splashScreen.hide();

      //*** Control Status Bar
      this.statusBar.styleDefault();
      this.statusBar.overlaysWebView(false);

      //*** Control Keyboard
      // this.keyboard.disableScroll(true);
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  logout() {
    this.userService.logout().subscribe(response=>{
      console.log(response);
      const root = this.app.getRootNav();
      root.popToRoot();
      this.nav.push(LoginPage);
    })
    this.nav.setRoot(LoginPage);
  }

}
