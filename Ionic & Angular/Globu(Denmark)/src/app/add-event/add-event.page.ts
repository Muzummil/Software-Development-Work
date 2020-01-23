import { Component, OnInit } from '@angular/core';
import { User } from 'firebase/app';
import { Profile } from '../../models/profile';
import { BegivenhederService } from '../../services/begivenheder.service';
import { MenuController } from '@ionic/angular';
import { DataService } from '../core/data.service';
import { AuthService } from '../core/auth.service';
import { Begivenhed } from '../../models/begivenhed';
import { AngularFirestore } from "@angular/fire/firestore";

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.page.html',
  styleUrls: ['./add-event.page.scss'],
})
export class AddEventPage implements OnInit {


  userProfile: Profile;
  begivenhed = {} as Begivenhed;

  constructor(  
    public eventService:BegivenhederService,
    public menu: MenuController,
    public data: DataService,
    public auth: AuthService,
    private afs: AngularFirestore) {
      this.auth.getAuthenticatedUser().subscribe((user: User) => {
        this.data.getProfile(user).subscribe((profile: Profile) => {
          this.userProfile = profile;
          console.log(this.userProfile);
         })
        })
        
     }

  ngOnInit() {
  }

  addEvent(){
    const unigKey = this.afs.createId();
    console.log(unigKey);

    const Allebegivenheder = this.afs.collection<Begivenhed>('events');
    Allebegivenheder.add(this.begivenhed);
    console.log(this.begivenhed);
  }

}
