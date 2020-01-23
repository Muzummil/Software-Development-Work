import { Injectable } from '@angular/core';
import { AngularFirestoreDocument, AngularFirestore,  } from "@angular/fire/firestore";
import { User } from "firebase/app";
import { Profile } from "../../models/profile"
import { Observable} from "Rxjs";
import { AngularFireAuth } from "@angular/fire/auth";
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  uid: string;
  private profileObject: AngularFirestoreDocument<Profile>;
  profileFire: Observable<Profile>;

  constructor(private afs: AngularFirestore, public auth: AngularFireAuth) { }

  getProfile(user: User) {
    this.profileObject = this.afs.doc(`/users/${this.auth.auth.currentUser.uid}`);
    console.log(this.profileObject);
    return this.profileObject.valueChanges();
  }

  async saveProfile(user: User, profile: Profile) {
    this.profileObject = this.afs.doc(`/users/${user.uid}`);

    try {
      await this.profileObject.set(profile);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }


}







