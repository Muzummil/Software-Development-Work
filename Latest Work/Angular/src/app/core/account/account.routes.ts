import { Route, RouterModule } from '@angular/router';
import {AccountSettingsComponent} from '../account/accountSettings.component';


export const AccountRoutes = RouterModule.forChild([
  {
    path: '',
    component: AccountSettingsComponent
  }
]);