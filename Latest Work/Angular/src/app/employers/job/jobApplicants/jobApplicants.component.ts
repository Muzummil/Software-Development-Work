import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router, ActivatedRoute } from '@angular/router';

// Services
import { AccountService } from '../../../core/account/services/account.service';
import { CompanyService } from '../../../core/services/company.service';
import { JobService } from '../../../core/services/job.service';
import { ErrorHandling } from '../../../core/services/errorHandling.service';
import { LoaderService } from '../../../shared/services/loader.service';

// Validation
import { LessThanValidator } from '../../../shared/validators/basicValidators';
import { ConfigService } from '../../../shared/config.service';

declare var jQuery: any;

@Component({
    selector: 'job-applicants',
    templateUrl: 'jobApplicants.component.html',
    styleUrls: ['./jobApplicants.scss']
})

export class JobsApplicantsComponent implements OnInit, OnDestroy {

    public activeSubscription;
    public activeParamsSubscription;
    public currentPage: number = 1;
    public orderBy = 'matching_percentage';
    public orderByName = 'Matching Percentage';
    public postQuery = '';
    public loadedData: boolean = false;
    public paramsList = {};
    public selParams = {};
    public jobTitle = '';
    public jobId = null;
    public loadedCommon: boolean = false;
    public bulkPostSuccess: boolean = false;
    public bulkPostError: boolean = false;
    public showFilter: boolean = false;
    public screenwidth = 0;
    public maxWindowSizeMobile = 767;
    public maxWindowSizetablet = 1024;
    public showApplicationStatus: boolean = false;
    public currLan = 'en';
    public fixedTextHash = this.loaderService.getFixedText();
    public processFlag: boolean = false;
    public bulkFeedbackInProcess = false;
    // Observables
    public jobSeekers$: BehaviorSubject<any> = new BehaviorSubject(null);
    public applicationStats$: BehaviorSubject<any> = new BehaviorSubject(null);

    public jobSeekersAnalysis$: BehaviorSubject<any> = new BehaviorSubject(null);
    public totalRecords$: BehaviorSubject<any> = new BehaviorSubject(0);
    public totalRecords = 0;
    public appStatusList$: BehaviorSubject<any> = new BehaviorSubject(null);
    public mPList$: BehaviorSubject<any> = new BehaviorSubject(null);
    public pristineFlag$: BehaviorSubject<any> = new BehaviorSubject(true);
    public feedbackExceptionList = ['Applied', 'Interview', 'Successful'];
    public reviewFilterList = {
        all: false,
        applied: false,
        reviewed: false,
        shortlisted: false,
        interviewed: false,
        successful: false,
        unsuccessful: false
    };
    public reviewFilterKey = {
        all: '',
        applied: 6,
        reviewed: 1,
        shortlisted: 2,
        interviewed: 3,
        successful: 4,
        unsuccessful: 5
    };

    // Post hash map
    public postHash = {
        locations: 'q[loc_co_in]',
        cities: 'q[loc_ci_in]',
        sectors: 'q[se_in]',
        fareas: 'q[fa_in]',
        current_sal: 'q[cur_sal_in]',
        expect_sal: 'q[exp_sal_in]',
        edulevels: 'q[je_in]',
        explevels: 'q[yoe_in]',
        exprange: 'q[exp_in]',
        age_group: 'q[age_in]',
        language: 'q[la_in]',
        gender: 'q[ge_in]',
        notice_period: 'q[not_in]',
        visa_status: 'q[vi_in]',
        job_type: 'q[jt_in]',
        nationality: 'q[nat_in]',
        school_in: 'q[school_in]',
        field_of_study_in: 'q[field_of_study_in]'
    };

    public postHashEq = { last_active: 'q[act_lteq]', status: 'q[app_status_eq]' };

    public bfeedForm: FormGroup;

    constructor(public accountService: AccountService, public fb: FormBuilder,
        public _companyService: CompanyService,
        public _jobService: JobService,
        public _errorHandling: ErrorHandling,
        public _activeRoute: ActivatedRoute,
        public loaderService: LoaderService,
        public _router: Router,
    ) {

        let formParams = {
            from: [null, Validators.required],
            to: [null, [Validators.required, LessThanValidator.lessThan]],
            jobStatus: ['', Validators.required],
            feedback: ['']
        };

        this.accountService.setSwitchFlag(false);

        this.bfeedForm = this.fb.group(formParams);
    }

