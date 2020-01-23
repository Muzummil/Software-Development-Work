import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthService } from "./auth.service";
import { ProfileService } from "./profile.service";

import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { DataService } from './data.service';

@NgModule({
  imports: [
    CommonModule,
    AngularFireAuthModule,
    AngularFirestoreModule
  ],
  declarations: [],
  providers: [AuthService, ProfileService, DataService]
})
export class CoreModule { }
