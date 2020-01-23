import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AccountService } from '../app/core/account/services/account.service';

@Injectable()
export class CanEmpActivateGuard implements CanActivate {

    constructor(public accountService: AccountService, public _router: Router) {
    }

    canActivate() {
        if (this.accountService.getAuth() && this.accountService.getCheckEmployer()) {
            return true;
        }
        else {
            this.accountService.getLogOutUser();
            return false;
        }

    }
}
