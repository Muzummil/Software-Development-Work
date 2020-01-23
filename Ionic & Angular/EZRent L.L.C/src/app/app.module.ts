import { PopoverPage } from './../pages/popover/popover';
import { PopupService } from './../services/popup.service';
import { DetailedNotificationsPage } from '../pages/notifications/detailed-notifications/detailed-notifications';
import { NotificationsPage } from './../pages/notifications/notifications';
import { HandymanOperationsPage } from '../pages/handyman/handyman-operations/handyman-operations';
import { HandymanService } from './../services/handyman.service';
import { DisputesService } from './../services/disputes.service';
import { CreateDisputePage } from './../pages/dispute-managment/create-dispute/create-dispute';
import { EditDisputePage } from '../pages/dispute-managment/edit-dispute/edit-dispute';
import { ReceivedDisputesPage } from '../pages/dispute-managment/received-disputes/received-disputes';
import { DetailedMaintenanceRequestsPage } from './../pages/maintenance-requests/detailed-maintenance-requests/detailed-maintenance-requests';
import { EditMaintenanceRequestPage } from './../pages/maintenance-requests/edit-maintenance-request/edit-maintenance-request';
import { SentMaintenanceRequestsPage } from './../pages/maintenance-requests/sent-maintenance-requests/sent-maintenance-requests';
import { ReceivedMaintenanceRequestsPage } from './../pages/maintenance-requests/received-maintenance-requests/received-maintenance-requests';
import { CreateMaintenanceRequestPage } from './../pages/maintenance-requests/create-maintenance-request/create-maintenance-request';
import { RequestDetailsPage } from './../pages/request-details/request-details';
import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
// import pages
import { HomePage } from '../pages/home/home';
import { verifyNumber } from '../pages/verify-number/verify-number';
import { verifyCode } from '../pages/verify-code/verify-code';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { ChangePassPage } from '../pages/change-password/change-password';
import { userCategory } from '../pages/user-category/user-category';
import { PropertySetupPage } from '../pages/property-setup/property-setup'
import { AppartmentSetupPage } from '../pages/apartment-setup/apartment-setup';
import { TermsCondtionsPage } from '../pages/terms-conditions/terms-conditions';
import { InviteTenantPage } from '../pages/invite-tenant/invite-tenant';
import { AppartmentPreviewPage } from '../pages/appartmentPreview.ts/appartmentPreview';
import { LandloardBuildingPage } from '../pages/landloard-building/landloard-building';
import { InviteVerify } from '../pages/invite-verify/invite-verify';
import { PaymentsPage } from '../pages/payments/payments';
import { TenantSuccessPage } from '../pages/tenant-success/tenant-success';
import { ProfileUpdate } from '../pages/profile-update/profile-update';
import { AboutUsPage } from '../pages/about-us/about-us';
import { GetHelpPage } from '../pages/get-help/get-help';
import { UserDetailsPage } from '../pages/user-details/user-details';
import { TenantMsgPage } from '../pages/tenant-msg/tenant-msg';
import { AllTenantsPage } from '../pages/all-tenants/all-tenants';
import { GetAllApartmentsPage } from '../pages/all-apartment/all-apartment';
import { ApartmentTenantsPage } from '../pages/apartment-tenants/apartment-tenants';
import { PaymentsAccountPage } from '../pages/payments-account/payments-account';
import { PaymentsBankPage } from '../pages/payments-bank/payments-bank';
import { UpdatePaymentPage } from '../pages/update-payment/update-payment';
import { RemindersPage } from '../pages/reminders/reminders';
import { EditReminderPage } from '../pages/edit-reminder/edit-reminder';
import { RequestsPage } from '../pages/requests/requests';
import { SentRequestsPage } from '../pages/sent-requests/sent-requests';
import { ReceivedRequestsPage } from '../pages/received-requests/received-requests';
import { CreateRequestPage } from '../pages/create-request/create-request';
import { EditRequestPage } from '../pages/edit-request/edit-request';