    public setAnalysisFilter(filter) {

        delete this.paramsList['status'];
        if (filter != 'all') {
            this.paramsList['status'] = this.reviewFilterKey[filter];
        }
        this._router.navigate([this.accountService.getCurrLangUrl() +
            this.accountService.getPath() + '/jobs/' + this.jobId + '/' +
            this.accountService.getSpaceToDashLowerCase(this.jobTitle) + '/applicants'],
            { queryParams: this.paramsList });

    }

    public getCandidatePath(jobId: number) {
        return '/jobs/' + jobId + '/' +
            this.accountService.getSpaceToDashLowerCase(this.jobTitle) + '/suggest-candidates';
    }

    public getApplicationStats() {
        this.showApplicationStatus = (this.showApplicationStatus) ? false : true;
        if (this.applicationStats$.value == null) {
            this.processFlag = true;
            this._jobService.getJobApplicationStats(this.jobId)
                .subscribe((res) => {
                    this.processFlag = false;
                    this.totalRecords = res[0];
                    this.applicationStats$.next(res[1]['jobCharts']);

                });
        }

    }

    public sendBulkMail() {
        this.pristineFlag$.next(false);
        if (this.bfeedForm.valid && !this.bulkFeedbackInProcess) {
            this.bulkFeedbackInProcess = true;
            this._jobService.sendBulkFeedBack(this.jobId, this.bfeedForm.value['from'],
                this.bfeedForm.value['to'], this.bfeedForm.value['jobStatus'],
                this.bfeedForm.value['feedback'])
                .subscribe((res) => {

                    this.bulkPostSuccess = true;
                    Observable.timer(2000).subscribe((r) => {
                        this.bulkPostSuccess = false;
                        jQuery('.bulk-feedback').modal('hide');
                        this.pristineFlag$.next(true);
                        this.bfeedForm.reset();
                        this.bulkFeedbackInProcess = true;
                        this.getJobseekerApplied(this.selParams);
                    });
                },
                    (error) => {
                        this.bulkPostError = true;
                        Observable.timer(1000).subscribe((r) => {
                            this.bulkPostError = false;
                            jQuery('.bulk-feedback').modal('hide');
                            this.bulkFeedbackInProcess = false;
                        });
                        this.accountService.getErrorCheck(error);
                    });
        }
    }

    public sortBy(orderBy, orderName) {
        this.orderByName = orderName;
        this.orderBy = orderBy;
        this.paramsList['order_by'] = orderBy;
        this._router.navigate([this.accountService.getCurrLangUrl() +
            this.accountService.getPath() + '/jobs/' + this.jobId + '/' +
            this.accountService.getSpaceToDashLowerCase(this.jobTitle) + '/applicants'],
            { queryParams: this.paramsList });
    }

