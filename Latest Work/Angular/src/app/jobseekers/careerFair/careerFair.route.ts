import { RouterModule } from '@angular/router';
import { CareerFairListComponent } from './careerFairList/careerFairList.component';
import { CanJobActivateGuard } from '../../canJobActivateGuard.guard';
import { CareerFairDetailsComponent } from './careerFairDetails/careerFairDetails.component';

export const CareerRoutes = RouterModule.forChild([
    {path: '', component: CareerFairListComponent},
    {path: ':CareerFairTitle-id', component: CareerFairDetailsComponent,
        canActivate: [CanJobActivateGuard]},

]);
