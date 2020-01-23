import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigService } from '../../../shared/config.service';

import { Injectable, Inject } from '@angular/core';
import { Location } from '@angular/common';

import { BehaviorSubject, Observable } from 'rxjs/Rx';
import { Router, ActivatedRoute } from '@angular/router';

// Service
import { CookieService } from '../../../core/services/cookie.service';
import { DomManupilationService } from '../../../core/services/domManupilation.service';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';

// Models
import { Account } from '../models/account';

import { ErrorHandling } from '../../services/errorHandling.service';

import * as moment from 'moment';

@Injectable()
export class AccountService {

    public static jobseekerPackageBroadcastCache: any = null;
    public static jobseekerPackageBroadcastCacheDirty: boolean = true;
    public static cachedJobseekerPackageBroadcast$: BehaviorSubject<any> =
        new BehaviorSubject(null);
    public static profileCache: any = null;
    public static cachedProfile$: BehaviorSubject<any> = new BehaviorSubject(null);
    public static s3Loaded$: BehaviorSubject<any> = new BehaviorSubject(false);
    public static switchFlag: boolean = false;
    public static firstLoadFlag: boolean = true;
    public static profileCacheDirty: boolean = true;
    public static profileHeader: any = null;
    public static rememberme: boolean = false;
    public static pageURL = '';
    public static firstLoadSEO: boolean = true;
    public _url = 'users/';
    public _forget_password_email_url = 'users/password';
    public _resend_confirmation_email_url = 'users/confirmation';
    public _change_password_url = 'users/password';
    public jobseeker_company_broadcasts_url = 'jobseeker_company_broadcasts';
    public isPublic: boolean;
    public hideFooter: boolean = true;
    public sub;
    public restricted_user_names =
        ['phantomassociatesdxb@gmail.com', 'cassandre.zgheib@parisgallery.com'];

    constructor(private _http: HttpClient, private router: Router, private location: Location, public _activeRoute: ActivatedRoute,
        @Inject(CookieService) private _cookieService: CookieService,
        @Inject(SlimLoadingBarService) private _slimLoadingBarService:
            SlimLoadingBarService,
        @Inject(DomManupilationService) private _seoService: DomManupilationService,
        @Inject(ErrorHandling) private _errorHandling: ErrorHandling) {

        this.sub = this.router.events.subscribe((params) => {

            if (params['url']) {
                AccountService.pageURL = params['url'];
            }
            this.location = location;
            this.getCheckPublic();
            if (this.location.path().indexOf('/' + ConfigService.jobseekerPath + '/') !== -1 ||
                this.location.path().indexOf('/employer/') !== -1) {

                this.hideFooter = false;
                if (this.location.path().indexOf('/login') !== -1 ||
                    this.location.path().indexOf('/signup_employer') !== -1) {
                    this.hideFooter = true;
                }

                this.setSwitchPage();

            }
        });

        /**
         * Building a hash map of seo data for each public page .
         * This is created only first time the page loads
         */
        if (this.checkEmptyObj(DomManupilationService.seoList)) {

            this.setSeoList().subscribe((res) => {

                if (res) {
                    res['pages'].forEach((selSeo) => {

                        let urlSplit = selSeo.url.split('/');
                        let selectHash = urlSplit.slice(3).join('/');
                        if (this._seoService.seoHash[selectHash]) {

                            DomManupilationService.altList[this._seoService.seoHash[selectHash]] =
                                selSeo['images'];
                            DomManupilationService.seoList[this._seoService.seoHash[selectHash]] =
                                {};
                            DomManupilationService.seoList[this._seoService.seoHash[selectHash]]
                            ['meta_tags'] = selSeo['meta_tags'];
                            DomManupilationService.seoList[this._seoService.seoHash[selectHash]]
                            ['common'] = {
                                    id: selSeo['id'],
                                    name: selSeo['name'],
                                    title: selSeo['title'],
                                    role: selSeo['role']
                                };
                        }
                    });

                    this._seoService.seoListObj.next(DomManupilationService.seoList);
                    this._seoService.altListObj.next(DomManupilationService.altList);
                }

            });
        }

    }

