import { Component, OnInit } from '@angular/core';

import { Platform, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from "./core/auth.service";
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from "@angular/router";

import { ProfileService } from "./core/profile.service";
import { DataService } from './core/data.service';
import { Profile } from '../models/profile';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit{

  public appPages = [
    {
      title: 'Hjem',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'Tilføj Begivenhed',
      url: '/addEvent'
    },
    {
      title: 'Alle Begivenheder',
      url: '/allevents',
      icon: 'md-globe'
    },
    {
      title: 'Alle Kategorier',
      url: '/category',
      icon: 'list'
    },
    {
      title: 'Min Profil',
      url: '/profile',
      icon: 'person'
    }
  ];

  userProfile: Profile;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public fireAuth: AngularFireAuth,
    public router: Router,
    public auth: AuthService,
    public pS:ProfileService,
    public data: DataService,
    private menu: MenuController
  ) {
    console.log("App",this.appPages);
    this.fireAuth.auth.onAuthStateChanged((user) => {
      console.log(user);
      if (user!=null) {
        this.router.navigate(['/login']);
      } else {
        console.log(user);
        this.router.navigate(['/home']);
      }
    });
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ngOnInit() {
  }
  
  logout(){
    this.menu.enable(false);
    this.auth.signOut();
  }

}
