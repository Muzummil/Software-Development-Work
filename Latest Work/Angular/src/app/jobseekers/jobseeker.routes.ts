import { RouterModule } from '@angular/router';
import { CanAuthActivateGuard } from '../canAuthActivateGuard.guard';
import { CanAuthActivateProfileGuard } from '../canAuthActivateProfileGuard.guard';

export const JobSeekerRoutes = RouterModule.forChild([

    {
        path: 'settings',
        loadChildren: '../core/account/account.module#AccountModule',
        canActivate: [CanAuthActivateGuard]
    },
    {
        path: 'complete-profile',
        loadChildren: './completeProfileFourSteps/completeProfileFourSteps.module' +
            '#CompleteProfileFourStepsModule'
    },
    {
        path: 'companies',
        loadChildren: './company/company.module#CompanyModule',
        canActivate: [CanAuthActivateGuard]
    },
    {path: 'career-fairs', loadChildren: './careerFair/careerFair.module#CareerFairModule',
        canActivate: [CanAuthActivateGuard]},
    {path: 'jobs', loadChildren: './job/job.module#JobModule', canActivate: [CanAuthActivateGuard]},
    {
        path: ':country/jobs',
        loadChildren: './job/job.module#JobModule',
        canActivate: [CanAuthActivateGuard]
    },
    {
        path: 'profile',
        loadChildren: './profile#ProfileModule',
        canActivate: [CanAuthActivateProfileGuard]
    },

]);
