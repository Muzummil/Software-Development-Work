import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { FormsModule   }   from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { AttendancePage } from '../pages/attendance/attendance';
import { SharedModule} from './shared';
import { HttpModule, JsonpModule } from '@angular/http';
import { UserService,GeneralService,CacheService,AppLocalStorage} from './shared/services';
// import { LoginPageModule } from ''
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    AttendancePage
  ],
  imports: [
    BrowserModule,
    SharedModule,
    HttpClientModule,
    JsonpModule,
    HttpModule,
    // UserService,
    // GeneralService,
    // CacheService,
    // AppLocalStorage,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    AttendancePage
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
export class AppModule {}
