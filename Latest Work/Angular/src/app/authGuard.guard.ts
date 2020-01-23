import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AccountService } from '../app/core/account/services/account.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private accountService: AccountService, private router: Router) { }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.accountService.getAuth()) {
      // logged in so return true
      return true;
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate([this.accountService.getCurrLangUrl() + 'login'],
        { queryParams: { returnUrl: state.url }});
    return false;
  }
}
