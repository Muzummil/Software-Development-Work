import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

// Services
import { AccountService } from '../../../core/account/services/account.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TypeValidators } from '../../../shared/validators/basicValidators';
import { BehaviorSubject } from 'rxjs';
import { ConfigService } from '../../../shared/config.service';
import { ProfileService } from '../../../core/services/profile.service';
import { JobSeekerSkills } from '../../profile/models/JobSeekerSkills';
import * as _ from 'lodash';

declare var jQuery: any;

@Component({
    selector: 'combinedSteps',
    templateUrl: 'combinedSteps.component.html',
    styleUrls: ['combinedSteps.component.scss'],
})

export class CombinedStepsComponent implements OnInit, OnDestroy {

    public queryParamsObs;
    public currLan = 'en';
    public fixedTextHash = this.loaderService.getFixedText();
    public pristineFlag$: BehaviorSubject<any> = new BehaviorSubject(true);
    public sectorList$: BehaviorSubject<any> = new BehaviorSubject(null);
    public experienceLevelList$: BehaviorSubject<any> = new BehaviorSubject(null);
    public functionalAreaList$: BehaviorSubject<any> = new BehaviorSubject(null);
    public screenwidth = 0;
    public windowSizeDivider = ConfigService.windowSizeDivider;
    public s3Holder;
    public cacheProfileHolder;
    public loadedFlag: boolean = false;
    public updateProfileSubcription;
    public completeSecondForm: FormGroup;
    public fileFormatList = ["application/pdf", "application/msword", "application/vnd.ms-office", "text/plain", "application/xls",
        "application/xlsx", "application/doc", "application/docx", "application/ppt", "application/pptx",
        "image/jpg", "image/jpeg", "image/png", "image/gif", "image/bmp",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    public documentFileSizeInMB = 5;
    public postInProcess: boolean = false;
    public invalidCv: boolean = false;
    public invalidCoverLetter: boolean = false;
    public invalidCv$: BehaviorSubject<any> = new BehaviorSubject(null);
    public tooLargeCv: boolean = false;
    public tooLargeCv$: BehaviorSubject<any> = new BehaviorSubject(null);
    public cvDocument;
    public skillLimit = 5;
    public havePriorWorkExp: boolean = true;
    public isCurrentlyEmp: boolean = false;
    public skillList = [];
    public notShowAttachment = false;
    public workExperienceList = [{ _destroy: 0 }];
    public resumeList = [];
    public completeThirdForm: FormGroup;
    public workExpPostList = { jobseeker: { jobseeker_experiences_attributes: [] } };
    public workExpPostErrorFLagsList = {};
    public workPrestine: BehaviorSubject<any> = new BehaviorSubject(true);
    public jobseekerType;

    // step three variables
    public eduDetailsPostErrorFLagsList = {};
    public educationList = [];
    public eduDetailsList = [{ _destroy: 0 }];
    public eduDetailsPostList = { jobseeker: { jobseeker_educations_attributes: [] } };
    public eduDetailsPrestine: BehaviorSubject<any> = new BehaviorSubject(true);
    public profileObject: BehaviorSubject<any> = new BehaviorSubject(null);

    constructor(public accountService: AccountService,
        public loaderService: LoaderService,
        public fb: FormBuilder,
        public profileService: ProfileService,
        public router: Router,
        private cdRef: ChangeDetectorRef) {

        this.completeSecondForm = this.fb.group({
            job_title: [''],
            sector_id: [''],
            functional_area_id: [''],
            job_experience_level_id: [''],
            current_salary: [''],
            total_years_experience: [''],
            expected_salary: [''],
            cv_document: [''],
            skills: [[]],
        });

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
                this.sectorList$.next(this.loaderService.getSectors('alpha'));
                this.functionalAreaList$.next(this.loaderService.getFunctionalArea());
                this.experienceLevelList$.next(this.loaderService.getExperienceLevels());
                this.educationList = this.loaderService.getJobEducations();
            }
        });

        this.cacheProfileHolder = AccountService.cachedProfile$.subscribe((selProfile) => {
            if (selProfile) {
                if (selProfile.jobseeker_type != 'coops' && selProfile.jobseeker_type != 'summer_training') {
                    this.router.navigate([this.accountService.getCurrLangUrl()
                        + 'job-seeker/complete-profile/step-two']);
                    return;
                }
                this.jobseekerType = selProfile.jobseeker_type;
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

    // Loading Profile data
    public loadData(selProfile) {

        this.accountService.setSwitchFlag(false);

        this.workExperienceList = this.getLoadObject(selProfile['work_experience']);
        if (this.workExperienceList.length > 0) {
            // Cloning job experience object for manipulation by workexperienceStepTwo component.
            this.workExpPostList.jobseeker.jobseeker_experiences_attributes =
                _.cloneDeep(this.workExperienceList);

            // Checking if valid experience
            // if no experience reset total years experience
            if (this.jobseekerType == 'coops' || this.jobseekerType == 'summer_training') {
                // hardcoded the value bcz both coop and s.trainer must have this exp
                this.havePriorWorkExp = true;
            } else {
                if (this.workExperienceList[0]['_destroy'] === 0) {
                    this.havePriorWorkExp = false;
                    this.completeSecondForm.controls['current_salary']
                        .setValue(0);
                    this.completeSecondForm.controls['total_years_experience']
                        .setValue(0);
                } else {
                    this.havePriorWorkExp = true;
                }
            }
        }
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

    // Validate Has resume
    public getValidateHasResume() {
        return (this.resumeList.length > 1 || this.resumeList[0].hasOwnProperty('document'));
    }

    // Validate and load object
    public getLoadObject(selList = []) {

        if (Array.isArray(selList) && selList.length > 0) {
            return selList;
        } else {
            this.workExpPostErrorFLagsList[0] = true;
            return [{ _destroy: 0 }];
        }

    }

    // Fetching valid data from hash
    public getHashValue(hash, key, level2 = null) {

        if (hash == null) {
            return null;
        }
        if (hash.hasOwnProperty(key)) {
            if (level2 == null) {
                return hash[key];
            } else {
                if (hash[key] && hash[key].hasOwnProperty(level2)) {
                    return hash[key][level2];
                } else {
                    return null;
                }
            }
        } else {
            return null;
        }

    }

    // Set Invalid Attachment.
    public setInvalidTypeFlags(fileType = 'cv_document', value = true) {
        if (fileType === 'cv_document') {
            this.invalidCv = value;
        } else {
            this.invalidCoverLetter = value;
        }
        this.setFileValidationObservables();
    }

    // Set too Large File Flag.
    public setTooLargeFileFlags(fileType = 'cv_document', value = true) {
        if (fileType === 'cv_document') {
            this.tooLargeCv = value;
        }
        this.setFileValidationObservables();
    }

    // Reset File validation Flags.
    public resetValidationFlags(fileType = 'cover_letter_document') {
        if (fileType === 'cover_letter_document') {
            this.invalidCoverLetter = false;
        } else {
            this.tooLargeCv = false;
            this.invalidCv = false;
        }

        this.setFileValidationObservables();

    }

    // Set File validation flags to Obervables.
    public setFileValidationObservables() {
        this.invalidCv$.next(this.invalidCv);
        this.tooLargeCv$.next(this.tooLargeCv);
    }

    // Select and Validate uploaded CV or Cover letter.
    public selectFile($event, fileType = 'cv_document') {
        if (!$event.target.files[0]) {
            return;
        }
        this.completeSecondForm.controls['cv_document'].setValue($event.target.files[0].name);
        jQuery('.js_' + fileType).attr('placeholder', $event.target.files[0].name);
        this.resetValidationFlags(fileType);
        if (this.fileFormatList.indexOf($event.target.files[0].type) === -1) {
            // Invalid file selected
            this.setInvalidTypeFlags(fileType, true);
        } else if ($event.target.files[0].size > this.documentFileSizeInMB * 1000000) {
            // File toLarge
            this.setTooLargeFileFlags(fileType, true);
        } else {
            let file: Blob = event.target['files'][0];
            let myReader: FileReader = new FileReader();
            let that = this;
            myReader.onload = function (loadEvent: any) {
                that.cvDocument = loadEvent.target.result;
            };
            myReader.readAsDataURL(file);
        }
    }

    // check if selected file is valid.
    public checkSelectedfilesValid() {
        if (this.tooLargeCv || this.invalidCv ||
            this.invalidCoverLetter) {
            return false;

        }
        return true;
    }

    makeControlInvalid(control) {
        control.markAsTouched();
        control.setErrors({ 'incorrect': true })
        control.value = null;
    }

    // Submit step
    public getSubmit() {
        this.pristineFlag$.next(false);
        this.pristineFlag$.next(false);
        this.eduDetailsPrestine.next(false);
        this.workPrestine.next(false);
        if ((this.getValidateWork() && this.completeSecondForm.valid) &&
            (this.getValidateEdu() && this.getValidationIfProrExp() && 
            this.completeThirdForm.valid)) {
            this.postInProcess = true;
            let postData = {};

            // Post Object
            postData['jobseeker'] = {
                job_education_id: this.completeThirdForm.value['highest_edu_name_id'],
                jobseeker_educations_attributes:
                    this.eduDetailsPostList.jobseeker.jobseeker_educations_attributes,
            };

            this.workExpPostList.jobseeker.jobseeker_experiences_attributes.filter((e) => e)
            // Work Experience
            this.workExpPostList.jobseeker.jobseeker_experiences_attributes =
                this.getCleanList(this.workExpPostList.jobseeker
                    .jobseeker_experiences_attributes);

            // Cloning all experiences to Post length
            if (this.workExpPostList.jobseeker
                .jobseeker_experiences_attributes.length > 1 || this.workExpPostList.jobseeker
                    .jobseeker_experiences_attributes[0].hasOwnProperty('id')) {
                postData['jobseeker'] =
                    Object.assign(this.workExpPostList.jobseeker, postData['jobseeker']);
            }

            // Deleting all Experience if no prior experience
            if (!this.havePriorWorkExp && postData['jobseeker'].jobseeker_experiences_attributes) {
                postData['jobseeker'].jobseeker_experiences_attributes.
                    forEach((selExp, selExpIndex) => {
                        postData['jobseeker']
                            .jobseeker_experiences_attributes[selExpIndex]['_destroy'] = 1;
                    });
            }

            // Removing existing resumes
            if (this.notShowAttachment) {
                this.resumeList.forEach((selResume) => {
                    postData['jobseeker']['jobseeker_resumes_attributes']
                        .push({ id: selResume.id, _destroy: true });
                });
            }
            this.updateProfileSubcription = this.profileService
                .updateCombinedProfile(postData).subscribe((res2) => {
                    this.router.navigate([this.accountService.getCurrLangUrl()
                        + 'job-seeker/complete-profile/complete-step-three']);
                    this.postInProcess = false;
                }, (error) => {
                    this.postInProcess = false;
                });

        } else {
            window.scroll(0, 0);
        }


        // this.pristineFlag$.next(false);
        // this.eduDetailsPrestine.next(false);
        // if (this.getValidateEdu() && this.completeThirdForm.valid) {
        //     let postData = {
        //         job_education_id: this.completeThirdForm.value['highest_edu_name_id'],
        //         jobseeker_educations_attributes:
        //             this.eduDetailsPostList.jobseeker.jobseeker_educations_attributes
        //     };
        //     this.postInProcess = true;
        //     this.updateProfileSubcription = this.profileService
        //         .updateProfile(postData).subscribe((res) => {
        //             this.router.navigate([this.accountService.getCurrLangUrl()
        //                 + 'job-seeker/complete-profile/step-four']);
        //             this.postInProcess = false;
        //         }, (error) => {
        //             this.postInProcess = false;
        //         });

        // }
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

    // Remove Empty Elements
    public getCleanList(list) {
        return list.filter((e) => e);
    }

    // Validation for prior Exp
    public getValidationIfProrExp() {
        if (!this.havePriorWorkExp) {
            return true;
        } else {
            return (this.getJobseekerPriorExperience());
        }
    }

    // Validate Job Title
    public getValidateJobTitle() {
        if (!this.havePriorWorkExp) {
            if (!this.completeSecondForm.controls['job_title'].value) {
                return false;
            } else {
                return true;
            }
        } else {
            return true;
        }
    }

    // Set skills
    public setSkills($event: any) {
        this.completeSecondForm.controls['skills'].setValue($event);
    }

    // Set Prior Work exp
    public setPriorWorkExp(b: boolean) {
        this.setYearsExperience(b);
        this.setCurrentSalary(b);
        this.havePriorWorkExp = b;
    }

    // Set Years of Experience
    public setYearsExperience(b: boolean) {
        if (!b) {
            this.completeSecondForm.controls['total_years_experience'].setValue(0);
        } else {
            this.completeSecondForm.controls['total_years_experience'].setValue('');
        }
    }

    // Set Years of Experience
    public setCurrentSalary(b: boolean) {
        if (!b) {
            this.completeSecondForm.controls['current_salary'].setValue(0);
        } else {
            this.completeSecondForm.controls['current_salary'].setValue('');
        }
    }
    // getValidationIfProrExp changeWorkExp
    // Get Current Salary Validation
    public getCurrentSalaryCustomValidation() {
        return (this.completeSecondForm.controls['current_salary'].value);
    }

    // Get Current Salary Validation
    public getJobseekerPriorExperience() {
        let check = this.workExpPostList.jobseeker.jobseeker_experiences_attributes[0]; 
        if(check.position!=undefined){
            return true;
        }
        return false;
    }

    // Get Total Years Exp Validation
    public getTotalYearsExpCustomValidation() {
        return (this.completeSecondForm.controls['total_years_experience'].value);
    }

    // Set currently employed
    public setCurrentlyEmp(b: boolean) {
        this.isCurrentlyEmp = b;
    }

    // Remove Work experience
    public removeWork(workIndex) {
        if (this.workExperienceList[workIndex] && this.getValidateDelete(this.workExperienceList)) {
            this.workExpPostErrorFLagsList[workIndex] = false;
            this.workExperienceList[workIndex]['_destroy'] = 1;
            if (this.workExpPostList.jobseeker
                .jobseeker_experiences_attributes[workIndex]) {
                this.workExpPostList.jobseeker
                    .jobseeker_experiences_attributes[workIndex]['_destroy'] = 1;

            }
        }

    }

    // Change Work experience
    public changeWorkExp($event, index, obj) {
        this.workExpPostList.jobseeker.jobseeker_experiences_attributes[index] = $event.data;
        this.workExpPostErrorFLagsList[index] = (!$event.valid_form || $event.custom_error);
        this.workExpPostList.jobseeker.jobseeker_experiences_attributes[index]['_destroy']
            = obj['_destroy'];
    }

    // Add work experience
    public addWork() {
        this.workExperienceList.push({ _destroy: 0 });
        this.workExpPostErrorFLagsList[this.workExperienceList.length - 1] = true;
        this.workPrestine.next(true);
    }

    // Validate Work experience
    public getValidateWork() {
        if (this.havePriorWorkExp) {
            for (let key in this.workExpPostErrorFLagsList) {
                if (this.workExpPostErrorFLagsList.hasOwnProperty(key) &&
                    this.workExpPostErrorFLagsList[key]) {
                    return false;
                }
            }
        }
        return true;
    }

    // Going previous step
    public onBack() {
        this.router.navigate([this.accountService.getCurrLangUrl()
            + 'job-seeker/complete-profile/step-one']);
    }

    // Remove All Attached Resume
    public removeResume() {
        this.notShowAttachment = true;
        this.completeSecondForm.controls['cv_document'].setValue('');

    }
}
