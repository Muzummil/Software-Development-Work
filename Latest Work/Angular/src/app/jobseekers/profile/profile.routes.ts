import { RouterModule } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { CanJobActivateGuard } from '../../canJobActivateGuard.guard';
import { CanAuthActivateGuard } from '../../canAuthActivateGuard.guard';
import { CanAuthActivateProfileGuard } from '../../canAuthActivateProfileGuard.guard';

export const ProfileRoutes = RouterModule.forChild([
    {
        path: '',
        component: ProfileComponent,
        canActivate: [CanJobActivateGuard, CanAuthActivateProfileGuard]
    },
    {
        path: ':completion_mode',
        component: ProfileComponent,
        canActivate: [CanJobActivateGuard, CanAuthActivateProfileGuard]
    },
    {
        path: ':invite-connections',
        component: ProfileComponent,
        canActivate: [CanJobActivateGuard, CanAuthActivateGuard]
    }
]);