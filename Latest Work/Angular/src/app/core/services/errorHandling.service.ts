import { Router, ActivatedRoute } from '@angular/router';
import { Injectable, Inject } from '@angular/core';
import { AccountService } from '../account/services/account.service';
import { CookieService } from './cookie.service';
import { ConfigService } from '../../shared/config.service';

@Injectable()
export class ErrorHandling {
    constructor(public _activeRoute: ActivatedRoute,
                public _router: Router,
                public _cookieService: CookieService) {

    }

    public getClearStorage() {

        this._cookieService.eraseCookie('authKey');

        localStorage.removeItem('user_name');
        localStorage.removeItem('provider');
        localStorage.removeItem('subscription');
        localStorage.removeItem('userId');
        localStorage.removeItem('company_id');
        localStorage.removeItem('employer_id');
        localStorage.removeItem('permissions');
        localStorage.removeItem('role');
        localStorage.removeItem('package_id');
        localStorage.removeItem('is_premium');
        localStorage.removeItem('package');
        localStorage.removeItem('complete_step');
        AccountService.profileHeader = {};
        AccountService.profileCache = null;
        AccountService.cachedProfile$.next(null);
        AccountService.rememberme = false;
        AccountService.jobseekerPackageBroadcastCache = null;
        AccountService.jobseekerPackageBroadcastCacheDirty = true;
        AccountService.cachedJobseekerPackageBroadcast$.next(null);

    }

    public getLogOutUser() {

        this.getClearStorage();
        this._router.navigateByUrl(this.getUrl());
    }

    public errorHandling(error) {

        if (error.status == 500) {
            this._router.navigate([this.getUrl() + '404']);
        } else if (error.status == 404) {
            let currentUrl = this._router.url;
            if (currentUrl.indexOf('jobs') != -1) {
                let currentSession = '';
                if (currentUrl.indexOf('employer') != -1) {
                    currentSession = 'employer';
                } else if (currentUrl.indexOf('job-seeker') != -1 ||
                    currentUrl.indexOf('jobseeker') != -1) {
                    currentSession = 'job-seeker';
                }

                this._router.navigate([this.getUrl() + currentSession + '/jobs']);
            } else {
                this._router.navigate([this.getUrl() + '404']);
            }
        } else if (error.status == 403) {
            this._router.navigate([this.getUrl() + 'unauthorized']);
            this.getLogOutUser();
        } else if (error.status == 401) {
            this.getLogOutUser();
        }

    }

    public getUrl() {
        let lancookie = this._cookieService.getCookie('lang');
        let lang = (lancookie == '' || !ConfigService.langMapper[lancookie]) ? '' :
            ConfigService.langPathHash[ConfigService.langMapper[lancookie]];

        return '/' + lang;
    }

}
