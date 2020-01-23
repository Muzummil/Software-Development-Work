import { OnInit, Component, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

// Service
import { JobseekerJobService } from './../services/jobseekerJob.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../../core/account/services/account.service';
import { BasicValidators } from '../../../shared/validators/basicValidators';
import { LoaderService } from '../../../shared/services/loader.service';

let moment = require('moment-timezone');

declare var Intl: any;
declare var jQuery: any;

@Component({

    selector: 'my-jobs',
    templateUrl: 'myJobs.component.html',
    styleUrls:['./myJobs.scss']

})

export class MyJobsComponent implements OnInit, OnDestroy {
    public activeRouterObs;

    public currentPage = 1;
    public totalPages = 1;

    public jobList$ = Observable;
    public form1: FormGroup;
    public formhangout: FormGroup;
    public formskype: FormGroup;
    public formgomeet: FormGroup;
    public formphone: FormGroup;
    public formReply: FormGroup;
    public checkallFlag: boolean = false;
    public successPost: boolean = false;
    public postDone: boolean = false;
    public failedPost: boolean = false;
    public jobApplicationId: number = null;
    public stats$ = new BehaviorSubject(null);
    public jobs$ = new BehaviorSubject(null);
    public myJobsPagination$: BehaviorSubject<any> = new BehaviorSubject(null);
    public displaySpinner$: BehaviorSubject<any> = new BehaviorSubject(true);
    public totalRecords$: BehaviorSubject<any> = new BehaviorSubject(1);
    public pristineFlag$: BehaviorSubject<any> = new BehaviorSubject(true);
    public activateButton = true;
    public interviewTimeList = [];
    public fixedTextHash = this.loaderService.getFixedText();
    public currLan = 'en';
    public browserTimeZone = '';

    constructor(public _jobservice: JobseekerJobService,
                public fb: FormBuilder,
                public _activeRoute: ActivatedRoute,
                public loaderService: LoaderService,
                public _router: Router,
                public accountService: AccountService) {
        this.browserTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    }

    public timeCorrection(appointmentTime, timezone) {

        if (!appointmentTime) {
            return appointmentTime;
        }
        let appointmentSplit = appointmentTime.split('T');
        let appointmentTimeSplit = appointmentSplit[1].split('.');
        return moment.tz(appointmentSplit[0] + ' ' + appointmentTimeSplit[0], timezone);
    }

    public getActivateButton(contactType = '') {

        this.pristineFlag$.next(false);
        this.activateButton = true;
    }

    public showFeedback(id) {
        this.jobs$.value[id].showFeedbackFlag = true;
    }

    public hideFeedback(id) {
        this.jobs$.value[id].showFeedbackFlag = false;
    }

    public rejectInterview(jobAppid, interviewId) {

        this.formReply.controls['reply'].markAsTouched();
        if (this.formReply.valid) {
            this._jobservice.acceptRejectInterview(jobAppid, interviewId,
                this.formReply.value.reply, null).subscribe((res) => {
                jQuery('.close_popup').modal('hide');
                this.successPost = true;
                this.postDone = true;
                this.formReply.reset();
                Observable.timer(5000).subscribe((delay) => {
                    this.successPost = false;
                });
            }, (error) => {
                this.getFailedPost();
            });
        }

    }

    public acceptInterview(jobAppid, interviewId, contactValue = 'Call') {

        this.formReply.controls['reply'].markAsTouched();
        let makePost = false;

        this._jobservice.acceptRejectInterview(jobAppid, interviewId,
            'Interview Accepted', contactValue).subscribe((res) => {
            this.formReply.reset();
            this.jobs$.value.forEach((selres, selcnt) => {
                if (selres['jobAppId'] === jobAppid) {
                    selres['employersFeedbackInterview'] = res['interview'];
                    this.interviewTimeList
                        .push(moment(
                            Date.parse(selres['employersFeedbackInterview']['appointment']))
                            .tz('UTC').format('h:mm a'));
                }

            });

            jQuery('.close_popup').modal('hide');
            this.successPost = true;
            this.postDone = true;
            Observable.timer(5000).subscribe((res) => {
                this.successPost = false;
            });
        }, (error) => {
            this.getFailedPost();
            this.accountService.getErrorCheck(error);

        });

    }

    public getFailedPost() {
        jQuery('.close_popup').modal('hide');
        this.failedPost = true;
        Observable.timer(5000).subscribe((res) => {
            this.failedPost = false;
        });
    }

    public loadAppliedJobs() {
        window.scroll(0, 0);

        let elements1 = {
            check_all: ['', Validators.required],
            sortby_today: ['', Validators.required]
        };
        this.form1 = this.fb.group(elements1);
        this.formhangout = this.fb.group({contact: ['', BasicValidators.email]});
        this.formskype = this.fb.group({contact: ['', Validators.required]});
        this.formgomeet = this.fb.group({contact: ['', Validators.required]});
        this.formphone = this.fb.group({contact: ['', Validators.required]});
        this.formReply = this.fb.group({reply: ['', Validators.required]});

        this.accountService.setSwitchFlag(false);

        let dateEvent = this.form1.controls['sortby_today'].valueChanges;

        // URL Params Fetch
        this.activeRouterObs = this._activeRoute.queryParams.subscribe((params) => {
            this.displaySpinner$.next(true);
            this.currentPage = (params['page']) ? params['page'] : 1;
            this.myJobsPagination$.next(this.currentPage);

            if (!this.accountService.getAuth()) {
                this._router.navigate([this.accountService.getCurrLangUrl() + 'jobs']);
            }
        });

        this._jobservice.getMyJobStats().subscribe((res) => {
            this.stats$.next(res['summary']);
        });

        let cached = false;
        Observable.merge(
            dateEvent,
            this.myJobsPagination$
        )
            .switchMap((flag) => this._jobservice
                .getMyJobList('', '', null, this.currentPage, cached))
            .subscribe((res) => {
                this.displaySpinner$.next(false);

                // Re formatting the time
                res['jobs'].forEach((selres, selcnt) => {
                    if (selres['employersFeedbackInterview']) {
                        this.interviewTimeList
                            .push(moment(Date
                                .parse(selres['employersFeedbackInterview']['appointment']))
                                .tz('UTC')
                                .format('h:mm a'));
                    } else {
                        this.interviewTimeList.push(null);
                    }

                });

                this.jobs$.next(res['jobs']);

                this.totalRecords$.next(res['meta']['total_count']);
            });
    }

    public ngOnInit() {
        this.currLan = this.accountService.getCurrLang();
        this.loadAppliedJobs();

    }

    public ngOnDestroy() {
        this.activeRouterObs.unsubscribe();
    }

}
