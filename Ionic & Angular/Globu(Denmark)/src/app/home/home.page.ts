import { Component, ViewChild, OnInit } from '@angular/core';
import { Slides, MenuController, ToastController } from '@ionic/angular';
import { Router } from "@angular/router";
import { BegivenhederService } from "../../services/begivenheder.service";
import { AuthService } from "../core/auth.service";
import { AngularFireAuth  } from "@angular/fire/auth";

import { User } from "firebase/app";

import { DataService } from "../core/data.service";
import { Profile } from '../../models/profile';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild('mySlider',{read: Slides}) slides: Slides;

  userProfile: Profile;

  begivenhed = this.eventService.begivenhed;

  slideOpts = { 
    effect: 'slide',
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
      //reverseDirection: true,
    },
    speed: 4000 
  };

  constructor(
    public toastController: ToastController,
    public eventService:BegivenhederService,
    public menu: MenuController,
    public data: DataService,
    public auth: AuthService,
    public router:Router) 
    {
      if(localStorage.getItem("isLoggedIn")==="false"){
        this.router.navigate(['/login']);
        return;
      }
      this.auth.getAuthenticatedUser().subscribe((user: User) => {
        this.data.getProfile(user).subscribe((profile: Profile) => {
          this.userProfile = profile;
          console.log(this.userProfile);
        })
      })
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Your settings have been saved.',
      duration: 2000
    });
    toast.present();
  }

  slidesDidLoad(){
    this.slides.startAutoplay();
  }

  ngOnInit() {
    this.menu.enable(true);
  }


}
