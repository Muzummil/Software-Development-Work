import { SigninSocialComponent } from './signinSocial/signinSocial.component';

import { LoginComponent } from './login/login.component';
import { ForgetPasswordComponent } from './forgotPassword/forgetPassword.component';
import { ResendConfirmationComponent } from './resendConfirmation/resendConfirmation.component';
import { ChangePasswordComponent } from './changePassword/changePassword.component';

import { CanHomeActivateGuard } from '../../canHomeActivateGuard.guard';
import { CareersComponent } from './careers/careers.component';
import { CanLoadLandingPageGuard } from '../../canLoadLandingPageGuard.guard';

let routeList =  [
    {
        path: '',
        component: CareersComponent,
        canActivate: [CanLoadLandingPageGuard],
    },
    {path: 'signin_social', component: SigninSocialComponent, canActivate: [CanHomeActivateGuard]},

    {
        path: 'forgot-password',
        component: ForgetPasswordComponent,
        canActivate: [CanHomeActivateGuard]
    },
    {
        path: 'resend-confirmation',
        component: ResendConfirmationComponent,
        canActivate: [CanHomeActivateGuard]
    },
    {
        path: 'change-password',
        component: ChangePasswordComponent,
        canActivate: [CanHomeActivateGuard]
    },
    {
        path: 'careers',
        component: CareersComponent,
        canActivate: [CanHomeActivateGuard]
    },
    {path: 'login', component: LoginComponent, canActivate: [CanHomeActivateGuard]}

];

export const PublicPageRoutes: Array <any> = routeList;
