import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';

import {
    NgModule,
    ApplicationRef
} from '@angular/core';

import {
    RouterModule,
    PreloadAllModules
} from '@angular/router';

import { PublicPageModule } from './core/publicPage/publicPage.module';
import { DisplayBlockModule } from './shared/displayBlock.module';

/*
 * Platform and Environment providers/directives/pipes
 */
import { ENV_PROVIDERS } from './environment';
import { ROUTES } from './app.routes';
// App is our top level component
import { AppComponent } from './app.component';
import { AppEngComponent } from './app.eng.component';
import { AppArbComponent } from './app.ar.component';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import { AppState, InternalStateType } from './app.service';

import { InvalidPageComponent } from './shared/directives/invalidPage.component';
import { UnAuthPageComponent } from './shared/directives/unAuthPage.component';
import { SwitchPageComponent } from './shared/directives/switchPage.component';
import { RedirectComponent } from './redirect.component';
import { PageTransitionComponent } from './shared/directives/pagetransition.component';

import { AccountService } from './core/account/services/account.service';
import { CookieService } from './core/services/cookie.service';
import { ProfileService } from './core/services/profile.service';
import { DomManupilationService } from './core/services/domManupilation.service';
// service
import { ErrorHandling } from './core/services/errorHandling.service';

// Guards
import { CanEmpActivateGuard } from './canEmpActivateGuard.guard';
import { CanJobActivateGuard } from './canJobActivateGuard.guard';
import { CanExcludeEmpActivateGuard } from './canexcludeEmpActivationGuard.guard';
import { CanHomeActivateGuard } from './canHomeActivateGuard.guard';
import { CanAuthActivateGuard } from './canAuthActivateGuard.guard';
import { AuthGuard } from './authGuard.guard';
import { CanAuthActivateProfileGuard } from './canAuthActivateProfileGuard.guard';
import { CanActivateCompProfileGuard } from './canActivateCompProfileGuard.guard';
import { CanLoadGuard } from './canLoadGuard.guard';

import '../styles/sass/main.scss';
import '../styles/css/bootstrap.css';
import '../styles/css/intlTelInput.css';
import '../styles/fonts/material/material-design.css';
import '../styles/fonts/helvertica/stylesheet.css';
import '../styles/fonts/bloovo-font/bloovo-fonts.css';
import '../styles/css/bootstrap-select.css';

import 'intl';
import 'intl/locale-data/jsonp/en';
import 'jquery';
import 'bootstrap/dist/js/bootstrap';
import 'intl-tel-input/build/js/intlTelInput';
import { CanLoadLandingPageGuard } from './canLoadLandingPageGuard.guard';

// Application wide providers
const APP_PROVIDERS = [
    ...APP_RESOLVER_PROVIDERS,
    AppState,
    AccountService,
    ProfileService,
    DomManupilationService,
    CookieService,
    CanLoadGuard,
    CanEmpActivateGuard,
    CanJobActivateGuard,
    CanExcludeEmpActivateGuard,
    AuthGuard,
    CanHomeActivateGuard,
    CanLoadLandingPageGuard,
    CanAuthActivateGuard,
    CanAuthActivateProfileGuard,
    CanActivateCompProfileGuard,
    ErrorHandling
];

type StoreType = {
    state: InternalStateType,
    restoreInputValues: () => void,
    disposeOldHosts: () => void
};

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
    bootstrap: [AppComponent],
    declarations: [
        AppComponent,
        AppEngComponent,
        AppArbComponent,
        InvalidPageComponent,
        UnAuthPageComponent,
        SwitchPageComponent,
        RedirectComponent,
        PageTransitionComponent,
    ],
    imports: [ // import Angular's modules
        BrowserModule,
        SlimLoadingBarModule.forRoot(),
        PublicPageModule,
        DisplayBlockModule,
        FormsModule,
        HttpClientModule,
        RouterModule.forRoot(ROUTES, {useHash: false, preloadingStrategy: PreloadAllModules}),
    ],
    exports: [SlimLoadingBarModule],
    providers: [ // expose our Services and Providers into Angular's dependency injection
        ENV_PROVIDERS,
        APP_PROVIDERS
    ]
})
export class AppModule {

    constructor(
        public appRef: ApplicationRef,
        public appState: AppState
    ) {
    }

}
