import {
    Component, DoCheck,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output
} from '@angular/core';
import { AccountService } from '../../../core/account/services/account.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { FolderingService } from '../../../core/services/foldering.service';
import { ProfileService } from '../../../core/services/profile.service';
import { BehaviorSubject, Observable } from 'rxjs';
import * as _ from 'lodash';
import { ConfigService } from '../../../shared/config.service';
import { CompanyService } from '../../../core/services/company.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JobService } from '../../../core/services/job.service';
import { ActivatedRoute, Router } from '@angular/router';

declare var jQuery: any;
@Component({
    selector: 'folder-tool-bar',
    templateUrl: './folderToolBar.components.html',
    styleUrls: ['./folderToolBar.scss']
})

export class FolderToolBarComponent implements OnInit, DoCheck {

    @Input() public candidateObj;
    @Input() public showInviteToApply: boolean = true;
    @Input() public currentFolderId;
    @Input() public operation = 'add';   // add, move
    @Input() public jobseekerFolderId = null;
    @Input() public starRatingDone: boolean = false;
    @Input() public averageRating;
    @Output() public updateSuccess = new EventEmitter();
    @Output() public updateTags = new EventEmitter();
    @Output() public refreshData = new EventEmitter();
    public jobseekerTags = [];
    public showJobSearchBox: boolean = true;
    public showFoldering: boolean = (ConfigService.SHOW_FOLDERING === 'true');
    public currLan = 'en';
    public showSpinner = false;
    public downloadInProcess = false;
    public errorflag = false;
    public customErrorMessage = null;
    public fixedTextHash = this.loaderService.getFixedText();
    public folderList$ = new BehaviorSubject([]);
    public parentFolderId = null;
    public folderId = null;
    public totalPages = 1;
    public currentPage = 1;
    public starRating = 0;
    public highestRating = 5;
    public defaultResume$ = new BehaviorSubject(null);
    public starPostDone: boolean = false;
    public videoSrc$ = new BehaviorSubject(null);
    public videoScreenShot$ = new BehaviorSubject(null);
    public objectLoadedFlag: boolean = false;
    public isInviteToApplyActive: boolean = (ConfigService.SHOW_INVITE_TO_APPLY === 'true');
    public allTags = null;
    public allActiveJobs = null;
    public searchableTags = [];
    public searchableJobs = [];
    public targetApplicant$: BehaviorSubject<any> = new BehaviorSubject(null);
    public successAlert$: BehaviorSubject<any> = new BehaviorSubject(false);
    public failAlert$: BehaviorSubject<any> = new BehaviorSubject(false);
    public msgContent: string = '';
    public inviteToApplyForm: FormGroup;
    public inviteToApplyPristine: boolean = true;
    public inviteToApplyPostInProgress: boolean = false;
    public routeData: any;
    public isShortnRejectList: boolean = false;
    public statusIds = require('../../../../data/job-application_states.json');

    constructor(public accountService: AccountService,
        public loaderService: LoaderService,
        public jobService: JobService,
        public companyService: CompanyService,
        public element: ElementRef,
        public fb: FormBuilder,
        public profileService: ProfileService,
        public folderingService: FolderingService,
        public _activeRoute: ActivatedRoute,
        public _router: Router,
    ) {
        this.inviteToApplyForm = this.fb.group({
            job_id: ['', Validators.required],
            invite_message: ['', Validators.required]
        });

        this._activeRoute.data.subscribe(v =>
            this.routeData = v
        );
        if (this.routeData != undefined && this.routeData["isShortnRejectList"] != undefined && this.routeData["isShortnRejectList"] == true) {
            this.isShortnRejectList = true;
        }
    }

    public ngOnInit() {
        this.currLan = this.accountService.getCurrLang();
        this.msgContent = this.fixedTextHash['invite_to_apply'][this.currLan];
        this.getAllFolders(this.currentPage);
    }

    public restTags() {
        this.jobseekerTags = (this.candidateObj.hash_tags)
            ? _.cloneDeep(this.candidateObj.hash_tags) : [];
    }

    public getAllTags() {
        this.profileService.getTags().subscribe((res) => {
            if (res) {
                this.allTags = res;
                this.getTagSearchList(this.allTags);
            }
        });
    }

    // Get all active jobs
    public getAllActiveJobs() {
        this.companyService.getCompanyEmployerAllActiveJobs(this.accountService.getEmployerId())
            .subscribe((res) => {
                if (res) {
                    this.allActiveJobs = res['jobs'];
                    this.getJobSearchList(this.allActiveJobs);
                }
            });
    }

