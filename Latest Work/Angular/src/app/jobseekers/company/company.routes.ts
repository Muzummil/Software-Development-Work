import { RouterModule } from '@angular/router';
import { CompanyComponent } from '../company/company/company.component';
import { CanJobActivateGuard } from '../../canJobActivateGuard.guard';

export const CompanyRoutes = RouterModule.forChild([
    {path: '', component: CompanyComponent, canActivate: [CanJobActivateGuard]},
    {
        path: 'top-followed-companies',
        component: CompanyComponent,
        canActivate: [CanJobActivateGuard]
    },
    {path: 'sector/:sector_name', component: CompanyComponent, canActivate: [CanJobActivateGuard]},
    {
        path: 'country/:country_name',
        component: CompanyComponent,
        canActivate: [CanJobActivateGuard]
    },
    {path: ':name_url-id', component: CompanyComponent, canActivate: [CanJobActivateGuard]},
    {path: ':id/:name_url', component: CompanyComponent, canActivate: [CanJobActivateGuard]},
    {path: 'details/:id', component: CompanyComponent, canActivate: [CanJobActivateGuard]},

]);
