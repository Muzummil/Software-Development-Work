// angular
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { EmployerRoutes } from './employer.routes';
import { CompanyInterviewModule } from './interview/companyInterviews.module';

// Services
import { AlgoliaService } from '../shared/services/algolia.service';
import { CanLoadFolderGuard } from './canLoadFolderGuard.guard';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        EmployerRoutes,
        CompanyInterviewModule,
        ReactiveFormsModule,

    ],
    declarations: [],
    providers: [
        FormBuilder,
        AlgoliaService,
        CanLoadFolderGuard,
    ],

    exports: []
})
export class EmployerModule {

    constructor(@Optional() @SkipSelf() parentModule: EmployerModule) {
        if (parentModule) {
            throw new Error('EmployerModule already loaded; Import in root module only.');
        }
    }
}
