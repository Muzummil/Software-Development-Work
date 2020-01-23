import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import {CanActivate, Router} from '@angular/router';
import { AccountService } from '../app/core/account/services/account.service';

@Injectable()
export class CanAuthActivateGuard implements CanActivate {

    public isPublic : boolean;

    constructor(public accountService: AccountService,public _router:Router,public _location: Location) {}

    canActivate() {


        if (this.accountService.getAuth() && !this.accountService.getCheckEmployer()){

          if(this.accountService.getProfileComplete()){
            return true;
          }
          else {
            this._router.navigateByUrl('/');
            return false;
          }
        }
        else {
          this.accountService.getLogOutUser();
          return false;
        }
    }
}
