import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AccountService } from '../app/core/account/services/account.service';

@Injectable()
export class CanActivateCompProfileGuard implements CanActivate {

    public isPublic: boolean;

    constructor(public accountService: AccountService, public _router: Router) {

    }

    public canActivate() {

        if (this.accountService.getAuth()) {
            return true;
        }

        this.accountService.getLogOutUser();
        return false;

    }
}
