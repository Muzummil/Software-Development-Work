import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router, ActivatedRoute } from '@angular/router';

// Services
import { AccountService } from '../../../core/account/services/account.service';
import { CompanyService } from '../../../core/services/company.service';
import { ProfileService } from '../../../core/services/profile.service';
import { ErrorHandling } from '../../../core/services/errorHandling.service';
import { LoaderService } from '../../../shared/services/loader.service';

// Validators

// var bootstrap = require('bootstrap');
let moment = require('moment');
declare var jQuery: any;
declare var Intl: any;

@Component({
    selector: 'jobseeker-profile-communication',
    templateUrl: 'candidateProfileCom.component.html',
    styleUrls: ['./candidateProfileCom.scss']
})

export class CandidateProfileComComponent implements OnInit, OnDestroy {

    @Input() candidateName: number = null;
    @Input() jobApplication = null;
    public candidateId: number = null;
    public jobId: number = null;
    public paramsObs;
    public offerLetterSelectedFlag = false;
    public generateOfferSelectedFlag = false;
    public appliedFlag = true;
    public postErrorFlag = false;
    public postSuccessFlag = false;
    public queryParamsObs;
    public singleLoad: boolean = false;
    public jobAppId = null;
    public interviewTime = null;
    public showofferletterFlag: boolean = false;
    public jobAppStatusId = 0;
    public jobAppStatusStatus = 'Unprocessed';
    public postInProcess = false;
    public jobBakAppStatusId = 1;
    public notAddFlag: boolean = false;
    public jobDetails = null;
    public browserTimeZone = '';
    public validInterviewTime: boolean = true;
    public downloadingFlag: boolean = false;

    public minMinutesBeforeInterview = 0;

    public candidateDetailsObs: BehaviorSubject<any> = new BehaviorSubject(null);
    public pristineFlag$: BehaviorSubject<any> = new BehaviorSubject(true);
    public pristineReviewFlag$: BehaviorSubject<any> = new BehaviorSubject(true);
    public pristineSuccessFlag$: BehaviorSubject<any> = new BehaviorSubject(true);
    public pristineOfferFlag$: BehaviorSubject<any> = new BehaviorSubject(true);
    public pristineShortedFlag$: BehaviorSubject<any> = new BehaviorSubject(true);
    public pristineUnSuccessFlag$: BehaviorSubject<any> = new BehaviorSubject(true);
    public pristineInterviewFlag$: BehaviorSubject<any> = new BehaviorSubject(true);
    public stausChangeListObs: BehaviorSubject<any> = new BehaviorSubject(null);
    public noteListObs: BehaviorSubject<any> = new BehaviorSubject(null);
    public notesList = [];
    public modeHash = {
        Hangout: 'email',
        Skype: 'skype',
        GoMeeting: 'goMeeting',
        Phone: 'phone',
        Call: 'call',
        Physical: 'physical'
    };

    public minDate = moment()._d;

    public postProgress = false;
    public formNote: FormGroup;
    public formAppReviewed: FormGroup;
    public formAppShortListed: FormGroup;
    public formAppUnSuccess: FormGroup;
    public formAppSuccess: FormGroup;
    public formAppInterview: FormGroup;
    public formGenerateOffer: FormGroup;
    public currLan = 'en';
    public fixedTextHash = this.loaderService.getFixedText();
    public allUsers = null;
    public offerLetter: File;

    constructor(public accountService: AccountService, public _fb: FormBuilder,
                public _companyService: CompanyService,
                public _errorHandling: ErrorHandling,
                public loaderService: LoaderService,
                public _profileService: ProfileService,
                public _activeRoute: ActivatedRoute,
                public _router: Router) {

        let paramsNote = {note: ['', Validators.required]};
        this.formNote = _fb.group(paramsNote);
        this.browserTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        this.accountService.setSwitchFlag(false);

        this.currLan = this.accountService.getCurrLang();

        // Status Flags
        //  6 -> Applied
        // 1 -> Reviewed
        // 2 -> Shortlisted
        // 3 -> Interviewed
        // 4 -> Successful
        // 5 -> Unsuccessful

        let paramsAppStatus = {
            comment: ['', Validators.required],
            status: [1, Validators.required]
        };
        this.formAppReviewed = _fb.group(paramsAppStatus);
        this.formAppShortListed = _fb.group({
            comment: [''],
            notify_me: [false, Validators.required],
            status: [2, Validators.required]
        });
        this.formAppUnSuccess = _fb.group({
            comment: ['',
                Validators.required],
            notify_me: [false, Validators.required],
            status: [5, Validators.required]
        });

        this.formAppSuccess = _fb.group(
            {
                comment: ['', Validators.required],
                notify_me: [false, Validators.required],
                status: [4, Validators.required],
                fileName: ['']
            });

        this.formGenerateOffer = _fb.group({
            title: ['', Validators.required],
            content: ['', Validators.required]
        });
        this.formAppInterview = _fb.group({
            comment: [''],
            status: [3, Validators.required],
            date: ['', Validators.required],
            timeZone: ['', Validators.required],
            time: ['', Validators.required],
            duration: ['', Validators.required],
            additionalComment: [''],
            interviewee: ['', Validators.required],
            mode: ['Call', Validators.required]

        });

    }

