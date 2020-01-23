import { Component, Input, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

// Services
import { AccountService } from '../../../core/account/services/account.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ConfigService } from '../../../shared/config.service';
import { ProfileService } from '../../../core/services/profile.service';
import * as _ from 'lodash';

declare var jQuery: any;

@Component({
    selector: 'complete-profile-steps-three',
    templateUrl: 'stepThree.component.html',
    styleUrls: ['./stepThree.component.scss'],
})

export class StepThreeComponent implements OnInit, OnDestroy {

    public queryParamsObs;
    public currLan = 'en';
    public fixedTextHash = this.loaderService.getFixedText();
    public pristineFlag$: BehaviorSubject<any> = new BehaviorSubject(true);
    public screenwidth = 0;
    public windowSizeDivider = ConfigService.windowSizeDivider;
    public s3Holder;
    public cacheProfileHolder;
    public loadedFlag: boolean = false;
    public updateProfileSubcription;
    public completeThirdForm: FormGroup;
    public havePriorWorkExp: boolean = false;
    public postInProcess: boolean = false;
    public educationList = [];
    public eduDetailsList = [{ _destroy: 0 }];
    public eduDetailsPostList = { jobseeker: { jobseeker_educations_attributes: [] } };
    public eduDetailsPostErrorFLagsList = {};
    public eduDetailsPrestine: BehaviorSubject<any> = new BehaviorSubject(true);
    public profileObject: BehaviorSubject<any> = new BehaviorSubject(null);

    constructor(public accountService: AccountService,
        public loaderService: LoaderService,
        public fb: FormBuilder,
        public profileService: ProfileService,
        public router: Router,
        private cdRef: ChangeDetectorRef) {

        this.completeThirdForm = this.fb.group({
            highest_edu_name_id: ['', Validators.required]
        });

    }

    public gerLoadObject(selList = [], objType = 'work') {

        if (Array.isArray(selList) && selList.length > 0) {
            return selList;
        } else {

            this.eduDetailsPostErrorFLagsList[0] = true;
            return [{ _destroy: 0 }];
        }

    }

    public ngOnInit() {
        window.scroll(0, 0);
        this.screenwidth = window.innerWidth;
        this.currLan = this.accountService.getCurrLang();
        // Loading S3 Data
        this.s3Holder = AccountService.s3Loaded$.subscribe((resFlag) => {
            if (resFlag) {
                this.educationList = this.loaderService.getJobEducations();
            }
        });
        this.cacheProfileHolder = AccountService.cachedProfile$.subscribe((selProfile) => {
            if (selProfile) {
                this.loadData(selProfile);
            }
        });

    }

    public ngOnDestroy() {
        if (this.s3Holder) {
            this.s3Holder.unsubscribe();
        }
        if (this.cacheProfileHolder) {
            this.cacheProfileHolder.unsubscribe();
        }
        if (this.updateProfileSubcription) {
            this.updateProfileSubcription.unsubscribe();
        }
    }

    ngAfterViewChecked() {
        this.cdRef.detectChanges();
    }
    
    makeControlInvalid(control){
        control.markAsTouched();
        control.setErrors({'incorrect': true})
        control.value = null;       
    }
    
    // Loading Profile data
    public loadData(selProfile) {
        this.accountService.setSwitchFlag(false);

        this.profileObject.next(selProfile);
        this.eduDetailsList = this.gerLoadObject(selProfile['education'], 'edu');

        if (this.eduDetailsList.length > 0) {
            // Cloning job education object for manipulation by addEducation component.
            this.eduDetailsPostList.jobseeker.jobseeker_educations_attributes =
                _.cloneDeep(this.eduDetailsList);
        }

        if (selProfile['general_info']['highest_edu']) {
            this.completeThirdForm.controls['highest_edu_name_id']
                .setValue(selProfile['general_info']['highest_edu']['id']);
        }

        this.loadedFlag = true;

    }

    // Submit step
    public getSubmit() {
        this.pristineFlag$.next(false);
        this.eduDetailsPrestine.next(false);
        if (this.getValidateEdu() && this.completeThirdForm.valid) {
            let postData = {
                job_education_id: this.completeThirdForm.value['highest_edu_name_id'],
                jobseeker_educations_attributes:
                    this.eduDetailsPostList.jobseeker.jobseeker_educations_attributes
            };
            this.postInProcess = true;
            this.updateProfileSubcription = this.profileService
                .updateProfile(postData).subscribe((res) => {
                    this.router.navigate([this.accountService.getCurrLangUrl()
                        + 'job-seeker/complete-profile/step-four']);
                    this.postInProcess = false;
                }, (error) => {
                    this.postInProcess = false;
                });

        }
    }

    // Validate Edu
    public getValidateEdu() {

        for (let key in this.eduDetailsPostErrorFLagsList) {
            if (this.eduDetailsPostErrorFLagsList.hasOwnProperty(key) &&
                this.eduDetailsPostErrorFLagsList[key]) {
                return false;
            }
        }
        return true;
    }

    // Adding new empty education
    public addEdu() {
        this.eduDetailsList.push({ _destroy: 0 });
        this.eduDetailsPostErrorFLagsList[this.eduDetailsList.length - 1] = true;
        this.eduDetailsPrestine.next(true);
    }

    // Removing Education . Step 3
    public removeEdu(eduIndex) {

        if (this.eduDetailsList[eduIndex] && this.getValidateDelete(this.eduDetailsList)) {
            this.eduDetailsPostErrorFLagsList[eduIndex] = false;
            this.eduDetailsList[eduIndex]['_destroy'] = 1;
            if (this.eduDetailsPostList.jobseeker
                .jobseeker_educations_attributes[eduIndex]) {
                this.eduDetailsPostList.jobseeker
                    .jobseeker_educations_attributes[eduIndex]['_destroy'] = 1;
            }
        }
    }

    // Validating delete of work and education for step 3. Can delete only if greater than 1
    public getValidateDelete(fullList = []) {
        let deleteList = fullList
            .filter((selVal) => selVal._destroy && selVal._destroy === 1);
        return ((fullList.length - deleteList.length) >= 2);
    }

    // Set Changes to Education
    public changeEdu($event, index, obj) {
        this.eduDetailsPostList.jobseeker.jobseeker_educations_attributes[index] = $event.data;
        this.eduDetailsPostErrorFLagsList[index] = (!$event.valid_form || $event.custom_error);
        this.eduDetailsPostList.jobseeker.jobseeker_educations_attributes[index]['_destroy']
            = obj['_destroy'];
    }

    // Going previous step
    public onBack() {
        this.router.navigate([this.accountService.getCurrLangUrl()
            + 'job-seeker/complete-profile/step-two']);
    }
}
