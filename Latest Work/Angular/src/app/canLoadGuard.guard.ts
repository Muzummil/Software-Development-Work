import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { CanLoad, Router, Route } from '@angular/router';
import { AccountService } from '../app/core/account/services/account.service';
import { ConfigService } from '../app/shared/config.service';

@Injectable()
export class CanLoadGuard implements CanLoad {

    public ifcontainsRoutes = ['career-fairs', 'jobs', 'blog', 'companies'];

    constructor(public accountService: AccountService,
        public _router: Router,
        public _location: Location) {

    }

    public canLoad(route: Route) {
        if (route.path === '') {
            return true;
        } else if (route.path === 'signup-jobseeker' ||
            route.path === ConfigService.langPathHash['arabic'] + '/signup-jobseeker') {
            return true;
        } else if (route.path === 'uae/jobs' ||
            route.path === ConfigService.langPathHash['arabic'] + '/uae/jobs') {
            return true;
        } else if (route.path === 'jobs' ||
            route.path === ConfigService.langPathHash['arabic'] + '/jobs') {
            return true;
        } else if (route.path === 'companies' ||
            route.path === ConfigService.langPathHash['arabic'] + '/companies') {
            return true;
        } else if (route.path === 'career-fairs' ||
            route.path === ConfigService.langPathHash['arabic'] + '/career-fairs') {
            return true;
        } else if (route.path === 'blog' ||
            route.path === ConfigService.langPathHash['arabic'] + '/blog') {
            return true;
        } else if (route.path === 'signup_employer' ||
            route.path === ConfigService.langPathHash['arabic'] + '/signup_employer') {
            return true;
        } else if (route.path === 'applications/:application_id/interviews/:interview_id' ||
            route.path === ConfigService.langPathHash['arabic'] +
            '/applications/:application_id/interviews/:interview_id') {
            return true;
        } else if (route.path === 'employer' ||
            route.path === ConfigService.langPathHash['arabic'] +
            '/employer') {
            return true;
        } else if (route.path.indexOf('package-broadcast') !== -1) {
            return true;
        } else if ((route.path === ConfigService.jobseekerPath ||
            route.path === ConfigService.langPathHash['arabic'] + '/' +
            ConfigService.jobseekerPath) && this.accountService.getUserType() === 'jobseeker') {
            return true;
        } else if ((route.path === 'employer' ||
            route.path === ConfigService.langPathHash['arabic'] + '/employer') &&
            this.accountService.getUserType() === 'employer') {
            return true;
        } else if (this.accountService.getLocalStorage('registration-confirmed')
            && this.accountService.getAuth() && !this.accountService.getCheckEmployer()) {
            return true;
        } else {
            let specialcase = false;
            let newUrl = '';
            let specialIndex = 0;
            this.ifcontainsRoutes.forEach((selroute) => {

                specialIndex = this._location.path().indexOf(selroute);

                if (specialIndex !== -1) {
                    specialcase = true;
                    newUrl = this._location.path() + ' ';
                    newUrl = newUrl.slice(specialIndex, -1);

                }
            });

            if (specialcase) {
                this._router.navigateByUrl(this.accountService.getCurrLangUrl() + newUrl);
            } else {
                let homeURL = (this.accountService.getCurrLang() === 'ar') ? '/ar' : '/';
                this._router.navigateByUrl(homeURL);
            }

        }
        return true;
    }
}
