import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, RouteReuseStrategy, Routes } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BegivenhederService } from '../services/begivenheder.service';

// IMPORT FIREBASE SETTINGS FROM ENVIRONMENTS
// AngularFireModule is the main firebase 
// Environments are the specific firebase settings.

import { AngularFireModule } from "@angular/fire";
import { environment  } from "../environments/environment";

import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFireStorageModule } from "@angular/fire/storage";
import { AngularFireAuthModule} from "@angular/fire/auth";
import { AngularFireDatabaseModule } from "@angular/fire/database";
import { CoreModule } from './core/core.module';

// Importere Forms modulet ellers virker formsGroup ikke i appen
import {  ReactiveFormsModule } from '@angular/forms';
import {  FormsModule } from "@angular/forms";
import { SidemenuPageModule } from './sidemenu/sidemenu.module';


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireStorageModule, // imports firebase/storage only needed for storage features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features
    AngularFireDatabaseModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    CoreModule,
    SidemenuPageModule
    
  ],
  providers: [
    StatusBar,
    SplashScreen,
    BegivenhederService,
    AngularFireDatabaseModule,
    FormsModule,
    ReactiveFormsModule,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}