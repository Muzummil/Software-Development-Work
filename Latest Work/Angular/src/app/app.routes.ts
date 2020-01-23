import { Routes } from '@angular/router';
import { InvalidPageComponent } from './shared/directives/invalidPage.component';
import { PublicPageRoutes } from './core/publicPage/publicPage.routes';
import { UnAuthPageComponent } from './shared/directives/unAuthPage.component';
import { SwitchPageComponent } from './shared/directives/switchPage.component';
import { PageTransitionComponent } from './shared/directives/pagetransition.component';

import { LeftsideBarComponent, FooterBarComponent, HeaderBarComponent } from './layout/index';
import { CanLoadGuard } from './canLoadGuard.guard';
import { AuthGuard } from './authGuard.guard';
import { CanHomeActivateGuard } from './canHomeActivateGuard.guard';
import { ConfigService } from './shared/config.service';
import { PolicyComponent } from './core/publicPage/policy.component';
import { PolicyArComponent } from './core/publicPage/policy.ar.component';
import { TermsComponent } from './core/publicPage/terms.component';
import { TermsArComponent } from './core/publicPage/terms.ar.component';

let routes_list = [
    {
        path: 'all-jobs',
        redirectTo: 'jobs'
    },
    {
        path: 'job-seeker',
        redirectTo: 'job-seeker/profile'
        , pathMatch: 'full'
    },
    {path: '404', component: InvalidPageComponent},
    {path: ConfigService.langPathHash['arabic'] + '/terms', component: TermsArComponent},
    {path: 'terms', component: TermsComponent},
    { path:  ConfigService.langPathHash['arabic'] + '/policy', component: PolicyArComponent},
    { path: 'policy', component: PolicyComponent},
    {
        path: 'signup-jobseeker',
        loadChildren: './core/publicPage/shortSignUpJobseeker/' +
            'signupjobseeker.module#SignupJobseekerModule',
        canLoad: [CanLoadGuard],
        canActivate: [CanHomeActivateGuard]
    },
    {
        path: ConfigService.langPathHash['arabic'] + '/signup-jobseeker',
        loadChildren: './core/publicPage/shortSignUpJobseeker/' +
            'signupjobseeker.module#SignupJobseekerModule',
        canLoad: [CanLoadGuard],
        canActivate: [CanHomeActivateGuard]
    },
    {
        path: ConfigService.jobseekerPath,
        loadChildren: './jobseekers#JobseekerModule',
        canLoad: [CanLoadGuard]
    },
    {
        path: 'applications/:application_id/interviews/:interview_id',
        loadChildren: './video_interview/videoInterview.module#VideoInterviewModule',
        canLoad: [CanLoadGuard],
        canActivate: [AuthGuard]
    },
    {
        path: ConfigService.langPathHash['arabic'] +
            '/applications/:application_id/interviews/:interview_id',
        loadChildren: './video_interview/videoInterview.module#VideoInterviewModule',
        canLoad: [CanLoadGuard],
        canActivate: [AuthGuard]
    },
    {
        path: 'signup/:name',
        loadChildren: './core/publicPage/shortSignUpGeneric/' +
            'signupGeneric.module#SignupGenericModule',
        canLoad: [CanLoadGuard],
        canActivate: [CanHomeActivateGuard]
    },
    {
        path: ConfigService.langPathHash['arabic'] + '/signup/:name',
        loadChildren: './core/publicPage/shortSignUpGeneric/' +
            'signupGeneric.module#SignupGenericModule',
        canLoad: [CanLoadGuard],
        canActivate: [CanHomeActivateGuard]
    },
    {
        path: ConfigService.jobseekerPath,
        loadChildren: './jobseekers#JobseekerModule',
        canLoad: [CanLoadGuard]
    },
    {
        path: ConfigService.langPathHash['arabic'] + '/' + ConfigService.jobseekerPath,
        loadChildren: './jobseekers#JobseekerModule',
        canLoad: [CanLoadGuard]
    },
    {
        path: 'employer',
        loadChildren: './employers/employer.module#EmployerModule',
        canLoad: [CanLoadGuard],
        canActivate: [AuthGuard]
    },
    {
        path: 'ar/employer',
        loadChildren: './employers/employer.module#EmployerModule',
        canLoad: [CanLoadGuard]
    },
    // English
    {
        path: 'jobs', loadChildren: './jobseekers/job/job.module#JobModule',
        canLoad: [CanLoadGuard], canActivate: [CanHomeActivateGuard]
    },
    // Arabic
    {
        path: ConfigService.langPathHash['arabic'] + '/jobs',
        loadChildren: './jobseekers/job/job.module#JobModule',
        canLoad: [CanLoadGuard],
        canActivate: [CanHomeActivateGuard]
    },
    // English
    {
        path: ':country/jobs', loadChildren: './jobseekers/job/job.module#JobModule',
        canActivate: [CanHomeActivateGuard]
    },

    // Arabic
    {
        path: ConfigService.langPathHash['arabic'] + '/:country/jobs',
        loadChildren: './jobseekers/job/job.module#JobModule',
        canActivate: [CanHomeActivateGuard]
    },
    {
        path: 'signup-jobseeker',
        loadChildren:
            './core/publicPage/shortSignUpJobseeker/signupjobseeker.module#SignupJobseekerModule',
        canLoad: [CanLoadGuard],
        canActivate: [CanHomeActivateGuard]
    },
    {
        path: ConfigService.langPathHash['arabic'] + '/signup-jobseeker',
        loadChildren:
            './core/publicPage/shortSignUpJobseeker/signupjobseeker.module#SignupJobseekerModule',
        canLoad: [CanLoadGuard],
        canActivate: [CanHomeActivateGuard]
    },

    {
        path: 'jobs', loadChildren: './jobseekers/job/job.module#JobModule',
        canLoad: [CanLoadGuard], canActivate: [CanHomeActivateGuard]
    },
    // English
    {
        path: 'career-fairs',
        loadChildren: './jobseekers/careerFair/careerFair.module#CareerFairModule',
        canLoad: [CanLoadGuard], canActivate: [CanHomeActivateGuard]
    },
    // Arabic
    {
        path: ConfigService.langPathHash['arabic'] + '/career-fairs',
        loadChildren: './jobseekers/careerFair/careerFair.module#CareerFairModule',
        canLoad: [CanLoadGuard],
        canActivate: [CanHomeActivateGuard]
    },
    // English
    {
        path: ConfigService.langPathHash['english'],
        children: [...PublicPageRoutes],
        canLoad: [CanLoadGuard]
    },
    // Arabic
    {
        path: ConfigService.langPathHash['arabic'],
        children: [...PublicPageRoutes],
        canLoad: [CanLoadGuard]
    },
    {path: 'unauthorized', component: UnAuthPageComponent},
    {path: '', component: PageTransitionComponent, outlet: 'transpage'},
    {path: '', component: SwitchPageComponent, outlet: 'switchpage'},
    {path: '', component: HeaderBarComponent, outlet: 'header'},
    {path: '', component: LeftsideBarComponent, outlet: 'leftbar'},
    {path: '', component: FooterBarComponent, outlet: 'footer'},
    {path: '**', redirectTo: '/404', pathMatch: 'full'},
];

export const ROUTES: Routes = routes_list;
