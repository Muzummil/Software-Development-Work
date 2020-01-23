import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { CanActivate, Router, ActivatedRoute } from '@angular/router';
import { AccountService } from './core/account/services/account.service';
import { ConfigService } from './shared/config.service';

@Injectable()
export class CanHomeActivateGuard implements CanActivate {

    public isPublic: boolean;
    public ifcontainsRoutes = ['career-fairs','jobs', 'blog', 'companies'];
    public lastStep = '4';

    constructor(public accountService: AccountService, public _activeRoute: ActivatedRoute,
        public router: Router, public location: Location) {
    }

    public canActivate() {
        let queryParams$ = this._activeRoute.queryParams.subscribe((queryParams) => {
            if (queryParams['auth_token'] && queryParams['id']) {
                this.accountService.getLoginJobseekerWithAuth(queryParams['auth_token'],
                    queryParams['id'], queryParams['provider']);
                queryParams$.unsubscribe();
                return false;
            }
        });

        if (this.accountService.getAuth()) {
            let newroute = '';
            if (this.accountService.getCheckEmployer()) {
                newroute = this.accountService.getCurrLangUrl() + 'employer';
            } else {
                newroute = this.accountService.getCurrLangUrl() + ConfigService.jobseekerPath;
                var reffererUrl = this._activeRoute.snapshot.queryParams['reffererUrl']
                if (reffererUrl != undefined) {
                    if (this.accountService.getProfileStatus() == this.lastStep) {
                        setTimeout(() => {
                            this.router.navigateByUrl("/job-seeker" + reffererUrl);
                        }, 50);
                    }
                }
            }
            let specialcase = false;
            this.ifcontainsRoutes.forEach((selroute) => {
                if (this.location.path().indexOf(selroute) !== -1) {
                    specialcase = true;
                }
            });

            if (!specialcase) {
                newroute += '/profile';
                this.getReRoute(newroute);
            } else {
                let newLocation = this.location.path();
                if (newLocation.indexOf('login') === -1) {
                    newroute += newLocation;
                }
                this.getReRoute(newroute);
            }
            return false;
        }

        if (!this.getValidateLandingPage()) {
            return false;
        }

        return !this.accountService.getAuth();

    }

    public getReRoute(newRoute = '') {
        this.router.navigateByUrl(newRoute);
    }

    // Implemented in children
    public getValidateLandingPage() {
        return true;
    }
}
