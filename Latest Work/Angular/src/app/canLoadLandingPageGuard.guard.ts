import { Injectable } from '@angular/core';
import { CanHomeActivateGuard } from './canHomeActivateGuard.guard';
import { ConfigService } from './shared/config.service';
import { LoginComponent } from './core/publicPage/login/login.component';

@Injectable()
export class CanLoadLandingPageGuard extends CanHomeActivateGuard  {

    public getValidateLandingPage() {

        if (ConfigService.SHOW_LOGIN_AS_HOME === 'true') {
            this.getReRoute('/login');
            return false;
        } else {
            return true;
        }
    }

}
