import { CompanyComponent } from './company/company.component';
import { CompanyEditComponent } from './companyEdit/companyEdit.component';
import { CandidateComponent } from './candidate/candidate.component';
import { CompanyUsersComponent } from './companyUsers/companyUsers.component';
import { CompanyUserAddEditComponent } from './companyUserAddEdit/companyUserAddEdit.component';
import { CompanyUserReportComponent } from './companyUserReport/companyUserReport.component';
import { RouterModule } from '@angular/router';

// Guards
import { CanEmpActivateGuard } from '../../canEmpActivateGuard.guard';

export const ProfileRoutingModule = RouterModule.forChild([
    {
        path: '',
        redirectTo: 'users',
        pathMatch: 'full'
    },
    {
        path: 'edit',
        component: CompanyEditComponent,
        canActivate: [CanEmpActivateGuard]
    },
    {
        path: 'users',
        component: CompanyUsersComponent,
        canActivate: [CanEmpActivateGuard]
    }, {
        path: 'user_add',
        component: CompanyUserAddEditComponent,
        canActivate: [CanEmpActivateGuard]
    }, {
        path: 'user_report',
        component: CompanyUserReportComponent,
        canActivate: [CanEmpActivateGuard]
    }, {
        path: 'users/:id/edit',
        component: CompanyUserAddEditComponent,
        canActivate: [CanEmpActivateGuard]
    }, {
        path: 'users/:username/:id/edit',
        component: CompanyUserAddEditComponent,
        canActivate: [CanEmpActivateGuard]
    },
    {
        path: 'candidate_details',
        component: CandidateComponent,
        canActivate: [CanEmpActivateGuard]
    }
]);