    public timeCorrection(appointmentTime, timezone) {
        let appointmentSplit = appointmentTime.split('T');
        let appointmentTimeSplit = appointmentSplit[1].split('.');
        return moment.tz(appointmentSplit[0] + ' ' + appointmentTimeSplit[0], timezone);
    }

    public getAllUsers() {

        if (!this.allUsers) {
            this._companyService.getCompanyUsers(this.accountService.getCompanyId(),
                100, true).subscribe((res) => {
                this.allUsers = res['users'];
            });
        }

    }

    public removeOfferLetter(mode = 'upload') {

        if (mode === 'upload') {
            this.formAppSuccess.controls['fileName'].setValue(null);
            this.offerLetterSelectedFlag = false;
            this.offerLetter = null;
        }
        if (mode === 'generate') {

            this.generateOfferSelectedFlag = false;
        }
    }

    public setNotifyShortlisted(isChecked) {
        this.formAppShortListed.controls['notify_me'].setValue(isChecked);
    }

    public setNotifySuccessful(isChecked) {
        this.formAppSuccess.controls['notify_me'].setValue(isChecked);
    }

    public setNotifyUnsuccessful(isChecked) {
        this.formAppUnSuccess.controls['notify_me'].setValue(isChecked);
    }

    public generateOffer() {

        this.pristineOfferFlag$.next(false);
        if (this.formGenerateOffer.valid) {

            this.removeOfferLetter();
            this.generateOfferSelectedFlag = true;
            jQuery('.generate-offer').modal('hide');
        }
    }

    public closeGenerateBox() {
        jQuery('.generate-offer').modal('hide');
    }

    public selectFile($event) {

        this.offerLetter = $event.target.files[0];
        let file: Blob = $event.target.files[0];
        this.offerLetterSelectedFlag = true;
        this.generateOfferSelectedFlag = false;
    }

    public shareFeedbackSucess() {

        this.pristineSuccessFlag$.next(false);

        if (this.formAppSuccess.valid && !this.postInProcess) {

            if (this.generateOfferSelectedFlag == true) {

                if (this.formGenerateOffer.valid) {
                    this.postInProcess = true;
                    this._profileService.postApplicationGenerateOfferLetter(this.jobAppId,
                        this.formAppSuccess.value['status'],
                        this.formAppSuccess.value['comment'],
                        this.formGenerateOffer.value['title'],
                        this.formGenerateOffer.value['content'],
                        this.formAppSuccess.value['notify_me']
                    ).subscribe((res) => {
                            this.postInProcess = false;
                            this.jobAppStatusId = this.getCorrectCode(
                                res['job_application_status_change']['job_application_status']);
                            this.jobAppStatusStatus = 'Successful';
                            this.stausChangeListObs.value
                                .unshift(res['job_application_status_change']);
                            this.postSuccessFlag = true;
                            Observable.timer(2000).subscribe((r) => {
                                this.postSuccessFlag = false;
                            });
                        },
                        (error) => {
                            this.postInProcess = false;
                            this.postErrorFlag = true;
                            Observable.timer(2000).subscribe((r) => {
                                this.postErrorFlag = false;
                            });
                            this.accountService.getErrorCheck(error);
                        });
                }

            } else {

                if (this.offerLetterSelectedFlag === true && !this.postInProcess) {

                    this.postInProcess = true;
                    this._profileService.postApplicationOfferLetter(this.jobAppId,
                        this.formAppSuccess.value['status'],
                        this.formAppSuccess.value['comment'],
                        this.offerLetter,
                        this.formAppSuccess.value['notify_me']
                    ).subscribe((res) => {
                            this.postInProcess = false;
                            this.jobAppStatusId = this.getCorrectCode(
                                res['job_application_status_change']['job_application_status']);
                            this.jobAppStatusStatus = 'Successful';
                            this.stausChangeListObs.value
                                .unshift(res['job_application_status_change']);
                            this.postSuccessFlag = true;
                            Observable.timer(2000).subscribe((r) => {
                                this.postSuccessFlag = false;
                            });
                        },
                        (error) => {
                            this.postInProcess = false;
                            this.postErrorFlag = true;
                            Observable.timer(2000).subscribe((r) => {
                                this.postErrorFlag = false;
                            });
                            this.accountService.getErrorCheck(error);
                        });
                }

            }

        }
    }