    // JSON DATA FROM AWS S3
    public setS3Json() {
        let currLan = this.getCurrLang();
        let url1 = this._http.get((currLan === 'ar') ? ConfigService.SECTORS_ALPHA_AR_URL :
            ConfigService.SECTORS_ALPHA_EN_URL, {
            headers: { 'Content-Type': 'application/json' }
        }).map((res) => {
            localStorage.setItem('sectors_alpha_json', JSON.stringify(res));
            return res;
        });
        let url2 = this._http.get((currLan === 'ar') ? ConfigService.COUNTRIES_ALPHA_AR_URL :
            ConfigService.COUNTRIES_ALPHA_EN_URL, {
            headers: { 'Content-Type': 'application/json' }
        }).map((res) => {
            localStorage.setItem('countries_alpha_json', JSON.stringify(res));
            return res;
        });

        let url3 = this._http.get((currLan === 'ar') ? ConfigService.CITIES_ALPHA_AR_URL :
            ConfigService.CITIES_ALPHA_EN_URL, {
            headers: { 'Content-Type': 'application/json' }
        }).map((res) => {
            localStorage.setItem('cities_alpha_json', JSON.stringify(res));
            return res;
        });

        let url4 = this._http.get((currLan === 'ar') ? ConfigService.SECTORS_JOBS_AR_URL :
            ConfigService.SECTORS_JOBS_EN_URL, {
            headers: { 'Content-Type': 'application/json' }
        }).map((res) => {
            localStorage.setItem('sectors_jobs_json', JSON.stringify(res));
            return res;
        });
        let url5 = this._http.get((currLan === 'ar') ? ConfigService.COUNTRIES_JOBS_AR_URL :
            ConfigService.COUNTRIES_JOBS_EN_URL, {
            headers: { 'Content-Type': 'application/json' }
        }).map((res) => {
            localStorage.setItem('countries_jobs_json', JSON.stringify(res));
            return res;
        });

        let url6 = this._http.get((currLan === 'ar') ? ConfigService.CITIES_JOBS_AR_URL :
            ConfigService.CITIES_JOBS_EN_URL, {
            headers: { 'Content-Type': 'application/json' }
        }).map((res) => {
            localStorage.setItem('cities_jobs_json', JSON.stringify(res));
            return res;
        });

        let url7 = this._http.get((currLan === 'ar') ? ConfigService.STATIC_AR_URL :
            ConfigService.STATIC_EN_URL, {
            headers: { 'Content-Type': 'application/json' }
        }).map((res) => {
            localStorage.setItem('static_json', JSON.stringify(res));
            return res;
        });

        let url9 = this._http.get((currLan === 'ar') ?
            ConfigService.COMPANIES_BY_FOLLOWERS_AR_URL :
            ConfigService.COMPANIES_BY_FOLLOWERS_EN_URL, {
            headers: { 'Content-Type': 'application/json' }
        }).map((res) => {
            localStorage.setItem('company_by_followers_json', JSON.stringify(res));
            return res;
        });

        let url10 = this._http.get((currLan === 'ar') ?
            ConfigService.PAGES_SEO_AR_URL :
            ConfigService.PAGES_SEO_EN_URL, {
            headers: { 'Content-Type': 'application/json' }
        }).map((res) => {
            localStorage.setItem('pages_json', JSON.stringify(res));
            return res;
        });

        Observable.forkJoin([url1, url2, url3, url4, url5, url6, url7, url9, url10])
            .subscribe((res) => {
                AccountService.s3Loaded$.next(true);
            });
    }

    // Check For Interview pages
    public checkInterview(url) {
        return (url.indexOf('/interviews') > -1 && url.indexOf('/applications') > -1);
    }

    // Back Click Transitions
    public backClick() {
        if (window.history.length <= 2) {
            let currentUrl = this.router.url;
            let currentSession = '';
            if (currentUrl.indexOf('employer') !== -1) {
                currentSession = 'employer';
            } else if (currentUrl.indexOf('job-seeker') !== -1 ||
                currentUrl.indexOf('jobseeker') !== -1) {
                currentSession = 'job-seeker';
            }
            if (currentUrl.indexOf('jobs') !== -1) {
                this.router.navigate([this.getCurrLangUrl() + currentSession + '/jobs']);
            } else if (currentUrl.indexOf('blog') !== -1) {
                this.router.navigate([this.getCurrLangUrl() + currentSession + '/blog']);
            } else if (currentUrl.indexOf('companies') !== -1) {
                this.router.navigate([this.getCurrLangUrl() + currentSession + '/companies']);
            }
        } else {
            window.history.back();
        }
    }

    // Check if public
    public getCheckPublic() {
        this.isPublic = !this.getAuth();
    }

