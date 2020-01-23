import { RouterModule } from '@angular/router';

import { CanHomeActivateGuard } from '../../../canHomeActivateGuard.guard';
import { SignupGenericComponent } from './signupGeneric.component';

export const SignupGenericRoutes = RouterModule.forChild([
    {path: '', component: SignupGenericComponent},
]);
