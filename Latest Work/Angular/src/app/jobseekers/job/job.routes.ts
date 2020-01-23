import { RouterModule } from '@angular/router';
import { JobComponent } from '../job/job/job.component';
import { AllJobsComponent } from '../job/allJobs/allJobs.component';
import { MyJobsComponent } from '../job/myJobs/myJobs.component';
import { MyJobsInterviewsComponent } from '../job/myJobsInterviews/myJobsInterviews.component';
import { ApplyJobComponent } from '../job/applyJob/applyJob.component';
import { CanJobActivateGuard } from '../../canJobActivateGuard.guard';

export const JobRoutes = RouterModule.forChild([
    {path: '', component: AllJobsComponent, canActivate: [CanJobActivateGuard]},
    {path: 'all', redirectTo: ''},
    {path: 'my-jobs', component: MyJobsComponent, canActivate: [CanJobActivateGuard]},
    {path: 'interviews', component: MyJobsInterviewsComponent, canActivate: [CanJobActivateGuard]},
    {
        path: 'country/:locations/:country_name', component: AllJobsComponent, canActivate:
            [CanJobActivateGuard]
    },
    {path: 'sector/:sector_name', component: AllJobsComponent, canActivate: [CanJobActivateGuard]},
    {
        path: ':city-name/:sector_name/:jobTitle-id', component: JobComponent,
        canActivate: [CanJobActivateGuard]
    },
    {path: ':jobTitle-id', component: JobComponent, canActivate: [CanJobActivateGuard]},
    {path: ':mode', component: JobComponent, canActivate: [CanJobActivateGuard]},
    {path: 'apply/:id', component: ApplyJobComponent, canActivate: [CanJobActivateGuard]},
    {path: 'details/:id', component: JobComponent, canActivate: [CanJobActivateGuard]},
    {path: ':id/:jobTitle', component: JobComponent, canActivate: [CanJobActivateGuard]},
    {path: ':id/display', component: JobComponent, canActivate: [CanJobActivateGuard]},

]);
