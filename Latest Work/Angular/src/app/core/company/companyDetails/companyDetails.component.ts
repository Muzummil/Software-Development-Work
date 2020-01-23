import { Component, OnInit, Input, EventEmitter, Output, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';

import { Router, ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

// Services
import { CompanyService } from '../../services/company.service';
import { ConfigService } from '../../../shared/config.service';
import { AccountService } from '../../account/services/account.service';
import { ErrorHandling } from '../../../core/services/errorHandling.service';
import { JobService } from '../../../core/services/job.service';
import { LoaderService } from '../../../shared/services/loader.service';

let moment = require('moment');
declare var jQuery;

@Component({
    selector: 'company-details',
    templateUrl: 'companyDetails.component.html',
    styleUrls: ['./companyDetails.scss'],
    providers: [Location, {provide: LocationStrategy, useClass: PathLocationStrategy}]
})

export class CompanyDetailsComponent implements OnInit, OnDestroy {

    @Input() companyId: number = null;
    @Input() fromPage: string;
    @Input() editMode: boolean = false;

    @Output() backClick = new EventEmitter();

    // Forms
    public form1: FormGroup;

    public isPublic: boolean = false;
    public canEditCompany: boolean = false;
    public jobsLoadingFlag: boolean = false;

    // Observable
    public companyDetails$: Observable<any>;
    public team$: Observable<any>;
    public jobs$: Observable<any>;
    public cultures$: Observable<any>;
    public locationOffice$: Observable<any>;
    public folowers$: Observable<number>;
    public url$: BehaviorSubject<any> = new BehaviorSubject(ConfigService.getDomain());
    public isAuthorized$: BehaviorSubject<any> = new BehaviorSubject(null);
    public totalRecords$: BehaviorSubject<any> = new BehaviorSubject(0);

    public errrorFlag$: BehaviorSubject<any> = new BehaviorSubject(false);
    public errrorMessage$: BehaviorSubject<any> = new BehaviorSubject(null);
    public successFlag$: BehaviorSubject<any> = new BehaviorSubject(null);

    // Flags
    public loadingFlagsArray = [];

    public seoDesc = '';
    // Variables
    public followers: number;
    public company: any;
    public team: any;
    public jobs: any;
    public cultures: any;
    public queryParamsObs: any;
    public currLan = 'en';
    public fixedTextHash = this.loaderService.getFixedText();

    constructor(public _companyservice: CompanyService,
                public _jobservice: JobService,
                public fb: FormBuilder,
                public accountService: AccountService,
                public loaderService: LoaderService,
                public _router: Router,
                public _activeRoute: ActivatedRoute,
                public location: Location,
                public _error: ErrorHandling) {

        this.location = location;
        this.loadingFlagsArray['companyLoader'] = true;
        let elements1 = {
            search_string: ['', Validators.required]
        };
        this.form1 = fb.group(elements1);
        this.accountService.setSwitchFlag(false);

    }

    public getIfExpired(endDate) {
        return moment(new Date()).isAfter(Date.parse(endDate));
    }

    public ngOnDestroy() {
        if (this.isPublic === false) {

            if (this.queryParamsObs) {
                this.queryParamsObs.unsubscribe();
            }

        }
    }

    public ngOnInit() {

        this.isPublic = !this.accountService.getAuth();
        this.canEditCompany = this.accountService.getEditCompany();
        this.currLan = this.accountService.getCurrLang();
        this.seoDesc = this.fixedTextHash['seo_search_jobs'][this.currLan];

        this.queryParamsObs = this._activeRoute.queryParams.subscribe((qparams) => {

            let currentPage;
            if (qparams['page']) {
                currentPage = qparams['page'];
            } else {
                // Dont scroll to top if page is set
                window.scroll(0, 0);
            }
            let loadEvent = Observable.of(this.companyId);
            this.loadingFlagsArray['companyLoader'] = true;
            Observable.merge(
                loadEvent
            )
                .switchMap((dataVal) => this._companyservice
                    .getCompanyDetails(dataVal, this.isPublic))
                .subscribe((res) => {
                    this.jobsLoadingFlag = true;
                    this._companyservice.getCompanyJobsWithFilter(this.companyId, [], currentPage)
                        .subscribe((jobs) => {
                            this.jobsLoadingFlag = false;
                            this.jobs = jobs[0];
                            this.jobs$ = Observable.of(this.jobs);
                            this.totalRecords$.next(jobs[1]['total_count']);
                            if (jobs[0].length === 0) {
                                currentPage = 1;
                            }

                            let queryParamHash = {page: currentPage};
                            // Route Correction
                            if ((this.accountService.getAuth() &&
                                !this.accountService.getCheckEmployer())
                                || !this.accountService.getAuth()) {
                                // Job seeker or Public
                                if (!this.accountService.getCheckEmployer()) {
                                    this._router.navigate(
                                        [this.accountService.getCurrLangUrl() +
                                        this.accountService.getPath() +
                                    '/companies/' +
                                        this.accountService.getSpaceToDashLowerCase(res['name'])
                                    + '-' + res['id']], {queryParams: queryParamHash});
                                }

                            }else {
                                // Employer
                                this._router.navigate([this.accountService.getCurrLangUrl() +
                                    this.accountService.getPath() + '/profile'],
                                    {queryParams: queryParamHash});

                            }

                        }, (error) => {
                            this._error.errorHandling(error);
                        });

                    this.loadingFlagsArray['companyLoader'] = false;
                    this.isAuthorized$.next(this.accountService.getAuth());
                    this.company = res;
                    this.accountService.setSwitchFlag(false);
                    this.companyDetails$ = Observable.of(this.company);
                    this.followers = this.company.follower;
                    this.folowers$ = Observable.of(this.followers);
                    let canonicalFlag = true;

                    /**
                     * Replacing placeholder with company name
                     */
                    this.seoDesc = this.seoDesc.replace('[company_name]', this.company['name']);
                    this.accountService.setPageDynamicSeo([this.company['name'] + ''],
                        canonicalFlag, this.seoDesc);
                    if (res['lat'] && res['long']) {
                        this.locationOffice$ = Observable.of({});
                        this.locationOffice$['lat'] = res['lat'];
                        this.locationOffice$['long'] = res['long'];
                        this.locationOffice$['google_url'] =
                            'https://www.google.com/maps/embed/v1/place?q=' +
                            res['lat'] + ',' + res['long'] +
                            '&key='+ConfigService.GOOGLE_MAP_AUTH_KEY;
                    }

                    // Handler to prevent sending non numeric company Id  to the cultures API.
                    if (!isNaN(this.companyId)) {
                        this._companyservice.getCompanyCulture(this.companyId)
                            .subscribe((cultures) => {
                            this.cultures = cultures;
                            this.cultures$ = Observable.of(this.cultures);
                        }, (error) => {
                            this._error.errorHandling(error);
                        });
                    }

                }, (error) => {
                    this._error.errorHandling(error);
                });

        });

    }

    public onFollow() {

        this._companyservice.getFollowCompany(this.company.id).subscribe((res) => {

            this.company.follower++;
            this.company.followingFlag = true;
            this.companyDetails$ = Observable.of(this.company);
        }, (error) => {
            this._error.errorHandling(error);
        });

    }

    public onUnfollow() {

        this._companyservice.getUnfollowCompany(this.company.id).subscribe((res) => {

            this.company.follower--;
            this.company.followingFlag = false;
            this.companyDetails$ = Observable.of(this.company);
        }, (error) => {
            this._error.errorHandling(error);
        });

    }

    public onApplyJob(jobId, index) {

        this._jobservice.applyJobNoAttach(jobId).subscribe((res) => {
                this.successFlag$.next(true);

                Observable.of(1).delay(2000)
                    .subscribe((x) => {
                        this.successFlag$.next(false);
                        jQuery('.close_delete').modal('hide');

                        let jobs = [];
                        this.jobs$.subscribe((jobsList) => {

                            jobsList.forEach((selJob, selIndex) => {
                                if (selIndex === index) {
                                    selJob['appliedFlag'] = true;
                                }
                                jobs.push(selJob);
                            });

                            this.jobs$ = Observable.of(jobs);

                        });

                    });
            },
            (error) => {

                this.errrorMessage$.next('Sorry apply for job failed');
                Observable.of(1).delay(2000)
                    .subscribe((x) => {
                        this.errrorMessage$.next(null);
                        jQuery('.close_delete').modal('hide');

                    });
                this._error.errorHandling(error);
            });

    }

    public onClickBack() {
        this.accountService.backClick();
    }

}
