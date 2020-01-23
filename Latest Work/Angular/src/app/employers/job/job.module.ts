import { NgModule } from '@angular/core';
import { FileUploadModule } from 'ng2-file-upload/ng2-file-upload';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { JobsDetailsComponent } from './jobDetails/jobDetails.component';
import { DonutAnimateComponent } from '../../shared/directives/donutAnimate.component';

// Services
import { LoaderService } from '../../shared/services/loader.service';
import { StatsService } from '../../core/services/stats.service';
import { CompanyService } from '../../core/services/company.service';
import { JobService } from '../../core/services/job.service';

// Routes
import { JobRoutingModule } from './job.routes';

// Components
import { ListJobsComponent } from './listJobs/listJobs.component';
import { AddEditJobComponent } from './addEditJob/addEditJob.component';
import { JobsApplicantsComponent } from './jobApplicants/jobApplicants.component';
import { SuggestedApplicantsComponent } from './suggestedApplications/suggestedApplicants.component';
import { FilterAppliedCandidateComponent } from './filterAppliedCandidate/filterAppliedCandidate.component';
import { ElementBlockModule } from '../../shared/elementBlock.module';
import { PaginationModule } from '../../shared/pagination.module';
import { SocialMediaModule } from '../../shared/socialMedia.module';
import { FolderToolBarModule } from '../folderSystem/folderToolsBar/folderToolBar.module';
import {FiltersWithCandidatesCountComponent} from "./filtersWithCandidatesCount/filtersWithCandidatesCount.component";

@NgModule({
    imports: [JobRoutingModule,
        CommonModule,
        FormsModule,
        FileUploadModule,
        ElementBlockModule,
        SocialMediaModule,
        PaginationModule,
        ReactiveFormsModule,
        FolderToolBarModule,
        SharedModule],
    providers: [LoaderService, StatsService, CompanyService, JobService],
    declarations: [ListJobsComponent, DonutAnimateComponent, AddEditJobComponent,
        JobsDetailsComponent, JobsApplicantsComponent, FilterAppliedCandidateComponent,
        FiltersWithCandidatesCountComponent, SuggestedApplicantsComponent],
    exports: []
})

export class JobModule {

}
