import { RouterModule } from '@angular/router';
import { SignupJobseekerComponent } from './signupJobseeker.component';

import { CanHomeActivateGuard } from '../../../canHomeActivateGuard.guard';
import { SignupFormJobseekerComponent } from './signupFormJobseeker.component';

export const SignupjobseekerRoutes = RouterModule.forChild([
    {path: '', component: SignupFormJobseekerComponent,
        canActivate: [CanHomeActivateGuard]},
    {path: 'channel', component: SignupJobseekerComponent, canActivate: [CanHomeActivateGuard]},
]);