    public getValidateInterviewTime() {
        return moment.tz(this.formAppInterview.value['date'] + ' ' +
            this.formAppInterview.value['time'], 'D MMM, YYYY h:mm a',
            this.formAppInterview.value['timeZone'])
            .diff(moment.tz(this.formAppInterview.value['timeZone']), 'minute') >=
            this.minMinutesBeforeInterview;
    }

    public shareFeedbackInterview() {

        this.pristineInterviewFlag$.next(false);

        if (this.formAppInterview.valid && !this.postInProcess) {
            this.validInterviewTime = this.getValidateInterviewTime();
            if (this.validInterviewTime) {
                this.postInProcess = true;
                this._profileService.postApplicationInterview(this.jobAppId,
                    this.formAppInterview.value['status'],
                    this.formAppInterview.value['comment'],
                    this.formAppInterview.value['date'],
                    this.formAppInterview.value['time'],
                    this.formAppInterview.value['timeZone'],
                    this.formAppInterview.value['duration'],
                    this.formAppInterview.value['additionalComment'],
                    this.formAppInterview.value['interviewee'],
                    this.formAppInterview.value['mode'],
                    this.formAppInterview.value[this.modeHash[this.formAppInterview.value['mode']]]
                ).subscribe((res) => {
                        this.jobAppStatusId = this.getCorrectCode(
                            res['job_application_status_change']['job_application_status']);
                        this.jobAppStatusStatus = 'Interview';
                        this.getAllUsers();
                        this.stausChangeListObs.value.unshift(res['job_application_status_change']);
                        this.postSuccessFlag = true;
                        this.postInProcess = false;
                        Observable.timer(2000).subscribe((res) => {
                            this.postSuccessFlag = false;
                            this.jobAppStatusId++;
                        });
                    },
                    (error) => {
                        this.postInProcess = false;
                        this.postErrorFlag = true;
                        Observable.timer(2000).subscribe((r) => {
                            this.postErrorFlag = false;
                        });
                    });
            }

        }
    }

    public shareFeedbackUnSuccess() {

        this.pristineUnSuccessFlag$.next(false);
        if (this.formAppUnSuccess.valid && !this.postInProcess) {
            this._postFeedBack(this.jobAppId, this.formAppUnSuccess.value['status'],
                this.formAppUnSuccess.value['comment'],
                this.formAppUnSuccess.value['notify_me'], 'Unsuccessful');

        }

    }

    public getCorrectCode(jobApplicationStatus) {

        // Status Flags
        //  6 -> Applied
        // 1 -> Reviewed
        // 2 -> Shortlisted
        // 3 -> Interviewed
        // 4 -> Successful
        // 5 -> Unsuccessful
        let jobApplicationStatusHash = {1: 0, 2: 1, 3: 2, 4: 3, 5: 4};
        return jobApplicationStatusHash[jobApplicationStatus['id']];

    }

    public _postFeedBack(jobAppId, status, comment, notifyMe = null, statusStr= null) {

        if (!this.postInProcess) {
            this.postInProcess = true;
            this._profileService.postApplicationFeedBack(jobAppId,
                status, comment, notifyMe).subscribe((res) => {

                    this.postSuccessFlag = true;
                    Observable.timer(2000).subscribe((r) => {
                        this.postSuccessFlag = false;
                        this.postInProcess = false;
                        this.stausChangeListObs.value.unshift(res['job_application_status_change']);
                        this.jobAppStatusId = this.getCorrectCode(
                            res['job_application_status_change']['job_application_status']);

                        if (this.jobAppStatusId === 3 || this.jobAppStatusId === 4) {
                            this.jobAppStatusId = 5;
                        } else {
                            this.jobAppStatusId++;
                        }
                    });
                    this.getChangeStatus(statusStr);
                },
                (error) => {
                    this.postErrorFlag = true;
                    this.postInProcess = false;
                    Observable.timer(2000).subscribe((r) => {
                        this.postErrorFlag = false;
                    });
                });
        }

    }

    public getChangeStatus(jobAppStatusStatus) {
        this.jobAppStatusStatus = jobAppStatusStatus;
    }

