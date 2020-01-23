import { RouterModule } from '@angular/router';
import { CareerFairListComponent } from './careerFairList/careerFairList.component';
import { CareerFairDetailsEmpComponent } from
        './careerFairDetailsEmp/careerFairDetailsEmp.component';
import { CanEmpActivateGuard } from '../../canEmpActivateGuard.guard';
import { CareerFairAddEditComponent } from './careerFairAddEdit/careerFairAddEdit.component';


export const CareerFairEmployerRoutes = RouterModule.forChild([
    {path: '', component: CareerFairListComponent},
    {
        path: ':id/edit',
        component: CareerFairAddEditComponent,
        canActivate: [CanEmpActivateGuard]
    },
    {
        path: 'add',
        component: CareerFairAddEditComponent,
        canActivate: [CanEmpActivateGuard]
    },
    {path: ':CareerFairTitle-id', component: CareerFairDetailsEmpComponent}
]);