    public selectedTag($event) {
        let matchFound = false;
        this.jobseekerTags
            .forEach((selTag, selTagIndex) => {
                if (selTag.name === $event.text) {
                    matchFound = true;
                    if (selTag['_destroy']) {
                        delete this.jobseekerTags[selTagIndex]['_destroy'];
                    }
                }
            });
        if (!matchFound) {
            if ($event.id) {
                this.jobseekerTags.push({ id: $event.id, name: $event.text });
            } else {
                this.jobseekerTags.push({ name: $event.text });
            }
        }
    }

    public getCreateTag() {
        this.profileService.addUpdateDeleteTags(this.getJobseekerId(), this.jobseekerTags)
            .subscribe((res) => {
                this.updateTags.emit(res['hash_tags']);
                jQuery('.js_close_tags').modal('hide');
            });
    }

    public removeTag(tagToRemove) {
        this.jobseekerTags.forEach((selTag, selIndex) => {
            // Removing tags
            if (selTag.name === tagToRemove.name) {
                this.jobseekerTags[selIndex]['_destroy'] = true;
            }
        });
    }

    public getTagSearchList(allTags) {
        this.searchableTags = [];
        this.allTags.hash_tags.forEach((selTag) => {
            this.searchableTags.push({ id: selTag['id'], text: selTag['name'] });
        });
    }

    public getJobSearchList(allActiveJobs) {
        this.searchableJobs = [];
        allActiveJobs.forEach((selJob) => {
            this.searchableJobs.push({ id: selJob['id'], text: selJob['title'] });
        });
    }

    public ngDoCheck() {

        if (this.candidateObj && !this.objectLoadedFlag) {
            this.objectLoadedFlag = true;
            this.getAllTags();
            // Get active jobs only if invite to apply is active
            if (this.showInviteToApply) {
                this.getAllActiveJobs();
            }
            this.getLoadVideoDetails();
            this.getResume();
            this.restTags();
        }
    }

    public getLoadVideoDetails() {
        if (this.candidateObj && this.candidateObj.video) {
            this.videoSrc$.next(this.candidateObj.video);
            this.videoScreenShot$.next(this.candidateObj.video_screenshot);
        }
    }

    public getResume() {
        if (this.candidateObj) {
            if (this.candidateObj.default_resume) {
                this.defaultResume$.next(this.candidateObj.default_resume);
            } else if (this.candidateObj.resumes && this.candidateObj.resumes.length > 0) {
                let defaultResume =
                    this.candidateObj.resumes.filter((selResume) => selResume.default);
                if (defaultResume.length === 0) {
                    this.defaultResume$.next(this.candidateObj.resumes[0].document);
                } else {
                    this.defaultResume$.next(defaultResume[0].document);
                }
            }
        }
    }

    public getSeeMore(folderId) {
        this.currentPage = 1;
        if (folderId && folderId > -1) {
            this.folderId = folderId;
            this.getFolderDetails(folderId);
        } else {
            this.folderId = null;
            this.getAllFolders(this.currentPage);
        }
    }

    public getAllFolders(currentPage, merge = false) {
        this.parentFolderId = null;
        this.folderingService.getAllFolders(currentPage, merge).subscribe((res) => {
            if (res && res.folders) {
                this.showSpinner = false;
                this.totalPages = res.meta.total_pages;
                this.folderList$.next(res.folders);
            }
        });
    }

    public getFolderDetails(folderId, currentPage = 1, merge = false) {
        this.folderingService.getFolderDetails(folderId, currentPage, merge).subscribe((res) => {
            this.showSpinner = false;
            this.folderList$.next(res['folders']);
            let ancestors = res['meta']['folder_details']['ancestors'];
            this.parentFolderId = (ancestors[ancestors.length - 2])
                ? ancestors[ancestors.length - 2]['id'] : -1;
            this.totalPages = res['meta'].total_pages;
            this.folderList$.next(res['folders']);
        });
    }

