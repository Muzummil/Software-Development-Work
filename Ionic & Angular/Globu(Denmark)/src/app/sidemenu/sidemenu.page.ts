import { Component, OnInit } from '@angular/core';

import { AuthService } from "../core/auth.service";
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from "@angular/router";

import { ProfileService } from "../core/profile.service";
import { User } from 'firebase/app';
import { DataService } from '../core/data.service';
import { Profile } from '../../models/profile';

  @Component({
    selector: 'app-sidemenu',
    templateUrl: './sidemenu.page.html',
    styleUrls: ['./sidemenu.page.scss'],
  })
export class SidemenuPage implements OnInit {

  public appPages = [
    {
      title: 'Hjem',
      url: '/home',
      icon: 'home'
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
    public fireAuth: AngularFireAuth,
    public router: Router,
    public auth: AuthService,
    public pS:ProfileService,
    public data: DataService) {
      console.log("in side menu"); 
      this.auth.getAuthenticatedUser().subscribe((user: User) => {
        console.log(user);
        this.data.getProfile(user).subscribe((profile: Profile) => {
          console.log(profile);
          this.userProfile = profile;
          console.log(this.userProfile);
         });
        });
  }

  ngOnInit() {}

}
