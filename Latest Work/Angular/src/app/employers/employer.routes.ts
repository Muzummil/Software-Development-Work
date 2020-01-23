import { RouterModule } from '@angular/router';

import { CompanyInterviewComponent }
from './interview/companyInterview/companyInterviews.component';
import { CanLoadFolderGuard } from './canLoadFolderGuard.guard';

export const EmployerRoutes = RouterModule.forChild([

    {path: 'interviews', component: CompanyInterviewComponent},
    {path: 'profile', loadChildren: './profile/profile.module#ProfileModule'},
    {path: 'career-fairs',
        loadChildren: './careerFair/careerFairEmployer.module#CareerFairEmployerModule'},
    {path: 'folders', loadChildren: './folderSystem/folderSystem.module#FolderSystemModule',
        canLoad: [CanLoadFolderGuard]},
    {path: 'jobs', loadChildren: '../employers/job/job.module#JobModule'},
    {path: 'candidate', loadChildren: './candidate/candidate.module#CandidateModule'},
    {path: 'dashboard', loadChildren: '../employers/dashboard/dashboard.module#DashboardModule'},
    {path: 'settings', loadChildren: '../core/account/account.module#AccountModule'},
    {path: ':country/jobs/:city/:sector/:jobTitle-id', redirectTo: 'jobs/:jobTitle-id'},
    {path: ':country/jobs', redirectTo: 'jobs'},
    {path: 'companies', redirectTo: 'profile'},
    {path: 'companies/:name_url-id', redirectTo: 'profile'},
    {path: '**', redirectTo: '/404', pathMatch: 'full'},
]);