    public ngOnInit() {
        this.accountService.setCustomSeo();
        this.currLan = this.accountService.getCurrLang();
        this.orderByName = this.fixedTextHash['matching_percentage'][this.currLan];
        this.activeSubscription = this._activeRoute.params.subscribe((selParams) => {
            window.scroll(0, 0);
            this.screenwidth = window.innerWidth;
            if (selParams['id']) {

                this.selParams = selParams;
                this.jobId = selParams['id'];

                this.activeParamsSubscription = this._activeRoute.queryParams
                    .subscribe((params) => {
                        this.loadedData = false;
                        let statusSet = false;

                        // Reset the hash
                        for (let key2 in this.reviewFilterList) {
                            if (this.reviewFilterList.hasOwnProperty(key2)) {
                                this.reviewFilterList[key2] = false;
                            }

                        }

                        this.postQuery = '';
                        this.paramsList = {};
                        if (params) {

                            Object.assign(this.paramsList, params);
                        }

                        this.currentPage = (this.paramsList['page']) ? this.paramsList['page'] : 1;

                        this.orderBy = (params['order_by']) ? params['order_by'] : this.orderBy;
                        for (let key in this.paramsList) {
                            if (params.hasOwnProperty(key)) {
                                let paramSplit = params[key].toString().split(',');
                                paramSplit.forEach((selVal) => {
                                    if (this.postHash[key]) {
                                        this.postQuery += '&' + this.postHash[key] + '[]=' + selVal;
                                    }
                                    if (this.postHashEq[key]) {
                                        this.postQuery += '&' + this.postHashEq[key] + '=' + selVal;
                                    }

                                    if (key == 'status') {

                                        statusSet = true;
                                        for (let key2 in this.reviewFilterKey) {
                                            this.reviewFilterList[key2] = false;
                                            if (this.reviewFilterKey.hasOwnProperty(key2) &&
                                                this.reviewFilterKey[key2] == selVal) {
                                                this.reviewFilterList[key2] = true;
                                            }

                                        }

                                    }

                                });

                            }
                        }

                        // Loaded only once
                        if (this.loadedCommon === false) {

                            this.loadedCommon = true;
                            this._jobService.getJobDetails(selParams['id']).subscribe((res) => {
                                this._router.navigate([this.accountService.getCurrLangUrl()
                                    + this.accountService.getPath() + '/jobs/' + this.jobId + '/' +
                                    this.accountService
                                        .getSpaceToDashLowerCase(res['selectedJobs']['title'])
                                    + '/applicants'], { queryParams: params });

                                this.jobTitle = res.selectedJobs.title;
                            },
                                (error) => {
                                    this._errorHandling.errorHandling(error);
                                }
                            );

                            let jobASList = [];

                            AccountService.s3Loaded$.subscribe((resFlag) => {
                                if (resFlag) {
                                    this.loaderService.getJobStatuses()
                                        .forEach((selStatus) => {
                                            if (this.feedbackExceptionList.indexOf(selStatus['status'])
                                                === -1) {
                                                jobASList.push({
                                                    id: selStatus['id'],
                                                    name: selStatus['status']
                                                });
                                            }
                                        });
                                }
                            });
                            this.appStatusList$.next(jobASList);

                            let matchingPercentage = [];
                            for (let i = 0; i <= 100; i++) {

                                matchingPercentage.push({ id: i, name: i + '%' });
                            }
                            this.mPList$.next(matchingPercentage);

                            this._companyService.getJobseekersAppliedAnalysis(selParams['id'])
                                .subscribe((res) => {
                                    this.jobSeekersAnalysis$.next(res['job_application_analysis']);
                                }, (error) => {
                                    this._errorHandling.errorHandling(error);
                                });
                        }
                        this.getJobseekerApplied(this.selParams);

                        if (!statusSet) {
                            this.reviewFilterList['all'] = true;
                        }
                    });

            }

        });

    }

    public getJobseekerApplied(selParams) {
        this._companyService.getJobseekersApplied(selParams['id'], this.currentPage, this.orderBy,
            this.postQuery).subscribe((res) => {

                this.loadedData = true;
                this.jobSeekers$.next(res['applicants']);
                this.totalRecords$.next(res['meta']['total_count']);

                if (res['applicants'].length == 0 && this.currentPage > 1) {

                    this.currentPage = 1;
                    this.paramsList['page'] = this.currentPage;
                    this._router.navigate([this.accountService.getCurrLangUrl() +
                        this.accountService.getPath() + '/jobs/' + this.jobId + '/' +
                        this.accountService.getSpaceToDashLowerCase(this.jobTitle) + '/applicants'],
                        { queryParams: this.paramsList });

                }

            },
                (error) => {
                    this._errorHandling.errorHandling(error);
                });
    }

    public ngOnDestroy() {

        this.activeSubscription.unsubscribe();
        this.activeParamsSubscription.unsubscribe();
    }

    public onBack() {
        this._router.navigate([this.accountService.getCurrLangUrl() +
            this.accountService.getPath() + '/jobs']);
    }

    public getUpdateTags(jobseekerIndex, tags) {
        this.jobSeekers$.value[jobseekerIndex]['hash_tags'] = tags;
    }

    public refreshDetails() {
        this.loadedData = false;
        var postData = [];
        postData["id"] = this.jobId;
        this._companyService.getJobseekersAppliedAnalysis(this.jobId)
            .subscribe((res) => {
                this.jobSeekersAnalysis$.next(res['job_application_analysis']);

            }, (error) => {
                this._errorHandling.errorHandling(error);
            });
        this.getJobseekerApplied(postData)
    }

}
