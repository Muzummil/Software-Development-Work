// angular
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { VideoInterviewRoutes } from './videoInterview.routes';

// Components
import { InterviewComponent } from './interview/interview.component';

// Modules
import { SharedModule } from '../shared/shared.module';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        VideoInterviewRoutes,
        ReactiveFormsModule,
        SharedModule

    ],
    declarations: [
        InterviewComponent
    ],
    providers: [
        FormBuilder
    ],

    exports: []
})
export class VideoInterviewModule {

    constructor(@Optional() @SkipSelf() parentModule: VideoInterviewModule) {
        if (parentModule) {
            throw new Error('VideoInterviewModule already loaded; Import in root module only.');
        }
    }
}