    // Validate Object
    public checkEmptyObj(obj) {

        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                return false;
            }
        }
        return true;
    }

    // Set Page SEO
    public setPageSeo(page = '', text1 = null, text2 = null, text3 = null, canonicalUrl = true) {
        if (!this.getAuth()) {
            this._seoService.setPageSeo(page, AccountService.pageURL, text1, text2, text3,
                canonicalUrl);
        } else {
            this.getLoadGA();
        }
    }

    // Sec Custom Seo
    public setCustomSeo(title = ConfigService.META_TITLE, desc = ConfigService.META_DESC) {
        this._seoService.getCustomSeo(title, desc);
    }

    // Load Google Analytics
    public getLoadGA() {
        this._seoService.getLoadGA();
    }

    // Set Pagination SEO
    public setPaginationSeo(preUrl = '', nextUrl = '') {
        this._seoService.setPaginationSeo(preUrl, nextUrl);
    }

    // Set Image SEO
    public setImageSeo(imageUrl = ConfigService.shareImage) {
        this._seoService.setImage(imageUrl);
    }

    // Set Dynamic Page SEO
    public setPageDynamicSeo(strList = [], canonicalFlag = true, description = '') {
        this._seoService.setDynamicPageSeo(strList, description, AccountService.pageURL,
            canonicalFlag);

    }

    // Set Alt tags for SEO
    public getPageAlt(page = '', imageName = '') {
        return this._seoService.getAltTag(page, imageName);
    }

    // Set Common SEO
    public setCommonSeo() {
        this._seoService.setCommonSeo();
    }

    // Load Page SEO
    public setSeoList(): Observable<any[]> {
        let pages;
        AccountService.s3Loaded$.subscribe((resFlag) => {
            if (resFlag) {
                pages = JSON.parse(localStorage
                    .getItem('pages_json'));
            }
        });

        return Observable.of(pages);
    }

    // Validate if email exists
    public getIfValidEmail(emailId = '') {
        let url = ConfigService.getAPI() + 'users/valid_email';
        let postParams = { user: { email: emailId } };
        return this._http.post(url, JSON.stringify(postParams),
            { headers: new HttpHeaders().set('Content-Type', 'application/json') })
            .map((res) => res);
    }

    // Set First Load
    public setFistLoadFlag(modeFlag: boolean = true) {
        AccountService.firstLoadFlag = modeFlag;
    }

    // Get First Load Status
    public getFistLoadFlag() {
        return AccountService.firstLoadFlag;
    }

    // Check page switch status
    public getSwitchPage(): boolean {
        return AccountService.switchFlag;
    }

    // Set page switch status
    public setSwitchPage(flg = true) {
        this._slimLoadingBarService.complete();
    }

    // Get complete profile status
    public getProfileComplete(): any {

        if (this.getCheckEmployer()) {
            return true;
        } else {

            let completeStep = parseInt(this.getProfileStatus(), 10);
            if (completeStep) {
                if (completeStep < 3) {
                    return false;
                } else {
                    return true;
                }
            }
            return false;
        }

    }

    // Send forgot password email
    public sendForgetPasswordEmail(postData: any) {
        return this._http.post(ConfigService.getAPI() + this._forget_password_email_url,
            postData).map((res) => res);
    }

    // Send confirmation email
    public sendConfirmationEmail(postData: any) {
        return this._http.post(ConfigService.getAPI() + this._resend_confirmation_email_url,
            postData).map((res) => res);
    }

    // Change password
    public changePassword(postData: any) {
        return this._http.put(ConfigService.getAPI() + this._change_password_url,
            postData).map((res) => res);
    }

    public getTopCandidateSearches(limit: number = 10) {

        let url =
            ConfigService.getAlgoliaAnalyticAPI() + '2/searches?index=jobseekers&limit=' + limit;
        return this._http.get(url,
            {
                headers: new HttpHeaders().set('X-Algolia-Application-Id',
                    ConfigService.getAlgoliaAppId())
                    .set('X-Algolia-API-Key', ConfigService.getAlgoliaKey())
            });
    }

    public getCandidateSearchCount() {

        let url = ConfigService.getAlgoliaAnalyticAPI() + '2/searches/count?index=jobseekers';
        return this._http.get(url,
            {
                headers: new HttpHeaders()
                    .set('X-Algolia-Application-Id', ConfigService.getAlgoliaAppId())
                    .set('X-Algolia-API-Key', ConfigService.getAlgoliaKey())
            });

    }

    // Start switch
    public getMakeSwitch() {
        this.setSwitchPage(true);
    }

    // Set switch flag
    public setSwitchFlag(flg = false) {
        AccountService.switchFlag = flg;
    }

    // Set login details to Session
    public getLoginJobseekerWithAuth(authKey, userId, mode = 'dir') {
        this.setSwitchFlag(true);
        let rememberme;
        this.setAuthKeyCookie(rememberme, authKey);
        localStorage.setItem('userId', userId);
        localStorage.setItem('role', 'jobseeker');
        localStorage.setItem('provider', mode);
        this.getLoadProfile('jobseeker');
    }

    public getProvider() {
        return (localStorage.getItem('provider')) ?
            localStorage.getItem('provider') : 'dir';
    }

    // Login User
    public getLoginUser(userCredentials, customReturnUrl = null) {

        let username: string = userCredentials.username.trim();
        let password: string = userCredentials.user_password;
        let rememberme: string = userCredentials.rememberme;

        return this._http.post(ConfigService.getAPI() + this._url + 'sign_in', '',
            {
                headers: new HttpHeaders().set('Authorization', 'Basic ' +
                    btoa(username + ':' + password))
                    .set('Content-Type', 'application/x-www-form-urlencoded')
            })
            .map((res) => {

                if (res['auth_token']) {
                    this.setSwitchFlag(true);
                    this.setAuthKeyCookie(rememberme, res['auth_token']);
                    localStorage.setItem('user_name', userCredentials.username);
                    localStorage.setItem('userId', res['user_id']);
                    localStorage.setItem('provider', 'dir');
                    localStorage.setItem('role', res['role']);
                    if (res['package']) {
                        this.setPackageId(res['package'], res['subscription']);
                    }
                    if (res['employer_id']) {
                        localStorage.setItem('company_id', res['company_id']);
                        localStorage.setItem('employer_id', res['employer_id']);
                        localStorage.setItem('permissions', res['permissions']);
                        localStorage.setItem('is_premium', res['is_premium']);
                        this.setEmployerLocalStorage(res['is_premium'], res['permissions']);
                    }
                    this.getLoadProfile(res['role'], customReturnUrl);
                    AccountService.jobseekerPackageBroadcastCacheDirty = true;

                }
                return true;

            });
    }

    public setEmployerLocalStorage(isPremium, permissions) {
        localStorage.setItem('permissions', permissions);
        localStorage.setItem('is_premium', isPremium);
    }

    // Do Re Routing
    public reRoute(customReturnUrl) {
        this.router.navigateByUrl(customReturnUrl);
        this.getMakeSwitch();
    }

    // Load Profile details
    public getLoadProfile(role, customReturnUrl = null) {
        this.loadProfile(true);
        if (customReturnUrl) {
            this.router.navigateByUrl(customReturnUrl);
            this.getMakeSwitch();
        } else if (role === 'jobseeker') {
            // if (window.location.href.indexOf("reffererUrl") != -1) {
            //     var reffUrl = this._activeRoute.snapshot.queryParams['reffererUrl'];
            //     this.router.navigateByUrl(this.getCurrLangUrl() +
            //         ConfigService.jobseekerPath + reffUrl);
            // }
            // else {
            //     this.router.navigateByUrl(this.getCurrLangUrl() +
            //         ConfigService.jobseekerPath + '/profile');
            // }
            // this.getMakeSwitch();
        } else {
            this.router.navigateByUrl(this.getCurrLangUrl() + '/employer/dashboard');
            this.getMakeSwitch();

        }
    }

    // set Auth Code to Cookie
    public setAuthKeyCookie(rememberme: string, auth_token) {
        if (rememberme) {
            AccountService.rememberme = true;
            this._cookieService.setCookie('authKey', auth_token);
        } else {
            this._cookieService.setCookie('authKey', auth_token, ConfigService.expiremin);

        }
    }

    // check for manage blog permission
    public getManageBlog() {
        let permissions = this.getPermissions();
        if (permissions.indexOf('manage_blog') === -1) {
            return false;
        } else {
            return true;
        }
    }

    // check for create blog permission
    public getCreateBlog() {
        let permissions = this.getPermissions();
        if (permissions.indexOf('create_blog') === -1) {
            return false;
        } else {
            return true;
        }
    }

    // check for search jobseeker permission
    public getSearchJobSeekers() {
        let permissions = this.getPermissions();
        if (permissions.indexOf('search_jobseekers') === -1) {
            return false;
        } else {
            return true;
        }
    }

    // check for destroy job permission
    public getDestroyJob() {
        let permissions = this.getPermissions();
        if (permissions.indexOf('destroy_job') == -1) {
            return false;
        } else {
            return true;
        }
    }

    // Get Current user Permisions
    public getPermissions() {
        return (localStorage.getItem('permissions')) ?
            localStorage.getItem('permissions').split(',') : [];
    }

    // get current user packages
    public getPackage() {
        return (localStorage.getItem('package_id')) ?
            localStorage.getItem('package_id') : null;
    }

    // check if current user package is expired
    public getCheckExpiredPackage() {

        if (localStorage.getItem('subscription')) {
            let subscription = JSON.parse(localStorage.getItem('subscription'));
            if (subscription['expires_at']) {
                return moment(new Date()).isSameOrAfter(Date.parse(subscription['expires_at']));
            } else {
                return true;
            }

        } else {
            return true;
        }
    }

    // Check if current user has permission to edit job status
    public getJobApplicationStatus() {
        let permissions = this.getPermissions();
        if (permissions.indexOf('edit_job_application_status') === -1) {
            return false;
        } else {
            return true;
        }
    }

    // Check if current user has permission to create jobs
    public getCreateJob() {
        let permissions = this.getPermissions();
        if (permissions.indexOf('create_job') === -1) {
            return false;
        } else {
            return true;
        }
    }

    // Validate is use is company user
    public getCompanyUser() {
        if (localStorage.getItem('role') === 'company_user') {
            return true;
        } else {
            return false;
        }
    }

    // Validate is use is company owner
    public getCompanyOwner() {
        if (localStorage.getItem('role') === 'company_owner') {
            return true;
        } else {
            return false;
        }
    }

    // Check if user has permisssion to invite connections
    public getInviteFriends() {
        let permissions = this.getPermissions();
        if (permissions.indexOf('invite_connection') === -1) {
            return false;
        } else {
            return true;
        }
    }

    // Check if user has permisssion to edit company
    public getEditCompany() {
        let permissions = this.getPermissions();

        if (permissions.indexOf('edit_company') === -1) {
            return false;
        } else {
            return true;
        }
    }

    // Load user profile
    public loadProfile(isRedirect : boolean = false) {
        if (this.getAuth()) {
            if (this.getCheckEmployer()) {

                this.getEmployerProfile().subscribe((res) => {
                }, (err) => {
                    this._errorHandling.errorHandling(err);
                });
            } else {
                this.getJobseekerProfile().subscribe((res) => {
                    if (isRedirect) {
                        if (window.location.href.indexOf("reffererUrl") != -1) {
                            var reffUrl = this._activeRoute.snapshot.queryParams['reffererUrl'];
                            this.router.navigateByUrl(this.getCurrLangUrl() +
                                ConfigService.jobseekerPath + reffUrl);
                        }
                        else {
                            this.router.navigateByUrl(this.getCurrLangUrl() +
                                ConfigService.jobseekerPath + '/profile');
                        }
                    }
                }, (err) => {
                    this._errorHandling.errorHandling(err);
                    this.setSwitchFlag(false);

                });
            }
        }
    }

    // Load user profile
    public getEmployerProfile() {

        let url = ConfigService.getAPI() + 'company_users/' + this.getEmployerId() +
            '/employer_details';
        url += (this.getCurrLang() === ConfigService.langHash['arabic']) ? '?ar=true' : '';
        return this._http.get(url, this.AuthHeader())
            .map((res) => {
                let profile = res;
                let full_name = profile['user']['first_name'] + ' ' + profile['user']['last_name'];
                let company_name = profile['user']['company']['name'];
                this.setProfileHeader(full_name, profile['user']['company']['avatar'],
                    company_name);
                this.setEmployerLocalStorage(profile['user']['company']['is_premium'],
                    profile['user']['permissions']);
                return profile;
            });
    }

    // Get Video token
    public getvidyoToken(applicationId, interviewId) {
        let url = ConfigService.getAPI() + 'job_applications/' + applicationId +
            '/interviews/' + interviewId + '/generate_token';
        return this._http.get(url, this.AuthHeader());
    }

    // Get Interview Details
    public getInterviewDetails(applicationId, interviewId) {
        let url = ConfigService.getAPI() + 'job_applications/' + applicationId +
            '/interviews/' + interviewId;
        url += (this.getCurrLang() === ConfigService.langHash['arabic']) ? '?ar=true' : '';
        return this._http.get(url, this.AuthHeader());
    }

    // Get all Interview Details
    public getAllInterviewDetails() {
        let url = ConfigService.getAPI() + 'interviews';
        url += (this.getCurrLang() === ConfigService.langHash['arabic']) ? '?ar=true' : '';
        return this._http.get(url, this.AuthHeader());
    }

    // Get Jobseeker Profile
    public getJobseekerProfile() {

        let url = ConfigService.getAPI() + 'jobseekers/' + this.getUserId() + '/display_profile';
        url += (this.getCurrLang() === ConfigService.langHash['arabic']) ? '?ar=true' : '';
        return this._http.get(url, this.AuthHeader())
            .map((res) => {
                let profile1 = res;
                if (profile1 == null) {
                    this.router.navigate(['/unauthorized']);
                }
                let profile = profile1['jobseeker_profile'];
                this.setProfileCache(profile);
                this.setProfileStatus(profile['complete_step']);
                let full_name = profile['first_name'] + ' ' + profile['last_name'];
                this.setProfileHeader(full_name, profile['avatar']);
                return profile;
            });

    }

    // Set Profile cache
    public setProfileCache(profile) {
        AccountService.cachedProfile$.next(profile);
        AccountService.profileCache = profile;
    }

    // Set user completed step
    public setProfileStatus(complete_step) {
        localStorage.setItem('complete_step', complete_step);
    }

    // Get user completed step
    public getProfileStatus() {

        if (localStorage.getItem('complete_step')) {
            return localStorage.getItem('complete_step');
        }
        return null;

    }

    // Load user details for header.
    public getProfileHeader(): any {
        if (AccountService.profileHeader == null || AccountService.profileCacheDirty === true) {
            AccountService.profileHeader = {};
            AccountService.profileCacheDirty = false;
            this.loadProfile();
        }
        return AccountService.profileHeader;
    }

    // Mark profile as Dirty
    public getRefreshProfile() {
        AccountService.profileCacheDirty = true;
    }

    // Set package to session
    public setPackageId(packageObj = null, subscriptionObj = null) {
        localStorage.setItem('package_id', packageObj['id']);
        localStorage.setItem('package', JSON.stringify(packageObj));
        localStorage.setItem('subscription', JSON.stringify(subscriptionObj));
    }

    // Get Package Details
    public getPackageDetails() {

        if (localStorage.getItem('package') && localStorage.getItem('subscription')) {
            return {
                package: JSON.parse(localStorage.getItem('package')),
                subscription: JSON.parse(localStorage.getItem('subscription'))
            };
        } else {
            return {};
        }

    }

    // Set User Profile Header
    public setProfileHeader(full_name: string, avatar: string, company_name = '') {
        let names = full_name.split(' ');
        AccountService.profileHeader = {
            full_name,
            company_name,
            avatar,
            first_name: names[0],
            last_name: names[1]
        };
    }

    // URL Encoding space to Dash
    public getSpaceToDash(title: string) {
        return title.trim().replace(/[^\u0621-\u064Aa-zA-Z0-9 ]/g, '')
            .replace(/\s+/g, '-');
    }

    // URL Encoding space to dash to lower case
    public getSpaceToDashLowerCase(title: string) {

        return (title) ? title.trim().toLowerCase()
            .replace(/[^\u0621-\u064Aa-zA-Z0-9 ]/g, '')
            .replace(/\s+/g, '-') : '';

    }

    // To Lower case
    public gethLowerCase(title: string) {
        return title.trim().toLowerCase();

    }

    // Return Route
    public getRouterObs(): Router {
        return this.router;
    }

    // Check if public
    public getIsPublic() {
        return !this.getAuth();
    }

    // Get Page path
    public getPath() {
        if (this.getIsPublic()) {
            return '';
        } else if (localStorage.getItem('role') === 'jobseeker') {
            return ConfigService.jobseekerPath;
        } else {
            return 'employer';
        }
    }

    // Get  page public path
    public getPublicPath() {
        return 'home';
    }

    // Get current user type.
    public getUserType() {

        if (localStorage.getItem('role') == null ||
            localStorage.getItem('role') === undefined) {
            return '';
        } else if (localStorage.getItem('role') === 'jobseeker') {
            return 'jobseeker';
        } else {
            return 'employer';
        }
    }

    // Get Employer Details
    public getEmployerDetails(id): Observable<any> {
        let url = ConfigService.getAPI() + 'company_users/' + id + '/employer_details';
        url += (this.getCurrLang() === ConfigService.langHash['arabic']) ? '?ar=true' : '';
        return this._http.get(url, this.AuthHeader()).map((res) => res);

    }

    // Deactivate User
    public getDeactivate() {

        let postList = '';
        return this._http.put(ConfigService.getAPI() + this._url + this.getUserId()
            + '/deactivate', postList, this.AuthHeader2())
            .map((res) => res);

    }

    // get Notifications
    public getNotification() {

        let url = ConfigService.getAPI() + this._url + this.getUserId() + '/get_notification';
        url += (this.getCurrLang() === ConfigService.langHash['arabic']) ? '?ar=true' : '';
        let header = this.AuthHeader();
        return this._http.get(url, header)
            .map((res) => res)
            .map((res) => res['notification']);

    }

    // Get employer Details
    public getEmployerUserDetails(employerId) {

        let url = ConfigService.getAPI() + 'company_users/' + employerId;
        url += (this.getCurrLang() === ConfigService.langHash['arabic']) ? '?ar=true' : '';
        let header = this.AuthHeader();
        return this._http.get(url, header).map((res) => res);

    }

    // Get Employer Permissions
    public getActiveEmployerPermissionList(): Observable<any> {

        if (localStorage.getItem('permissions')) {
            return Observable.of(localStorage.getItem('permissions'));
        } else {
            return this.getEmployerUserDetails(this.getEmployerId()).map((res) => {
                localStorage.setItem('permissions', res['user']['permissions']);
                return res['user']['permissions'];
            });

        }

    }

    // Remove value from local storage
    public removeLocalStorage(name = 'registration-confirmed') {
        localStorage.removeItem(name);
    }

    // Get value from local storage
    public getLocalStorage(name = 'registration-confirmed') {
        return localStorage.getItem(name);
    }

    // Set value to localstorage
    public setLocalStorage(name = 'registration-confirmed', val = 'true') {
        localStorage.setItem(name, val);
    }

    // Delete  Profile video
    public deleteProfileVideo() {

        let authHeader = this.AuthHeader3();
        return this._http.delete(ConfigService.getAPI() + this._url + this.getUserId()
            + '/delete_video/', authHeader).map((res) => res);
    }

    // Delete Profile Image
    public deleteProfileImage() {
        let authHeader = this.AuthHeader3();
        return this._http.delete(ConfigService.getAPI() + this._url + this.getUserId()
            + '/delete_avatar/', authHeader).map((res) => res);
    }

    // update Notifications
    public getUpdateNotifications(notificationObj: any) {
        let postList = JSON.stringify({ notification: notificationObj });
        return this._http.put(ConfigService.getAPI() + this._url + this.getUserId()
            + '/update_notification', postList, this.AuthHeader2())
            .map((res) => res);
    }

    // Update news letter
    public getUpdateNewsLetter(flag: boolean) {

        let postList = JSON.stringify({ notification: { newsletter: flag } });
        return this._http.put(ConfigService.getAPI() + this._url + this.getUserId()
            + '/update_notification', postList, this.AuthHeader2())
            .map((res) => res);
    }

    // Update user credentials
    public getUpdateCredentials(values) {

        let postList = JSON.stringify({
            user: {
                current_password: values['current_password'],
                password: values['new_password'],
                password_confirmation: values['new_password2']
            }
        });

        return this._http.put(ConfigService.getAPI() + this._url + this.getUserId(),
            postList, this.AuthHeader2())
            .map((res) => res);

    }

    // Logout user
    public getLogOutUser() {

        this.setSwitchFlag(true);
        /**
         * Added 1.5 sec delay before the home page shows.
         */
        let numbers = Observable.timer(1000);
        numbers.subscribe((res) => {
            this.setSwitchFlag(false);
        });

        this.getMakeSwitch();
        this._errorHandling.getLogOutUser();
    }

    // Error checks
    public getErrorCheck(error) {
        this._errorHandling.errorHandling(error);
    }

    // Check if user has loggged in
    public getAuth(): boolean {
        return this._cookieService.cookieExisits('authKey');
    }

    // Get user name from local storage
    public getUsername() {
        return localStorage.getItem('user_name');
    }

    // check if company is premium.
    public getIsPremium() {
        return (localStorage.getItem('is_premium') !== 'false');
    }

    // Check if logged in user is employer
    public getCheckEmployer() {
        if (localStorage.getItem('role') === 'jobseeker') {
            return false;
        } else {
            return true;
        }
    }

    // Get Company id or else log out the user
    public getCompanyId() {

        if (localStorage.getItem('company_id')) {
            return parseInt(localStorage.getItem('company_id'));
        } else {
            this.getLogOutUser();
        }
    }

    // Get employer id from local storage
    public getEmployerId() {
        return parseInt(localStorage.getItem('employer_id'));
    }

    // Get User Id from local storage
    public getUserId() {
        return parseInt(localStorage.getItem('userId'));
    }

    // Check to see if the user has logged in
    public getAuthKey() {

        if (this._cookieService.getCookie('authKey') === '') {
            this._errorHandling.getClearStorage();
        }
        return this._cookieService.getCookie('authKey');
    }

    // Clear storage
    public getClearStorage() {
        this._errorHandling.getClearStorage();
    }

    // Auth Header 1 type
    public AuthHeader() {
        return { headers: new HttpHeaders().set('Authorization', this.getAuthKey()) };
    }

    // Auth Header pdf
    public AuthHeaderPDF() {
        return {
            headers: new HttpHeaders().set('Authorization',
                this.getAuthKey()).set('Accept', 'application/pdf')
        };
    }

    // Auth Header Json
    public AuthHeader2() {
        return {
            headers: new HttpHeaders().set('Authorization',
                this.getAuthKey()).set('Content-Type', 'application/json')
        };
    }

    // Auth Header Body
    public AuthHeader3() {
        return {
            headers: new HttpHeaders().set('Authorization',
                this.getAuthKey()).set('Content-Type', 'application/json'),
            body: ''
        };
    }

    // Set Language Cookie
    public isArabic() {
        this.setLangCookie(this.getCurrLang());
        return (this.getCurrLang() === ConfigService.langHash['arabic']);
    }

    // Get Language
    public getCurrLang() {
        let curr_path = this.location.path();
        if (curr_path.indexOf('/' + ConfigService.langHash['arabic']) === 0) {
            return ConfigService.langHash['arabic'];
        }

        return ConfigService.langHash['english'];
    }

    // Set Language Url
    public getCurrLangUrl() {
        if (this.getCurrLang() === ConfigService.langHash['english']) {
            return '/';
        } else {
            return '/' + ConfigService.langHash['arabic'] + '/';
        }

    }

    // get Switch Language
    public getSwitchLanguage(lang = 'english') {
        let url = '';
        if (lang === 'english') {
            this.setLangCookie(ConfigService.langHash['english'], true);
            url = this.router.url.replace('/' + ConfigService.langPathHash['arabic'], '');
            window.location.href = url;
        } else {
            this.setLangCookie(ConfigService.langHash['arabic'], true);
            url = '/' + ConfigService.langPathHash['arabic'] + this.router.url;
            window.location.href = url;
        }

    }

    // set Language Cookie
    public setLangCookie(lang_val = 'en', force = false) {
        let langcookie = this._cookieService.getCookie('lang');
        if (langcookie === '' || langcookie !== lang_val || force === true) {
            this._cookieService.setCookie('lang', lang_val);
        }

    }

    // User Details Object
    public _getUserDetails(data) {

        let account = new Account();
        account.id = data.id;
        account.authenticationKey = data.authentication_key;
        account.username = data.username;
        account.firstname = data.firstname;
        account.lastname = data.lastname;
        account.activated = data.activated;
        account.suggestedJobNotification = data.suggested_job_notification;
        account.blogPostNotification = data.blog_post_notification;
        account.pollNotification = data.poll_notification;
        account.visibletoCurrentEmployer = data.visible_to_current_employer;
        account.profile_image = data.profile_image;
        account.profile_image_icon = data.profile_image_icon;
        account.googlePlusUrl = data.google_plus_page_url;
        account.linkedInUrl = data.linkedin_page_url;
        account.facebookUrl = data.facebook_page_url;
        account.twitterUrl = data.twitter_page_url;
        account.subscribeNewsLetter = data.subscribed_newsletter;
        return account;

    }

    // Set Change Orientation
    public setchangeOrientation(mode = 'en') {
        this._seoService.setchangeOrientation(mode);
    }

    public getFormattedDate(engDate, format = 'DD MMM, YYYY', lang = 'en') {
        engDate = new Date(engDate);
        lang = this.isArabic() ? 'ar' : 'en';
        if (lang === 'en') {
            return moment(engDate).format(format);
        }

        let arOptions;
        if (format === 'd MMM, yyyy' || format === 'DD MMM, YYYY' || format === 'MMM DD, YYYY' || format === 'd MMM, YYYY'
            || format === 'D MMM, YYYY') {
            arOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        } else if (format === 'd MMM, YYYY h:mm a' || format === 'd MMM, yyyy - hh:mm a' ||
            format === 'D MMM, YYYY h:mm a' ||
            format === 'MMM DD, YYYY h:mm a' || format === 'MMM DD, YYYY hh:mm a') {
            arOptions = {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour12: true,
                hour: 'numeric',
                minute: '2-digit'
            };
        }
        let arDate = (engDate).toLocaleDateString('ar-US', arOptions);

        return arDate;
    }

    public getFormattedDuration(dateText, lang = 'en') {
        if (lang === 'en') {
            return dateText;
        }

        // Note: the keys should be in this order,
        // because checking years should be before year word :D
        let engAr = {
            years: 'سنوات',
            year: 'سنه',
            months: 'شهور',
            month: 'شهر',
            present: 'الحالي',
            days: 'أيام',
            day: 'يوم',
            ago: 'منذ'
        };

        dateText = dateText.toLowerCase();
        Object.keys(engAr).forEach(function (key) {
            if (dateText.indexOf(key) !== -1) {
                dateText = dateText.replace(key, engAr[key]);
            }
        });

        return dateText;
    }

    public getBuildArabicUrl(url) {
        url += (this.getCurrLang() === ConfigService.langHash['arabic'])
            ? (url.includes('?')) ? '&ar=true' : '?ar=true' : '';
        return url;
    }

    public getCurrency() {
        return ConfigService.CURRENCY;
    }

}
