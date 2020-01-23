import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router, ActivatedRoute } from '@angular/router';

// services
import { AccountService } from '../../../core/account/services/account.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { ProfileService } from '../../../core/services/profile.service';
import { ConfigService } from '../../../shared/config.service';

let moment = require('moment');

@Component({
    selector: 'candidate-employer',
    templateUrl: 'candidate.component.html',
    styleUrls: ['./candidate.scss']
})

export class CandidateComponent implements OnInit, OnDestroy {

    public companyId: number = null;
    public candidateName: string = '';
    public candidateDetailsObs: BehaviorSubject<any> = new BehaviorSubject(null);
    public social_media_video$: BehaviorSubject<any> = new BehaviorSubject(null);
    public profileFormValidateFlag$: BehaviorSubject<any> = new BehaviorSubject(false);
    public loadSpinner$: BehaviorSubject<any> = new BehaviorSubject(false);

    public video_screenshot$: BehaviorSubject<any> = new BehaviorSubject(null);
    public matching_percentage$: BehaviorSubject<any> = new BehaviorSubject(null);
    public has_job$: BehaviorSubject<any> = new BehaviorSubject(false);

    public activeRouterObs;
    public jobseekerType:string;
    public jobseekerHaveType:string;
    public profileFormValidateFlag: boolean = true;
    public showDownloadSpinner = false;
    public age;
    public is_applied;
    public jobApplication = null;
    public defaultResume = null;
    public helper;
    public defaultCoverLetter = null;
    public genderHash = {
        'female': 'Female',
        'male': 'Male',
        '<em>Male</em>': '<em>Male</em>',
        '<em>male</em>': '<em>Male</em>',
        '<em>female</em>': '<em>Female</em>',
        '<em>Female</em>': '<em>Female</em>'
    };
    public marryHash = {
        'single': 'Single',
        'married': 'Married',
        '<em>single</em>': '<em>Single</em>',
        '<em>Single</em>': '<em>Single</em>',
        '<em>married</em>': '<em>Married</em>',
        '<em>Married</em>': '<em>Married</em>'
    };
    public searchString = '';
    public currLan = 'en';
    public fixedTextHash = this.loaderService.getFixedText();

    @Input() candidateId: number = null;
    @Input() jobId: number = null;
    @Input() appliedFlag: boolean = false;
    @Input() headerString: string = ' Candidate Detail ';

    constructor(public accountService: AccountService,
                public loaderService: LoaderService,
                public _profileService: ProfileService,
                public _router: Router,
                public _activeRoute: ActivatedRoute) {

        if (this.companyId == null) {
            this.companyId = this.accountService.getCompanyId();

        }
        this.accountService.setSwitchFlag(false);
    }

    public ngOnDestroy() {
        this.activeRouterObs.unsubscribe();
    }

    public ngOnInit(): void {
        this.currLan = this.accountService.getCurrLang();
        this.has_job$.next(this._router.url.indexOf('job_id') != -1);
        // URL Params Fetch
        this.activeRouterObs = this._activeRoute.queryParams.subscribe((params) => {
            window.scroll(0, 0);
            if (params['search']) {
                this.searchString = params['search'];

            }
            this.getProfile();
        });

        this.loadSpinner$.next(true);
    }

    public getProfile() {

        this._profileService.getProfile(this.candidateId, this.jobId, this.searchString)
            .subscribe((res) => {
                this.jobseekerType = res.jobseeker_type;
                this.jobseekerHaveType = this.jobseekerType + '_contain_exp';
                this.jobApplication = res;
                this.is_applied = res['is_applied'];
                this.matching_percentage$.next(res['matching_percentage']);
                if (res['resumes'] && res['resumes'].length) {
                    let BreakException = {};
                    try {
                        res['resumes'].forEach((selRes) => {
                            this.defaultResume = selRes;
                            if (selRes.default) {
                                throw BreakException;
                            }
                        });

                    } catch (e) {
                        if (e !== BreakException) throw e;
                    }

                }

                if (res['coverletters'] && res['coverletters'].length) {

                    let BreakException = {};
                    try {
                        res['coverletters'].forEach((selCover) => {
                            this.defaultCoverLetter = selCover;
                            if (selCover.default) {
                                throw BreakException;
                            }

                        });
                    } catch (e) {
                        if (e !== BreakException) throw e;
                    }
                }

                this.candidateName = res['first_name'] + ' ' + res['last_name'];
                this.candidateDetailsObs.next(res);

                if (res['general_info']['dob']) {
                    this.age = Number((new Date().getTime() -
                        new Date(res['general_info']['dob']['year'],
                            res['general_info']['dob']['month'],
                            res['general_info']['dob']['day']).getTime()) / 31536000000)
                        .toFixed(0);
                }

                this.social_media_video$.next(res['video']);
                this.video_screenshot$.next(res['video_screenshot']);
                this.loadSpinner$.next(false);
            }, (error) => {
                this.accountService.getErrorCheck(error);
            });
    }

    public getUpdateTags(tags) {
        this.candidateDetailsObs.value['hash_tags'] = tags;
    }

    public onSavePDF() {
        this.showDownloadSpinner = true;
        this.profileFormValidateFlag$.next(false);
        this._profileService.getProfilePdf(this.candidateId, this.candidateName)
            .subscribe((res) => {

                if (res === 'success') {
                    this.profileFormValidateFlag$.next(true);
                    this.showDownloadSpinner = false;
                }
            });
        this.profileFormValidateFlag = false;
    }

    public onBack() {
        window.history.back();
    }
}
