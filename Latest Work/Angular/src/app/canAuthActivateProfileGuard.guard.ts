import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { CanActivate, Router } from '@angular/router';
import { AccountService } from '../app/core/account/services/account.service';

@Injectable()
export class CanAuthActivateProfileGuard implements CanActivate {

    public isPublic: boolean;

    constructor(public accountService: AccountService, public _router: Router,
                public _location: Location) {
    }

    public canActivate() {

        if (this.accountService.getAuth()) {
            return true;
        } else {
            this.accountService.getLogOutUser();
            return false;

        }
    }
}