// end import pages

//Services

import { UserService } from '../services/user.service';
import { UserSelectionService } from '../services/user-selection-service';
import { AppartementService } from '../services/appartement.service';
import { BuildingService } from '../services/buildings.service';
import { DwollaService } from '../services/dwolla.service';
import { LandloardService } from '../services/landloard.service';
import { TenancyService } from '../services/tenancy.service';
import { TenantService } from '../services/tenant.service';
import { RequestsService } from '../services/requests.service';
import { LocalStorageService } from '../services/local-storage.service';
import { TenantInvitationService } from '../services/tenant-invitation.service';
import { LoaderService } from '../services/loader-service';
import { RemindersService } from '../services/remider.service';
import { AppConfig } from '../config/app-config';
import { HttpClient } from "../providers/http-client";
import {
  UserEffects,
  AuthEffects,
  userSelectionEffects,
  AppartementEffects,
  BuildingEffects,
  DwollaEffects,
  LandloardEffects,
  TenancyEffects,
  TenantEffects,
  TenantInvitationEffects,
} from '../effects';

import {
  UserActions,
  AuthActions,
  UserSelectionActions,
  AppartementActions,
  BuildingActions,
  DwollaActions,
  LandloardActions,
  TenancyActions,
  TenantActions,
  InvitationActions
} from '../actions';


