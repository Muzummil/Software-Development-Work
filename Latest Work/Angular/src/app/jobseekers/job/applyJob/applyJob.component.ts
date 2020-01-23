import { Component, OnInit, Input } from '@angular/core';
import { ResumeCoverService } from '../../profile/services/resume_cover.services';
import { JobseekerJobService } from './../services/jobseekerJob.service';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute } from '@angular/router';

// Forms
import { FormBuilder } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Location } from '@angular/common';

// @ts-ignore
import { ProfileService } from '../../../core/services/profile.service';
import { AccountService } from '../../../core/account/services/account.service';

@Component({

    selector: 'apply-jobs',
    templateUrl: 'applyJob.component.html',
    styleUrls: ['./applyJob.scss'],
    providers: [ProfileService]
})

export class ApplyJobComponent implements OnInit {

    public listResumes = [];
    public listResumes$: BehaviorSubject<any> = new BehaviorSubject(null);
    public sub;
    public routeParamsFlag: boolean = true;

    @Input() jobId: number;
    @Input() jobTitle: string;

    public listCoverLetter = [];
    public listCoverLetter$: BehaviorSubject<any> = new BehaviorSubject(null);

    public resumeId = null;
    public coverLetterId = null;
    public appliedDate = null;
    public matchingPercent = 0;
    public errrorFlag$: BehaviorSubject<any> = new BehaviorSubject(false);
    public errrorMessage$: BehaviorSubject<any> = new BehaviorSubject(null);
    public successFlag$: BehaviorSubject<any> = new BehaviorSubject(null);
    public profileHeader$: BehaviorSubject<any> = new BehaviorSubject(null);


    constructor(fb: FormBuilder, public _location: Location, public _router: Router,
                public _activeRoute: ActivatedRoute, public accountService: AccountService,
                public _resumeCoverService: ResumeCoverService, public _jobService: JobseekerJobService,
                public _profileService: ProfileService) {
        this.accountService.setSwitchFlag(false);

    }
    public ngOnInit() {

        if (this.jobTitle) {
            this.routeParamsFlag = false;
        }

        this.sub = this._activeRoute.params.subscribe((params) => {
            window.scroll(0, 0);
            if (params['id']) {
                this.jobId = params['id'];
            }

            this._jobService.getJobDetails(this.jobId)
                .subscribe((res) => {
                    this.jobTitle = res['selectedJobs']['title'];
                    this.appliedDate = res['selectedJobs']['appliedDate'];
                    this.matchingPercent = res['selectedJobs']['matchingPercent'];

                });

        });

        this._resumeCoverService.getCoverLetterList().subscribe((res) => {

            this.listCoverLetter = res;

            this.listCoverLetter$.next(this.listCoverLetter);
        });

        this._resumeCoverService.getResumeList().subscribe((res) => {

            this.listResumes = res;

            this.listResumes$.next(this.listResumes);
        });

        this.profileHeader$.next(this._profileService.getProfileHeader());
    }

    public onApplyJob() {

        this.listResumes.forEach((res) => {
            if (res.default == true) {
                this.resumeId = res.id;
            }

        });

        this.listCoverLetter.forEach((res) => {
            if (res.default == true) {
                this.coverLetterId = res.id;
            }

        });

        if (this.resumeId != null) {
            this._jobService.applyJobNoAttach(this.jobId).subscribe((res) => {
                    this.successFlag$.next(true);
                    Observable.of(1).delay(1000)
                        .subscribe((x) => {
                            this._router.navigate([this.accountService.getCurrLangUrl() +
                            this.accountService.getPath() + '/jobs/my-jobs']);
                        });
                },
                (error) => this.errrorMessage$.next('Sorry apply for job failed'));
        } else {
            this.errrorFlag$.next(true);
        }

    }

    public onSelectResume(index) {

        this.errrorFlag$.next(false);
        this.errrorMessage$.next(null);
        this.successFlag$.next(null);

        this.listResumes.forEach((res) => {
            res.default = false;
        });

        this.listResumes[index].default = true;
        this.listResumes$.next(this.listResumes);
    }

    public onSelectCoverLetter(index) {

        this.errrorFlag$.next(false);
        this.errrorMessage$.next(null);
        this.successFlag$.next(null);

        this.listCoverLetter.forEach((res) => {
            res.default = false;
        });

        this.listCoverLetter[index].default = true;
        this.listCoverLetter$.next(this.listCoverLetter);
    }

    public onClickBack() {

        this._location.back();
    }


}
