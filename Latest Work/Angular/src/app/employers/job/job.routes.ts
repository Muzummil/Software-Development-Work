import { ListJobsComponent } from './listJobs/listJobs.component';
import { AddEditJobComponent } from './addEditJob/addEditJob.component';
import { JobsDetailsComponent } from './jobDetails/jobDetails.component';
import { JobsApplicantsComponent } from './jobApplicants/jobApplicants.component';
import { SuggestedApplicantsComponent } from './suggestedApplications/suggestedApplicants.component';

import { RouterModule } from '@angular/router';

// Guards
import { CanEmpActivateGuard } from '../../canEmpActivateGuard.guard';

export const JobRoutingModule = RouterModule.forChild([
    {
        path: '',
        component: ListJobsComponent,
        canActivate: [CanEmpActivateGuard]
    },
    {
        path: ':id/edit',
        component: AddEditJobComponent,
        canActivate: [CanEmpActivateGuard]
    }, {
        path: ':id/display',
        component: JobsDetailsComponent,
        canActivate: [CanEmpActivateGuard]
    }, {
        path: 'add',
        component: AddEditJobComponent,
        canActivate: [CanEmpActivateGuard]
    }
    , {
        path: ':id/:jobTitle/applicants',
        component: JobsApplicantsComponent,
        data: { isShortnRejectList: true },
        canActivate: [CanEmpActivateGuard]
    }
    , {
        path: ':id/:jobTitle/suggest-candidates',
        component: SuggestedApplicantsComponent
    }
    , {
        path: ':id/:jobTitle',
        component: JobsDetailsComponent,
        canActivate: [CanEmpActivateGuard]
    }, {
        path: ':jobTitle-id',
        component: JobsDetailsComponent,
        canActivate: [CanEmpActivateGuard]
    },


]);