import { StoreModule } from '@ngrx/store';
import reducer from '../reducers';
import { EffectsModule } from '@ngrx/effects';
import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';
import { Facebook } from '@ionic-native/facebook';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { AccountAssociationPage } from '../pages/account-association/account-association';
import { MaintenanceRequestsPage } from '../pages/maintenance-requests/maintenance-requests';
import { DisputeManagmentPage } from '../pages/dispute-managment/dispute-managment';
import { SentDisputesPage } from '../pages/dispute-managment/sent-disputes/sent-disputes';
import { DetailedDisputesPage } from '../pages/detailed-disputes/detailed-disputes';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { HandymanPage } from '../pages/handyman/handyman';
import { DetailedHandymanPage } from '../pages/handyman/detailed-handyman/detailed-handyman';
import { NotificationService } from '../services/notification.service';
import { SearchFilterPipe } from '../pages/search-filter.pipe';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    verifyNumber,
    verifyCode,
    LoginPage,
    RegisterPage,
    ChangePassPage,
    NotificationsPage,
    SearchFilterPipe,
    DetailedNotificationsPage,
    userCategory,
    PopoverPage,
    PropertySetupPage,
    AppartmentSetupPage,
    TermsCondtionsPage,
    InviteTenantPage,
    CreateMaintenanceRequestPage,
    EditRequestPage,
    AppartmentPreviewPage,
    DetailedMaintenanceRequestsPage,
    LandloardBuildingPage,
    EditReminderPage,
    MaintenanceRequestsPage,
    SentMaintenanceRequestsPage,
    InviteVerify,
    HandymanPage,
    SentDisputesPage,
    EditDisputePage,
    RequestDetailsPage,
    DetailedHandymanPage,
    ReceivedMaintenanceRequestsPage,
    CreateRequestPage,
    PaymentsPage,
    DetailedDisputesPage,
    RemindersPage,
    DisputeManagmentPage,
    EditMaintenanceRequestPage,
    TenantSuccessPage,
    ReceivedDisputesPage,
    ProfileUpdate,
    CreateDisputePage,
    RequestsPage,
    AboutUsPage,
    GetHelpPage,
    DetailedHandymanPage,
    HandymanOperationsPage,
    SentRequestsPage,
    ReceivedRequestsPage,
    UserDetailsPage,
    TenantMsgPage,
    AllTenantsPage,
    GetAllApartmentsPage,
    PaymentsAccountPage,
    PaymentsBankPage,
    UpdatePaymentPage,
    ApartmentTenantsPage,
    AccountAssociationPage
  ],
  imports: [
    HttpModule,
    BrowserModule,
    IonicModule.forRoot(MyApp),
    StoreModule.provideStore(reducer),
    EffectsModule.run(UserEffects),
    EffectsModule.run(AuthEffects),
    EffectsModule.run(userSelectionEffects),
    EffectsModule.run(AppartementEffects),
    EffectsModule.run(BuildingEffects),
    EffectsModule.run(DwollaEffects),
    EffectsModule.run(LandloardEffects),
    EffectsModule.run(TenancyEffects),
    EffectsModule.run(TenantEffects),
    EffectsModule.run(TenantInvitationEffects),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    verifyNumber,
    verifyCode,
    LoginPage,
    PopoverPage,
    RegisterPage,
    ChangePassPage,
    RequestsPage,
    userCategory,
    EditMaintenanceRequestPage,
    PropertySetupPage,
    DisputeManagmentPage,
    MaintenanceRequestsPage,
    AppartmentSetupPage,
    EditDisputePage,
    DetailedNotificationsPage,
    NotificationsPage,
    DetailedDisputesPage,
    TermsCondtionsPage,
    ReceivedMaintenanceRequestsPage,
    RequestDetailsPage,
    InviteTenantPage,
    HandymanPage,
    SentDisputesPage,
    CreateDisputePage,
    EditReminderPage,
    DetailedHandymanPage,
    ReceivedDisputesPage,
    AppartmentPreviewPage,
    SentMaintenanceRequestsPage,
    LandloardBuildingPage,
    InviteVerify,
    PaymentsPage,
    RemindersPage,
    CreateMaintenanceRequestPage,
    EditRequestPage,
    CreateRequestPage,
    DetailedMaintenanceRequestsPage,
    TenantSuccessPage,
    ProfileUpdate,
    PaymentsAccountPage,
    PaymentsBankPage,
    UpdatePaymentPage,
    SentRequestsPage,
    ReceivedRequestsPage,
    HandymanOperationsPage,
    AboutUsPage,
    GetHelpPage,
    UserDetailsPage,
    TenantMsgPage,
    AllTenantsPage,
    GetAllApartmentsPage,
    ApartmentTenantsPage,
    AccountAssociationPage
  ],
  providers: [
    Facebook,
    AppConfig,
    UserService,
    AppartementService,
    BuildingService,
    DisputesService,
    RequestsService,
    DwollaService,
    LandloardService,
    TenancyService,
    TenantService,
    RemindersService,
    LocalNotifications,
    TenantInvitationService,
    UserSelectionService,
    LocalStorageService,
    LoaderService,
    UserActions,
    AuthActions,
    UserSelectionActions,
    AppartementActions,
    BuildingActions,
    DisputeManagmentPage,
    AboutUsPage,
    DwollaActions,
    LandloardActions,
    SentMaintenanceRequestsPage,
    PaymentsAccountPage,
    ReceivedMaintenanceRequestsPage,
    PaymentsBankPage,
    EditRequestPage,
    DetailedDisputesPage,
    CreateDisputePage,
    EditDisputePage,
    DetailedHandymanPage,
    SentDisputesPage,
    NotificationsPage,
    DetailedNotificationsPage,
    ReceivedDisputesPage,
    HandymanOperationsPage,
    CreateMaintenanceRequestPage,
    DetailedMaintenanceRequestsPage,
    RequestDetailsPage,
    UpdatePaymentPage,
    EditMaintenanceRequestPage,
    EditReminderPage,
    MaintenanceRequestsPage,
    RemindersPage,
    PopoverPage,
    HandymanPage,
    TenancyActions,
    TenantActions,
    PopupService,
    NotificationService,
    HandymanService,
    InvitationActions,
    StatusBar,
    HttpClient,
    SplashScreen,
    ScreenOrientation
    /* import services */
  ]
})
export class AppModule {
}
