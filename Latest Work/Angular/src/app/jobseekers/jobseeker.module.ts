// angular
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { JobSeekerRoutes } from './jobseeker.routes';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        JobSeekerRoutes,
        ReactiveFormsModule,

    ],
    declarations: [],
    providers: [
        FormBuilder
    ],

    exports: []
})
export class JobseekerModule {

    constructor(@Optional() @SkipSelf() parentModule: JobseekerModule) {
        if (parentModule) {
            throw new Error('JobseekerModule already loaded; Import in root module only.');
        }
    }
}
