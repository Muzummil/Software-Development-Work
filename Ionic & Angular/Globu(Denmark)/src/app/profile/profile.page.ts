import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { DataService } from '../core/data.service';
import { User } from 'firebase/app';
import { Profile } from '../../models/profile';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

userProfile: any;

  constructor(
    public auth: AuthService,
    public data: DataService,

    ) { 
    this.auth.getAuthenticatedUser().subscribe((user: User) => {
      this.data.getProfile(user).subscribe((profile: Profile) => {
        this.userProfile = profile;
        console.log(this.userProfile);
       });
      });
  }

  ngOnInit() {
  }

  



}
