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
    selector: 'complete-profile-steps-two',
    templateUrl: 'stepTwo.component.html',
    styleUrls: ['./stepTwo.component.scss'],
})

export class StepTwoComponent implements OnInit, OnDestroy {

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
    public tooSmallCv: boolean = false;
    public tooSmallCv$: BehaviorSubject<any> = new BehaviorSubject(null);
    public tooLargeCv: boolean = false;
    public tooLargeCv$: BehaviorSubject<any> = new BehaviorSubject(null);
    public cvDocument;
    public skillLimit = 5;
    public havePriorWorkExp: boolean = false;
    public isCurrentlyEmp: boolean = false;
    public skillList = [];
    public notShowAttachment = false;
    public workExperienceList = [{ _destroy: 0 }];
    public resumeList = [];
    public workExpPostList = { jobseeker: { jobseeker_experiences_attributes: [] } };
    public workExpPostErrorFLagsList = {};
    public workPrestine: BehaviorSubject<any> = new BehaviorSubject(true);
    public hidePreferedJobTitle:boolean = false;

    public jobSeekerType:string;
    public freshIndex = "fresh_grad";

    constructor(public accountService: AccountService,
        public loaderService: LoaderService,
        public fb: FormBuilder,
        public profileService: ProfileService,
        public router: Router,
        private cdRef: ChangeDetectorRef) {

        this.completeSecondForm = this.fb.group({
            job_title: [''],
            sector_id: ['', Validators.required],
            functional_area_id: ['', Validators.required],
            job_experience_level_id: ['', Validators.required],
            current_salary: ['', [TypeValidators.numeric_no_decimal]],
            total_years_experience: ['', [TypeValidators.numeric_no_decimal,
            Validators.max(50)]],
            expected_salary: ['', [Validators.required, TypeValidators.numeric_no_decimal]],
            cv_document: ['', Validators.required],
            skills: [[], Validators.required],
        });
    }