    public shareFeedbackApplied() {

        this.pristineReviewFlag$.next(false);
        if (this.formAppReviewed.valid && !this.postInProcess) {

            this._postFeedBack(this.jobAppId, this.formAppReviewed.value['status'],
                this.formAppReviewed.value['comment']);
        }

    }

    public shareFeedbackShortlisted() {

        this.pristineShortedFlag$.next(false);
        if (this.formAppShortListed.valid && !this.postInProcess) {
            this._postFeedBack(this.jobAppId, this.formAppShortListed.value['status'],
                this.formAppShortListed.value['comment'],
                this.formAppShortListed.value['notify_me']);
        }

    }

    public ngOnDestroy() {
        this.queryParamsObs.unsubscribe();
        this.paramsObs.unsubscribe();
    }

    public onBack() {
        window.history.back();
    }

    public postNote() {

        this.pristineFlag$.next(false);
        if (this.formNote.valid && this.jobAppId && this.formNote.value['note'].trim() !== ''
            && !this.postProgress) {
            this.postProgress = true;
            this._profileService.postNote(this.jobAppId, this.formNote.value['note'])
                .subscribe((res) => {
                this.notesList.unshift(res['note']);

                this.pristineFlag$.next(true);
                // Clear the note
                this.formNote.reset();
                this.postProgress = false;
                this.noteListObs.next(this.notesList);
                this.notAddFlag = true;
                jQuery('.scrollbar').scrollTop(0);

                Observable.timer(2000).subscribe((val) => {
                    this.notAddFlag = false;
                });
            }, (error) => {
                this.postProgress = false;
            });

        }
    }


    public onSaveOfferLetter() {
        this.downloadingFlag = true;
        this._companyService.getOfferLetter(this.jobAppId,
            this.formGenerateOffer.controls['title'].value,
            this.formGenerateOffer.controls['content'].value, 'OfferLetter_' +
            this.candidateDetailsObs.value['first_name'] + '_' +
            this.candidateDetailsObs.value['last_name']).subscribe((res) => {

            if (res === 'success') {

                this.downloadingFlag = false;
            }

        });

    }

    public ngOnInit() {
        this.accountService.setCustomSeo();
        this.paramsObs = this._activeRoute.params.subscribe((params) => {
            window.scrollTo(0, 0);
            if (params['id']) {
                this.candidateId = params['id'];
                this.queryParamsObs = this._activeRoute.queryParams.subscribe((qparams) => {

                    if (qparams['job_id']) {
                        this.jobId = qparams['job_id'];
                    }

                    if (this.singleLoad === false) {

                        this.singleLoad = true;
                        if (this.jobApplication == null) {
                            this._profileService.getProfile(this.candidateId, this.jobId)
                                .subscribe((res) => {
                                this.getCandidateDetails(res);
                            });
                        } else {
                            this.getCandidateDetails(this.jobApplication);
                        }

                    }
                    this.getAllUsers();
                    this._companyService.getCompanyJob(this.jobId).subscribe((selJob) => {
                        this.jobDetails = selJob['job'];
                    });

                    this._companyService.getCompanyDetails(this.accountService.getEmployerId())
                        .subscribe((companyDetails) => {
                        this.formAppInterview.controls['comment']
                            .setValue(companyDetails['addressLine'] + ', ' +
                                companyDetails['addressLine2'] + ', ' +
                                companyDetails['city']['name'] + ', ' +
                                companyDetails['country']['name']);
                    });

                });

            }
        });
    }

    public getCandidateDetails(res) {
        if (res['job_application'] == null) {
            let error = {status: 404};
            this._errorHandling.errorHandling(error);

        }

        this.jobAppId = res['job_application']['id'];
        this._profileService.getChangeStatusList(this.jobAppId).subscribe((resSL) => {

            let reShuffle = [];
            resSL['job_application_status_changes'].forEach((selStatus) => {
                reShuffle.push(selStatus);
            });
            this.stausChangeListObs.next(reShuffle);
            if (resSL['job_application_status_changes'] &&
                resSL['job_application_status_changes'][0]) {
                this.jobAppStatusId =
                    resSL['job_application_status_changes'][0]['job_application_status']['id'];
                this.jobAppStatusStatus = resSL['job_application_status_changes']
                    [0]['job_application_status']['en_status'];
                this.jobBakAppStatusId =
                    resSL['job_application_status_changes'][0]['job_application_status']['id'];

                if (this.jobBakAppStatusId <= 2) {
                    this.getAllUsers();
                }
            }

        });
        this._profileService.getNoteList(this.jobAppId).subscribe((resSL) => {
            this.notesList = resSL['notes'];
            this.noteListObs.next(this.notesList);
        });
        this.candidateDetailsObs.next(res);
    }

}
