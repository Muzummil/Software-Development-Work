import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

// Services
import { AccountService } from '../../../core/account/services/account.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasicValidators, TypeValidators } from '../../../shared/validators/basicValidators';
import * as moment from 'moment';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { ConfigService } from '../../../shared/config.service';
import { ProfileService } from '../../../core/services/profile.service';
import { City } from '../../../shared/models/City';
import { CropperSettings, ImageCropperComponent } from 'ng2-img-cropper';

declare var jQuery: any;

@Component({
    selector: 'complete-profile-steps-four',
    templateUrl: 'stepFour.component.html',
    styleUrls: ['./stepFour.component.scss']

})

export class StepFourComponent implements OnInit, OnDestroy {

    @ViewChild('cropperAvatar', undefined) public cropperAvatar: ImageCropperComponent;
    public queryParamsObs;
    public currLan = 'en';
    public fixedTextHash = this.loaderService.getFixedText();
    public pristineFlag$: BehaviorSubject<any> = new BehaviorSubject(true);
    public selectImageDone$: BehaviorSubject<any> = new BehaviorSubject(false);
    public avatarImage$: BehaviorSubject<any> = new BehaviorSubject(null);
    public video$: BehaviorSubject<any> = new BehaviorSubject(null);
    public screenwidth = 0;
    public windowSizeDivider = ConfigService.windowSizeDivider;
    public s3Holder;
    public cacheProfileHolder;
    public loadedFlag: boolean = false;
    public updateProfileSubcription;
    public completeForthForm: FormGroup;
    public cropperSettings: CropperSettings;
    public dataCropAvatar: any = {};
    public targetFileBase64: any;
    public videoFormatList = ['video/x-msvideo', 'video/avi', 'video/quicktime',
        'video/3gpp', 'video/x-ms-wmv', 'video/mp4', 'video/webm', 'video/x-la-asf',
        'video/x-ms-asf'];

    public videoFileExtentions = '.avi, .mp4, .wmv, .mpeg';
    // Mode normal or cropper
    public modesHash = {normal: 'normal', cropper: 'cropper'};
    public fileInfo: any = {
        size: 1,
        format_list: ['image/jpeg', 'image/png'],
        title: 'profile_pic',
        sizeUnit: 'MB',
        mode: this.modesHash['cropper'],
        fileExtentions: ['.png, .jpg, .jpeg']
    };
    public tagetFile: any = null;
    public tagetFileVideo: any = null;
    public videoDurationSec = 31;
    public fileInfoVideo: any = {
        size: 1,
        format_list: this.videoFormatList,
        title: 'Profile Video',
        sizeUnit: 'MB',
        mode: this.modesHash['normal'],
        fileExtentions: this.videoFileExtentions
    };
    public errorFileString$: BehaviorSubject<any> = new BehaviorSubject(null);
    public errorFile$: BehaviorSubject<any> = new BehaviorSubject(null);
    public postInProcess = false;
    public uploadError = false;
    public uploadError2 = false;
    public timerSubcription: Subscription;
    public completeStep = 5;

    public jobseekerType:string;

    constructor(public accountService: AccountService,
                public loaderService: LoaderService,
                public fb: FormBuilder,
                public profileService: ProfileService,
                public router: Router) {

        this.completeForthForm = this.fb.group({
            highest_edu_name_id: ['', Validators.required]
        });

        this.cropperSettings = new CropperSettings();
        this.cropperSettings.noFileInput = true;

        // Dimensions for image cropping
        this.cropperSettings.width = 190;
        this.cropperSettings.height = 230;

        this.cropperSettings.croppedWidth = 500;
        this.cropperSettings.croppedHeight = 500;

        this.cropperSettings.canvasWidth = 500;
        this.cropperSettings.canvasHeight = 500;

        this.cropperSettings.minWidth = 100;
        this.cropperSettings.minHeight = 100;
        this.cropperSettings.rounded = false;

        this.dataCropAvatar = {};

    }

    public ngOnInit() {
        window.scroll(0, 0);
        this.screenwidth = window.innerWidth;
        this.currLan = this.accountService.getCurrLang();

        // Loading S3 Data
        this.s3Holder = AccountService.s3Loaded$.subscribe((resFlag) => {
            if (resFlag) {
                this.cacheProfileHolder = AccountService.cachedProfile$.subscribe((selProfile) => {
                    if (selProfile) {
                        if (this.jobseekerType == 'coops' || this.jobseekerType == 'summer_training') {
                            this.router.navigate([this.accountService.getCurrLangUrl()
                                + 'job-seeker/complete-profile/complete-step-three']);
                            return;
                        }
                        this.loadData(selProfile);
                    }
                });
            }
        });

    }

    public ngOnDestroy() {
        if ( this.s3Holder ) {
            this.s3Holder.unsubscribe();
        }
        if ( this.cacheProfileHolder ) {
            this.cacheProfileHolder.unsubscribe();
        }
        if ( this.updateProfileSubcription ) {
            this.updateProfileSubcription.unsubscribe();
        }
    }

