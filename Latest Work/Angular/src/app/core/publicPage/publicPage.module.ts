// angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';

// Modules
import { SharedModule } from '../../shared/shared.module';
import { GeneralModule } from './general.module';

// Services
import { SignupService } from './services/signup.service';
import { LoaderService } from '../../shared/services/loader.service';
import { CompanyService } from '../services/company.service';
import { JobService } from '../services/job.service';
import { JobseekerJobService } from '../../jobseekers/job/services/jobseekerJob.service';

// Components

import { LoginComponent } from './login/login.component';
import { ElementBlockModule } from '../../shared/elementBlock.module';
import { ForgetPasswordComponent } from './forgotPassword/forgetPassword.component';
import { CareersComponent } from './careers/careers.component';
import { ResendConfirmationComponent } from './resendConfirmation/resendConfirmation.component';
import { ChangePasswordComponent } from './changePassword/changePassword.component';
import { SigninSocialComponent } from './signinSocial/signinSocial.component';
import { TruncatePipeModule } from '../../shared/truncatePipe.module';
import { SwitchLanguageModule } from '../../switch_language/switchLanguage.module';
import { BaseCareersComponent } from './baseCareers/baseCareers.component';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        GeneralModule,
        ReactiveFormsModule,
        TruncatePipeModule,
        ElementBlockModule,
        SwitchLanguageModule
    ],
    declarations: [
        LoginComponent,
        SigninSocialComponent,
        ForgetPasswordComponent,
        ResendConfirmationComponent,
        ChangePasswordComponent,
        CareersComponent,
        BaseCareersComponent
    ],
    providers: [
        SignupService,
        LoaderService,
        FormBuilder,
        CompanyService,
        JobService,
        JobseekerJobService
    ]
})
export class PublicPageModule {

}
