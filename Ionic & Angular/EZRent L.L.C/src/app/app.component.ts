import { UserService } from './../services/user.service';
import { NotificationService } from './../services/notification.service';
import { NotificationsPage } from './../pages/notifications/notifications';
import { HandymanPage } from './../pages/handyman/handyman';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { ViewChild } from '@angular/core';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

// import pages
import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { ProfileUpdate } from '../pages/profile-update/profile-update';
import { InviteVerify } from '../pages/invite-verify/invite-verify';
//import { ChangePassPage } from '../pages/change-password/change-password';
import { AboutUsPage } from '../pages/about-us/about-us';
import { GetHelpPage } from '../pages/get-help/get-help';
import { AllTenantsPage } from '../pages/all-tenants/all-tenants';
import { GetAllApartmentsPage } from '../pages/all-apartment/all-apartment';
import { PaymentsPage } from '../pages/payments/payments';
import { LocalStorageService } from '../services/local-storage.service';
import { Store } from "@ngrx/store";
import { AppState } from "../reducers";
import { AuthActions, UserActions } from "../actions";
import { Storage } from "@ionic/storage";
import { Facebook } from '@ionic-native/facebook';
import { RemindersPage } from '../pages/reminders/reminders';
import { RequestsPage } from '../pages/requests/requests';
import { MaintenanceRequestsPage } from '../pages/maintenance-requests/maintenance-requests';
import { DisputeManagmentPage } from '../pages/dispute-managment/dispute-managment';

@Component({
  templateUrl: 'app.html',
  queries: {
    nav: new ViewChild('content')
  }
})
export class MyApp {

  public rootPage: any;

  public nav: any;
  public test:any;

  public pages = [
    {
      title: 'Home (My Properties)',
      icon: 'ios-home-outline',
      count: 0,
      component: HomePage
    },
    {
      title: 'My Apartments',
      icon: 'md-calculator',
      count: 0,
      component: GetAllApartmentsPage
    },
    {
      title: 'My Tenants',
      icon: 'ios-people',
      count: 0,
      component: AllTenantsPage
    },
    {
      title: 'Payments',
      icon: 'ios-card',
      count: 0,
      component: PaymentsPage
    },
    {
      title: 'Reminders',
      icon: 'ios-alarm',
      count: 0,
      component: RemindersPage
    },
    {
      title: 'Requests',
      icon: 'ios-open-outline',
      count: 0,
      component: RequestsPage
    },
    {
      title: 'Maintenance Requests',
      icon: 'ios-construct',
      count: 0,
      component: MaintenanceRequestsPage
    },
    {
      title: 'Dispute Managment',
      icon: 'ios-warning',
      count: 0,
      component: DisputeManagmentPage
    },
    {
      title: 'Handyman',
      icon: 'ios-person',
      count: 0,
      component: HandymanPage
    },
    {
      title: 'Notifications',
      icon: 'ios-notifications',
      count: 0,
      component: NotificationsPage
    },
    // {
    //   title: 'Profile update',
    //   icon: 'ios-contacts',
    //   count: 0,
    //   component: ProfileUpdate
    // },
    // {
    //   title: 'Change Password',
    //   icon: 'ios-contacts',
    //   count: 0,
    //   component: ChangePassPage
    // },
    {
      title: 'About Us',
      icon: 'ios-contacts',
      count: 0,
      component: AboutUsPage
    },
    {
      title: 'Get Help',
      icon: 'ios-help-circle',
      count: 0,
      component: GetHelpPage
    },
    {
      title: 'Logout',
      icon: 'ios-log-out-outline',
      count: 0,
      component: LoginPage
    }
  ];

  public tenantPages = [
    {
      title: 'Home (My Properties)',
      icon: 'ios-home-outline',
      count: 0,
      component: HomePage
    },
    {
      title: 'Invite Verify',
      icon: 'ios-add',
      count: 0,
      component: InviteVerify
    },
    {
      title: 'My Apartments',
      icon: 'md-calculator',
      count: 0,
      component: GetAllApartmentsPage
    },
    {
      title: 'Payments',
      icon: 'ios-card',
      count: 0,
      component: PaymentsPage
    },
    {
      title: 'Reminders',
      icon: 'ios-alarm',
      count: 0,
      component: RemindersPage
    },
    {
      title: 'Requests',
      icon: 'ios-open-outline',
      count: 0,
      component: RequestsPage
    },
    {
      title: 'Maintenance Requests',
      icon: 'ios-construct',
      count: 0,
      component: MaintenanceRequestsPage
    },
    {
      title: 'Dispute Managment',
      icon: 'ios-warning',
      count: 0,
      component: DisputeManagmentPage
    },
    {
      title: 'Notifications',
      icon: 'ios-notifications',
      count: 0,
      component: NotificationsPage
    },
    // {
    //   title: 'Profile update',
    //   icon: 'ios-contacts',
    //   count: 0,
    //   component: ProfileUpdate
    // },
    // {
    //   title: 'Change Password',
    //   icon: 'ios-contacts',
    //   count: 0,
    //   component: ChangePassPage
    // },
    {
      title: 'About Us',
      icon: 'ios-contacts',
      count: 0,
      component: AboutUsPage
    },
    {
      title: 'Get Help',
      icon: 'ios-help-circle',
      count: 0,
      component: GetHelpPage
    },
    {
      title: 'Logout',
      icon: 'ios-log-out-outline',
      count: 0,
      component: LoginPage
    }
  ];


  public user$: any;
  public user: any;
  public userID: any;
  public badgeNumber:number=0;
  constructor(
    private facebook: Facebook,
    platform: Platform,
    statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private store: Store<AppState>,
    public storage: Storage,
    public userService:UserService,
    private authActions: AuthActions,
    private userActions: UserActions,
    public notificationService:NotificationService,
    public screenOrientation:ScreenOrientation,
    public localStorageService: LocalStorageService,
  ) {

    
    
    
    // new test();
    // test.dwolla

    this.rootPage = LoginPage;
    this.store.select("auth").subscribe((auth: any) => {
      if (auth.id_token) {
        this.store.dispatch(this.userActions.getUser());
      }
    });

    // allow user rotate
    // this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      statusBar.overlaysWebView(false);
      if(platform.is('android') || platform.is('ios') || platform.is('windows')){
        try{
          this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
        }catch(e){}
      }
    });
  }

  ngOnInit() {
    // this.splashScreen.hide();
    this.localStorageService.userUpdate.subscribe(response=>{
      this.userID = response;
    });
    
    this.notificationService.notificationSubject.subscribe(response=>{
      this.badgeNumber = response;
    });

    this.user$ = this.store.select("user").subscribe((data: any) => {
      try {
        this.user = data.user.user[0];
        this.localStorageService.set("roleID", this.user.role_id);
        this.userID = this.user.role_id;

      } catch (error) {

      }
    });
  }
  editProfile() {
    this.nav.setRoot(ProfileUpdate);
  }
  openPage(page) {
    if (page.title == "Logout") {
      this.userService.logoutUser.subscribe();
      this.facebook.logout();
      this.store.dispatch(this.authActions.clearLogin());
      this.store.dispatch(this.authActions.logout());
      this.storage.remove("auth_token");
      this.storage.remove("user");
      this.localStorageService.clear();
      this.nav.setRoot(page.component);
      window.location.reload();
    }
    this.nav.setRoot(page.component);
  }
}


