import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import {CanActivate, Router} from '@angular/router';
import { AccountService } from '../app/core/account/services/account.service';
import {ConfigService} from "../app/shared/config.service";


@Injectable()
export class CanJobActivateGuard implements CanActivate {

    public isPublic : boolean;

    constructor(public accountService: AccountService,public _router:Router,public _location: Location) {}

    canActivate() {
        this.isPublic =!this.accountService.getAuth();

        if((this.accountService.getAuth() && !this.accountService.getCheckEmployer()) || this.isPublic ){
            return true;
        }
        else if((this.accountService.getAuth() && this.accountService.getCheckEmployer())){

            this.accountService.getLogOutUser();
            return false;
        }
        else {
            this.accountService.getLogOutUser();
            return false;
        }

    }
}