    public getNextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            if (this.folderId) {
                this.getFolderDetails(this.folderId, this.currentPage, true);
            } else {
                this.getAllFolders(this.currentPage, true);
            }
        }
    }

    public onSavePDF() {
        if (this.downloadInProcess) {
            return;
        } else {
            this.downloadInProcess = true;
            this.showSpinner = true;
            this.profileService.getProfilePdf(this.getUserId(),
                [this.candidateObj.first_name, this.candidateObj.last_name].join(' '))
                .subscribe((res) => {
                    if (res === 'success' || res === 'error') {
                        this.showSpinner = false;
                        this.downloadInProcess = false;
                    }
                });
        }

    }

    public getUpdateDone($event) {
        this.resetError();
        if ($event.status) {
            this.element.nativeElement.querySelector('.js-move-to-folder').click();
            this.updateSuccess.emit(true);
        } else {
            this.errorflag = true;
            if ($event.error.error && $event.error.error.jobseeker_id) {
                this.customErrorMessage =
                    this.fixedTextHash['error_add_candidate_folder'][this.currLan];
                this.customErrorMessage =
                    this.customErrorMessage.replace('candn',
                        [this.candidateObj.first_name, this.candidateObj.last_name].join(' '))
                        .replace('foln', $event.folder.name);
            }
        }
    }
    public getDelete() {
        this.resetError();
        this.folderingService.deleteJobseekerFolder(this.jobseekerFolderId)
            .subscribe((res) => {
                this.element.nativeElement.querySelector('.js-delete-folder').click();
                this.updateSuccess.emit(true);
            },
                (error) => {
                    this.updateSuccess.emit(false);

                });
    }

    public resetError() {
        this.customErrorMessage = null;
        this.errorflag = false;

    }

    public getJobseekerId() {
        return (this.candidateObj.jobseeker_id) ?
            this.candidateObj.jobseeker_id : this.candidateObj.id;
    }

    public getUserId() {
        return (this.candidateObj.user_id) ?
            this.candidateObj.user_id : this.candidateObj.id;
    }

    public setStarRating(stars: number) {

        this.starRating = stars;
        if (!this.starRatingDone && !this.starPostDone) {
            this.profileService.setRateCandidate(this.getJobseekerId(), stars)
                .subscribe((res) => {
                    this.starPostDone = true;
                    let timer = Observable.timer(200).subscribe((done) => {
                        jQuery('.js_close_star_rating').modal('hide');
                        this.starRatingDone = true;
                        this.averageRating = res['rating']['average_rating_for_jobseeker'];
                        timer.unsubscribe();
                    });
                }, (error) => {
                    this.starPostDone = true;
                });
        }
    }

    // Select job for invite to apply
    public selectedJob($event) {
        this.inviteToApplyForm.controls['job_id'].setValue($event.id);
        this.inviteToApplyForm.controls['invite_message']
            .setValue(this.fixedTextHash['invite_to_apply'][this.currLan]
                .replace('JOBTITLE', $event.text).replace('JOBCOMPNAME',
                    this.accountService.getProfileHeader().company_name));
    }

    // Reset invite to apply
    public resetApplyInvitation() {
        this.inviteToApplyPristine = true;
        this.inviteToApplyForm.reset();
        this.showJobSearchBox = false;
    }

    public sendApplyInvitation() {

        this.inviteToApplyPristine = false;
        if (this.inviteToApplyForm.valid) {
            let postData = {
                invited_jobseeker: {
                    jobseeker_id: this.getJobseekerId(),
                    job_id: this.inviteToApplyForm.controls['job_id'].value,
                    msg_content: this.inviteToApplyForm.controls['invite_message'].value
                }
            };
            this.inviteToApplyPostInProgress = true;
            this.jobService.sendApplyInvitation(postData).subscribe((res) => {
                this.successAlert$.next(true);
                Observable.timer(3000).subscribe((val) => {
                    this.successAlert$.next(false);
                    this.inviteToApplyPostInProgress = false;
                    this.resetApplyInvitation();
                    jQuery('.modal').modal('hide');
                });
            }, (err) => {
                this.failAlert$.next(true);
                Observable.timer(3000).subscribe((val) => {
                    this.failAlert$.next(false);
                    this.inviteToApplyPostInProgress = false;
                    this.resetApplyInvitation();
                    jQuery('.modal').modal('hide');
                });
            });
        }

    }

    public getApllicationId() {
        return (this.candidateObj["job_application"]["id"]);
    }

    public isShortListedCandidate() {
        if (this.candidateObj["job_application"]["status_id"] >= 2 && this.candidateObj["job_application"]["status_id"] != 6) {
            return true;
        }
    }

    public isRejectedCandidate() {
        if (this.candidateObj["job_application"]["status_id"] == 5 || this.candidateObj["job_application"]["status_id"] == 4) {
            return true;
        }
    }

    public shortListCandidate(applicationId) {
        var shotListedId = this.statusIds.job_application_statuses_details["shortlisted"]["id"];
        this.changeCandidateStatus(applicationId, shotListedId);

    }

    public rejectCandidate(applicationId) {
        var rejectedId = this.statusIds.job_application_statuses_details["unsuccessful"]["id"];
        this.changeCandidateStatus(applicationId, rejectedId);
    }

    public changeCandidateStatus(applicationId, id) {
        let shortListData = {
            job_application_status_change: {
                job_application_status_id: id,
                comment: ""
            }
        };
        this.jobService
            .changeCandidateJobStatus(shortListData, applicationId).subscribe((res) => {
                var statusID = res["job_application_status_change"].job_application_status["id"];
                this.candidateObj["job_application"]["status_id"] = statusID;
                jQuery('.modal').modal('hide');
                this.refreshData.emit();
            }, (error) => {
                jQuery('.modal').modal('hide');
            });
    }
    	
	public stopVideo()
    {
        jQuery('.mejs-pause button').trigger("click");
        jQuery('.video-force-close').modal('hide');
    }


}
