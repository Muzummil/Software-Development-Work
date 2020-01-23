// angular
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';

// Modules
import { SharedModule } from '../../../shared/shared.module';

// Services
import { SignupService } from '../services/signup.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { CompanyService } from '../../services/company.service';
import { JobService } from '../../services/job.service';
import { ElementBlockModule } from '../../../shared/elementBlock.module';

import { ImageCropperModule } from 'ng2-img-cropper/src/imageCropperModule';
import { SwitchLanguageModule } from '../../../switch_language/switchLanguage.module';
import { SignupGenericComponent } from './signupGeneric.component';

// Routes
import { SignupGenericRoutes } from './signupGeneric.routes';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule,
        SignupGenericRoutes,
        ImageCropperModule,
        ElementBlockModule,
        SwitchLanguageModule
    ],
    declarations: [
        SignupGenericComponent
    ],
    providers: [
        SignupService,
        LoaderService,
        FormBuilder,
        CompanyService,
        JobService
    ]
})
export class SignupGenericModule {

    constructor(@Optional() @SkipSelf() parentModule: SignupGenericModule) {
        if (parentModule) {
            throw new Error('SignupGenericModule already loaded; Import in root module only.');
        }
    }
}