    public ngOnInit() {
        window.scroll(0, 0);
        this.screenwidth = window.innerWidth;
        if(ConfigService.JOB_TITLE_FRESH == "true"){
            this.hidePreferedJobTitle = true;
        }
        this.currLan = this.accountService.getCurrLang();

        // Loading S3 Data
        this.s3Holder = AccountService.s3Loaded$.subscribe((resFlag) => {
            if (resFlag) {
                this.sectorList$.next(this.loaderService.getSectors('alpha'));
                this.functionalAreaList$.next(this.loaderService.getFunctionalArea());
                this.experienceLevelList$.next(this.loaderService.getExperienceLevels());
            }
        });

        this.cacheProfileHolder = AccountService.cachedProfile$.subscribe((selProfile) => {
            if (selProfile) {
                if(selProfile.jobseeker_type=='coops' || selProfile.jobseeker_type=='summer_training'){
                    this.router.navigate([this.accountService.getCurrLangUrl()
                        + 'job-seeker/complete-profile/complete-step-two']);
                    return;
                }
                this.jobSeekerType = selProfile.jobseeker_type;
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

        // Preferred Job title
        this.completeSecondForm.controls['job_title']
            .setValue(selProfile['preferred_position']);

        // Set Sector
        this.completeSecondForm.controls['sector_id']
            .setValue(this.getHashValue(selProfile['general_info'],
                'sector', 'id'));

        // Set Functional area
        this.completeSecondForm.controls['functional_area_id']
            .setValue(this.getHashValue(selProfile['general_info'],
                'functional_area', 'id'));

        // Set Experience level
        this.completeSecondForm.controls['job_experience_level_id']
            .setValue(this.getHashValue(selProfile['general_info'],
                'experince_level', 'id'));

        // Current Salary
        if (this.getHashValue(selProfile['general_info'],
            'current_salary')) {
            this.completeSecondForm.controls['current_salary']
                .setValue(this.getHashValue(selProfile['general_info'],
                    'current_salary'));
        }

        // Total years of experience
        if (this.getHashValue(selProfile['general_info'],
            'total_years_experience')) {
            this.completeSecondForm.controls['total_years_experience']
                .setValue(this.getHashValue(selProfile['general_info'],
                    'total_years_experience'));
        }

        // Expected Salary
        this.completeSecondForm.controls['expected_salary']
            .setValue(this.getHashValue(selProfile['general_info'],
                'expected_salary'));

        if (selProfile['skills']) {
            this.skillList = selProfile['skills'];
            this.completeSecondForm.controls['skills'].setValue(this.skillList);
        }

        // Loading Work Exp
        this.workExperienceList = this.getLoadObject(selProfile['work_experience']);

        // Loading Resumes
        this.resumeList = this.getLoadObject(selProfile['resumes']);
        if (this.getValidateHasResume()) {
            this.completeSecondForm.controls['cv_document']
                .setValue(this.resumeList[0].document_file_name);
        }

        if (this.workExperienceList.length > 0) {
            // Cloning job experience object for manipulation by workexperienceStepTwo component.
            this.workExpPostList.jobseeker.jobseeker_experiences_attributes =
                _.cloneDeep(this.workExperienceList);

            // Checking if valid experience
            // if no experience reset total years experience
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

    // Set too small File Flag.
    public setTooSmallFileFlags(fileType = 'cv_document', value = true) {
        if (fileType === 'cv_document') {
            this.tooSmallCv = value;
        }
        this.setFileValidationObservables();
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
            this.invalidCv  = false;
            this.tooSmallCv = false;
        }

        this.setFileValidationObservables();

    }

    // Set File validation flags to Obervables.
    public setFileValidationObservables() {
        this.invalidCv$.next(this.invalidCv);
        this.tooLargeCv$.next(this.tooLargeCv);
        this.tooSmallCv$.next(this.tooSmallCv);
    }

    // Select and Validate uploaded CV or Cover letter.
    public selectFile($event, fileType = 'cv_document') {
        if (!$event.target.files[0]) {
            return;
        }
        this.resetValidationFlags(fileType);
        // size is in bytes so 1kb = 1000 bytes
        if($event.target.files[0].size<1000){
            this.setTooSmallFileFlags(fileType, true);
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
    
    makeControlInvalid(control){
        control.markAsTouched();
        control.setErrors({'incorrect': true})
        control.value = null;       
    }

    // Submit step
    public getSubmit() {
        this.pristineFlag$.next(false);

        this.workPrestine.next(false);
        if (this.getValidateWork() && this.completeSecondForm.valid &&
            this.getValidationIfProrExp() && this.completeSecondForm.controls['skills']
                .value.length === this.skillLimit) {
            this.postInProcess = true;
            let postData = {};

            // Post Object
            postData['jobseeker'] = {
                sector_id: this.completeSecondForm.value['sector_id'],
                functional_area_id: this.completeSecondForm.value['functional_area_id'],
                job_experience_level_id:
                    this.completeSecondForm.value['job_experience_level_id'],
                current_salary: this.completeSecondForm.value['current_salary'],
                expected_salary: this.completeSecondForm.value['expected_salary'],
                years_of_experience: this.completeSecondForm.value['total_years_experience']
            };

            // Attach the Attachment
            if (this.cvDocument) {
                postData['jobseeker']['jobseeker_resumes_attributes'] =
                    [{ title: '', document: this.cvDocument, default: true }];
            }

            // Set preferred Position
            if (!this.havePriorWorkExp) {
                postData['jobseeker']['preferred_position'] =
                    this.completeSecondForm.value['job_title'];
            }

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

            let skillsData = {
                jobseeker: {
                    skills:
                        this.completeSecondForm.value['skills']
                }
            };
            this.profileService.updatSkills(skillsData)
                .subscribe((res) => {
                    this.skillList = [];
                    res['jobseekers'].forEach((res1) => {

                        let selJobseeker = new JobSeekerSkills();
                        selJobseeker.id = res1.id;
                        selJobseeker.name = res1.name;
                        selJobseeker.level = res1.level;
                        this.skillList.push(selJobseeker);
                    });
                    this.updateProfileSubcription = this.profileService
                            .postEduWork(postData).subscribe((res2) => {
                                this.router.navigate([this.accountService.getCurrLangUrl()
                                + 'job-seeker/complete-profile/step-three']);
                                this.postInProcess = false;
                            }, (error) => {
                                this.postInProcess = false;
                            });
                },
                    (error) => {
                        if (error.status === 401) {
                            this.accountService.getLogOutUser();
                        }
                    });

        } else {
            window.scroll(0, 0);
        }
    }

    // Remove Empty Elements
    public getCleanList(list) {
        return list.filter((e) => e);
    }

    // Validation for prior Exp
    public getValidationIfProrExp() {
        if (!this.havePriorWorkExp) {
            if (!this.completeSecondForm.controls['job_title'].value) {
                if(this.hidePreferedJobTitle){
                    this.completeSecondForm.controls['job_title'].setValue("Fresher");
                    return true;
                }
                return false;
            } else {
                return true;
            }
        } else {
            return (this.getCurrentSalaryCustomValidation() &&
                this.getTotalYearsExpCustomValidation());
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

    // Get Current Salary Validation
    public getCurrentSalaryCustomValidation() {
        return (this.completeSecondForm.controls['current_salary'].value);
    }

    // Get Total Years Exp Validation
    public getTotalYearsExpCustomValidation() {
        return (this.completeSecondForm.controls['total_years_experience'].value);
    }

    // Set currently employed
    public setCurrentlyEmp(b: boolean) {
        this.isCurrentlyEmp = b;
    }

    // Validating delete of work
    public getValidateDelete(fullList = []) {
        let deleteList = fullList
            .filter((selVal) => selVal._destroy && selVal._destroy === 1);
        return ((fullList.length - deleteList.length) >= 2);
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
