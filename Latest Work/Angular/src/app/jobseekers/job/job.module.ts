// angular
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ResumeCoverService } from '../profile/services/resume_cover.services';

// Routes
import { JobRoutes } from './job.routes';

// Modules
import { SharedModule } from '../../shared/shared.module';
import { ElementBlockModule } from '../../shared/elementBlock.module';
import { SearchTagModule } from '../../shared/searchTag.module';
import { PaginationModule } from '../../shared/pagination.module';
import { DatePipeModule } from '../../shared/datePipe.module';
import { SocialMediaModule } from '../../shared/socialMedia.module';
import { AnimateCircleModule } from '../../shared/animateCircle.module';
// Services
import { AccountService } from '../../core/account/services/account.service';
import { LoaderService } from '../../shared/services/loader.service';
import { JobseekerJobService } from '../job/services/jobseekerJob.service';
import { Location } from '@angular/common';
import { ConfigService } from '../../shared/config.service';

// Components
import { Filter1Component } from './filter1/filter1.component';
import { MyJobsComponent } from './myJobs/myJobs.component';
import { MyJobsInterviewsComponent } from './myJobsInterviews/myJobsInterviews.component';
import { AllJobsComponent } from './allJobs/allJobs.component';
import { JobDetailComponent } from './jobDetail/jobDetail.component';
import { ApplyJobComponent } from './applyJob/applyJob.component';
import { JobComponent } from './job/job.component';
import { JobMenuComponent } from './jobMenu/jobMenu.componet';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        ElementBlockModule,
        SearchTagModule,
        PaginationModule,
        DatePipeModule,
        SocialMediaModule,
        AnimateCircleModule,
        JobRoutes
    ],
    declarations: [
        Filter1Component,
        JobMenuComponent,
        AllJobsComponent,
        ApplyJobComponent,
        MyJobsInterviewsComponent,
        MyJobsComponent,
        JobDetailComponent,
        JobComponent
    ],
    providers: [
        AccountService,
        ResumeCoverService,
        Location,
        FormBuilder,
        ConfigService,
        LoaderService,
        JobseekerJobService
    ],

    exports: []
})
export class JobModule {

    constructor(@Optional() @SkipSelf() parentModule: JobModule) {
        if (parentModule) {
            throw new Error('JobModule already loaded; Import in root module only.');
        }
    }
}
