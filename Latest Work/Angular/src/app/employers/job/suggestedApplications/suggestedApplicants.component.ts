import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router, ActivatedRoute } from '@angular/router';

// Services
import { AccountService } from '../../../core/account/services/account.service';
import { CompanyService } from '../../../core/services/company.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { JobService } from '../../../core/services/job.service';

declare var jQuery: any;

@Component({
    selector: 'suggested-applicants',
    templateUrl: 'suggestedApplicants.component.html',
    styleUrls: ['./suggestedApplications.scss']
})

export class SuggestedApplicantsComponent implements OnInit, OnDestroy {
    public activeSubscription;
    public activeParamsSubscription;
    public currentPage: number = 1;
    public orderBy = 'matching_percentage';
    public orderByName = 'Matching Percentage';
    public postQuery = '';
    public loadedData: boolean = false;
    public paramsList = {};
    public jobTitle = '';
    public jobCompanyName = '';
    public jobId = null;
    public currentJob = null;
    public loadedCommon: boolean = false;
    public showFilter: boolean = false;
    public msg_content: string = '';
    public currLan = 'en';
    public fixedTextHash = this.loaderService.getFixedText();

    // Observables
    public jobSeekers$: BehaviorSubject<any> = new BehaviorSubject(null);
    public targetApplicant$: BehaviorSubject<any> = new BehaviorSubject(null);
    public successAlert$: BehaviorSubject<any> = new BehaviorSubject(false);
    public failAlert$: BehaviorSubject<any> = new BehaviorSubject(false);
    public totalRecords$: BehaviorSubject<any> = new BehaviorSubject(0);

    public screenwidth = 0;
    public maxWindowSizeMobile = 767;
    public maxWindowSizetablet = 1024;

    // post hash map
    public postHash = {
        locations: 'q[loc_co_in]',
        cities: 'q[loc_ci_in]',
        sectors: 'q[se_in]',
        fareas: 'q[fa_in]',
        current_sal: 'q[cur_sal_in]',
        expect_sal: 'q[exp_sal_in]',
        edulevels: 'q[je_in]',
        explevels: 'q[yoe_in]',
        exprange: 'q[yoe_in]',
        age_group: 'q[age_in]',
        language: 'q[la_in]',
        gender: 'q[ge_in]',
        notice_period: 'q[not_in]',
        visa_status: 'q[vi_in]',
        job_type: 'q[jt_in]',
        nationality: 'q[nat_in]',
    };

    public postHashEq = {last_active: 'q[act_lteq]', status: 'q[app_status_eq]'};

    constructor(public accountService: AccountService, public fb: FormBuilder,
                public _companyService: CompanyService,
                public _jobService: JobService,
                public loaderService: LoaderService,
                public _activeRoute: ActivatedRoute,
                public _router: Router) {

        this.accountService.setSwitchFlag(false);

    }

    public onBack() {
        this._router.navigate([this.accountService.getCurrLangUrl() +
        this.accountService.getPath() + '/jobs/' + this.jobId + '/' +
        this.accountService.getSpaceToDashLowerCase(this.jobTitle) + '/applicants']);
    }

    public sortBy(orderBy, orderName) {
        this.orderByName = orderName;
        this.orderBy = orderBy;
        this.paramsList['order_by'] = orderBy;
        this._router.navigate([this.accountService.getCurrLangUrl() +
        this.accountService.getPath() + '/jobs/' + this.jobId + '/' +
        this.accountService.getSpaceToDashLowerCase(this.jobTitle) + '/suggest-candidates'],
            {queryParams: this.paramsList});

    }

    public ngOnInit() {
        this.accountService.setCustomSeo();
        this.currLan = this.accountService.getCurrLang();
        this.orderByName = this.fixedTextHash['matching_percentage'][this.currLan];
        this.activeSubscription = this._activeRoute.params.subscribe((selParams) => {
            window.scroll(0, 0);
            this.screenwidth = window.innerWidth;
            if (selParams['id']) {

                this.jobId = selParams['id'];

                this.activeParamsSubscription = this._activeRoute.queryParams
                    .subscribe((params) => {
                    this.loadedData = false;

                    this.postQuery = '';
                    this.paramsList = {};
                    if (params) {

                        Object.assign(this.paramsList, params);
                    }
                    this.orderBy = (params['order_by']) ? params['order_by'] : this.orderBy;

                    this.currentPage = (this.paramsList['page']) ? this.paramsList['page'] : 1;

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
                            });
                        }
                    }

                    // Loaded only once
                    if (this.loadedCommon == false) {
                        this.loadedCommon = true;
                        this._jobService.getJobDetails(selParams['id']).subscribe((res) => {
                                this.jobTitle = res.selectedJobs.title;
                                this.jobCompanyName = res.selectedJobs.companyObj.name;
                                this.currentJob = res.selectedJobs;
                                this.msg_content =
                                    this.fixedTextHash['invite_to_apply'][this.currLan];
                                this.msg_content.replace('JOBTITLE', this.jobTitle)
                                    .replace('JOBCOMPNAME', this.jobCompanyName);
                            },
                            (error) => {
                                this.accountService.getErrorCheck(error);
                            });
                    }

                    this._companyService.getJobseekersSuggested(selParams['id'], this.currentPage,
                        this.orderBy, this.postQuery).subscribe((res) => {
                            this.loadedData = true;
                            this.jobSeekers$.next(res['jobseekers']);
                            this.totalRecords$.next(res['meta']['total_count']);

                            if (res['jobseekers'].length == 0 && this.currentPage > 1) {

                                this.currentPage = 1;
                                this.paramsList['page'] = this.currentPage;
                                this._router.navigate([this.accountService.getCurrLangUrl()
                                + this.accountService.getPath() + '/jobs/' + this.jobId + '/' +
                                this.accountService.getSpaceToDashLowerCase(this.jobTitle) +
                                '/suggest-candidates'], {queryParams: this.paramsList});
                            }
                        },
                        (error) => {
                            this.accountService.getErrorCheck(error);
                        });
                });
            }
        });
    }

    public ngOnDestroy() {
        this.activeSubscription.unsubscribe();
        this.activeParamsSubscription.unsubscribe();
    }

    public openInvitationModal(applicant: any) {
        this.targetApplicant$.next(applicant);
        jQuery('.invite-all').modal();
    }

    public sendApplyInvitation() {

        let postData = {
            invited_jobseeker: {
                jobseeker_id: this.targetApplicant$.getValue().id,
                job_id: this.currentJob.id,
                msg_content: this.msg_content
            }
        };

        this._jobService.sendApplyInvitation(postData).subscribe((res) => {
            this.successAlert$.next(true);

            Observable.timer(5000).subscribe((val) => {
                this.successAlert$.next(false);
                jQuery('.invite-all').modal('hide');
            });
        }, (err) => {
            this.failAlert$.next(true);

            Observable.timer(5000).subscribe((val) => {
                this.failAlert$.next(false);
                jQuery('.invite-all').modal('hide');
            });
        });
    }
}
