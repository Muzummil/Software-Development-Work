// import {IonicStorageModule} from '@ionic/storage';
// import {StatusBar} from '@ionic-native/status-bar';
// import {SplashScreen} from '@ionic-native/splash-screen';
// import {Keyboard} from '@ionic-native/keyboard';

// import {ActivityService} from "../services/activity-service";
// import {TripService} from "../services/trip-service";
// import {WeatherProvider} from "../services/weather";


import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpClientModule } from '@angular/common/http';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { SettingsPage } from '../pages/settings/settings';
import { AttendancePage } from '../pages/attendance/attendance';
import { SharedModule} from './shared';
import { HttpModule, JsonpModule } from '@angular/http';
import { UserService,GeneralService,CacheService,AppLocalStorage} from './shared/services';
// import {LocalWeatherPage} from "../pages/local-weather/local-weather";

// import services
// end import services
// end import services

// import pages
// end import pages

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    AttendancePage,
    SettingsPage
  ],
  imports: [
    BrowserModule,
    SharedModule,
    HttpClientModule,
    JsonpModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {
      scrollPadding: false,
      scrollAssist: true,
      autoFocusAssist: false
    })
    // IonicStorageModule.forRoot({
    //   name: '__ionic3_start_theme',
    //     driverOrder: ['indexeddb', 'sqlite', 'websql']
    // })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    AttendancePage,
    SettingsPage
  ],
  providers: [
    StatusBar,
    UserService,
    GeneralService,
    CacheService,
    AppLocalStorage,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})

export class AppModule {
}
