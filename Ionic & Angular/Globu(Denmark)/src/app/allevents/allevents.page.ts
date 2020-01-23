import { Component, OnInit, ViewChild } from '@angular/core';
import { BegivenhederService } from '../../services/begivenheder.service';
import { Slides, MenuController } from '@ionic/angular';
import { DataService } from '../core/data.service';
import { AuthService } from '../core/auth.service';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { User } from 'firebase/app';
import { Profile } from '../../models/profile';
import { Begivenhed } from '../../models/begivenhed';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";

export interface BegivenhedsID extends Begivenhed { id: string; }

@Component({
  selector: 'app-allevents',
  templateUrl: './allevents.page.html',
  styleUrls: ['./allevents.page.scss'],
})
export class AlleventsPage implements OnInit {
  @ViewChild('mySlider',{read: Slides}) slides: Slides;

  async slidesDidLoad(){
    await this.slides.startAutoplay();
  }

  slideOpts = { 
    effect: 'slide',
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
      //reverseDirection: true,
    },
    speed: 4000 
  };

  

  userProfile: Profile;
  private begivenhedsSamling: AngularFirestoreCollection<Begivenhed>
  begivenheder: Observable<BegivenhedsID[]>;

  constructor(    
    public eventService:BegivenhederService,
    public menu: MenuController,
    public data: DataService,
    public auth: AuthService,
    private afs: AngularFirestore
    ){ 
    this.auth.getAuthenticatedUser().subscribe((user: User) => {
      this.data.getProfile(user).subscribe((profile: Profile) => {
        this.userProfile = profile;
        console.log(this.userProfile);
       })
      });
    this.begivenhedsSamling = afs.collection<Begivenhed>('events');
    this.begivenheder = this.begivenhedsSamling.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Begivenhed;
        const id = a.payload.doc.id;
        return { id, ...data};
      }))
    );  
  }

  ngOnInit() {
  }



}