    // Loading Profile data
    public loadData(selProfile) {
        this.accountService.setSwitchFlag(false);
        this.loadedFlag = true;

    }

    // Submit step
    public getSubmit() {
        // skip if user hasnt added picture or video
        if(this.video$.value == null && this.avatarImage$.value == null){
            this.accountService.setProfileStatus(this.completeStep);
            this.router.navigate([this.accountService.getCurrLangUrl()
            + 'job-seeker/profile']); 
            return;
        }

        let postData = {user_attributes: {}};

        if (this.avatarImage$.value != null) {
            postData['user_attributes']['avatar'] = this.avatarImage$.value;
        }

        if (this.video$.value != null) {
            postData['user_attributes']['video'] = this.video$.value;
        }

        if (this.avatarImage$.value != null || this.video$.value != null) {
            this.postInProcess = true;
            this.updateProfileSubcription = this.profileService
                .updateProfile(postData).subscribe((res) => {
                    this.accountService.setProfileStatus(this.completeStep);
                    this.router.navigate([this.accountService.getCurrLangUrl()
                    + 'job-seeker/profile']);
                }, (error) => {
                    if (error.status === 401) {
                        this.accountService.getLogOutUser();
                    } else {
                        this.uploadError2 = true;
                        this.timerSubcription = Observable.timer(3000)
                            .subscribe((tim) => {
                                this.uploadError2 = false;
                                this.timerSubcription.unsubscribe();
                            });
                    }
                });

        }

    }

    // Selecting Image or Video.
    public selectImage(mode = 'image') {

        if (mode === 'image') {
            this.avatarImage$.next(this.dataCropAvatar.image);
            this.selectImageDone$.next(false);
        } else if (mode === 'video') {

            this.video$.next(this.targetFileBase64);
        }

    }

    // Validating file for upload. Checking format and size.
    public fileChange(event) {

        let image: any = new Image();
        this.tagetFile = event.target.files[0];

        if ((this.fileInfo.size * 1048576) < this.tagetFile['size'] ||
            (this.tagetFile['type'] &&
                this.fileInfo.format_list.indexOf(this.tagetFile['type']) === -1)) {
            this.selectImageDone$.next(false);
        } else {
            this.selectImageDone$.next(true);

            let file: Blob = event.target.files[0];
            let myReader: FileReader = new FileReader();
            let that = this;
            myReader.onloadend = function (loadEvent: any) {
                image.src = loadEvent.target.result;
                that.cropperAvatar.setImage(image);
            };

            myReader.readAsDataURL(file);
        }
    }

    // Loading image or video.
    public loadFiles($event, fileType = 'image') {

        if (fileType === 'image') {
            this.avatarImage$.next($event.file);
        } else if (fileType === 'video') {
            this.video$.next($event.file);
        }
    }

    // Validating Video for upload. Checking Format, size and duration.
    public createVideo(event) {

        this.tagetFileVideo = event.target.files[0];

        this.video$.next(null);
        if ((this.fileInfoVideo.size * 1048576) < this.tagetFileVideo['size'] ||
            (this.tagetFileVideo['type'] &&
                this.fileInfoVideo.format_list.indexOf(this.tagetFileVideo['type']) === -1)) {
            this.selectImageDone$.next(false);
        } else {

            let that = this;
            let vid = document.createElement('video');
            let fileURL = URL.createObjectURL(this.tagetFileVideo);
            vid.src = fileURL;
            vid.ondurationchange = function () {

                if (this['duration'] > that.videoDurationSec) {
                    that.errorFileString$.next(that.fixedTextHash['video_too_long'][that.currLan]);
                    that.errorFile$.next(true);

                } else {
                    that.errorFileString$.next(null);
                    that.errorFile$.next(false);
                    let file: Blob = event.target.files[0];
                    let myReader: FileReader = new FileReader();
                    myReader.onload = function (loadEvent: any) {
                        that.targetFileBase64 = loadEvent.target.result;
                        that.selectImage('video');
                    };

                    myReader.readAsDataURL(file);
                }
            };
        }
    }

    // Going one Step forward. If step 4 then updating profile.
    public onSkip() {
        this.accountService.setProfileStatus(this.completeStep);
        this.router.navigate([this.accountService.getCurrLangUrl()
        + 'job-seeker/profile']);
    }

    // Going previous step
    public onBack() {
        if (this.jobseekerType == 'coops' || this.jobseekerType == 'summer_training') {
            this.router.navigate([this.accountService.getCurrLangUrl()
                + 'job-seeker/complete-profile/complete-step-two']);
        } else {
            this.router.navigate([this.accountService.getCurrLangUrl()
                + 'job-seeker/complete-profile/step-three']);
        }
    }

}
