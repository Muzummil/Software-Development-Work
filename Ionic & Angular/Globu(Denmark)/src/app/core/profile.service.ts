import { Injectable } from '@angular/core';

import { AuthService } from "./auth.service";

import { AngularFireDatabase } from "@angular/fire/database";
import { Observable } from 'rxjs';

interface profileStorageUser {
  uid: string;
  email: string;
  forename?: string;
  lastname?: string;
  birthday?: string;
  photoURL?: string;
  antalBegivenheder?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  Profile_UID: string;
  Profile_FORNAME: string;
  Profile_LASTNAME: string;
  Profile_EMAIL: string;


  constructor() { 
  }
}
