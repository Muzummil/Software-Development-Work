import {
    AfterViewInit,
    Component, EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from '../../../core/services/profile.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { AccountService } from '../../../core/account/services/account.service';
import { BehaviorSubject } from 'rxjs';
import { City } from '../../../shared/models/City';
import { Router } from '@angular/router';

declare var jQuery: any;

let moment = require('moment');

@Component({
    selector: 'add-education',
    templateUrl: 'addEducation.component.html',
    styleUrls: ['./addEducation.component.scss'],
    
})

export class AddEducationComponent implements OnDestroy, OnInit, AfterViewInit {

    @Input() public prestineForm$ = new BehaviorSubject(true);
    @Input() public eduDetails = {};
    @Input() public allowDelete: boolean = true;
    @Output() public removeMe = new EventEmitter();
    @Output() public changeEduDetails = new EventEmitter();
    public currLan = 'en';
    public fixedTextHash = this.loaderService.getFixedText();
    public eduForm: FormGroup;
    public allCountriesSubcription;
    public spinnerLoader$: BehaviorSubject<any> = new BehaviorSubject(false);
    public educationList = [];
    public countryList = [];
    public stillStuding = true;
    public currentCityObj = new City();
    public toYear = moment().format('YYYY');
    public maxDate = moment()._d;
    public s3loadComplete: boolean = false;
    public eduEndDateError: boolean = false;
    public moduleInitialized: boolean = false;
    public minEndDate = moment();
    ShowEndDate: boolean = true;
    public gotDoc:boolean = false;
    public notShowAttachment:boolean = false;
    public jobseekerType;
    public eduDocument;
    public eduDocList = [];
    public docTitle:string;
    public invalidEduDoc: boolean = false;
    public invalidCoverLetter: boolean = false;
    public pristineFlag$: BehaviorSubject<any> = new BehaviorSubject(true);
    public invalidEduDoc$: BehaviorSubject<any> = new BehaviorSubject(null);
    public tooLargeEduDoc: boolean = false;
    public tooLargeEduDoc$: BehaviorSubject<any> = new BehaviorSubject(null);
    public fileFormatList = ["application/pdf", "application/msword", "application/vnd.ms-office", "text/plain", "application/xls",
        "application/xlsx", "application/doc", "application/docx", "application/ppt", "application/pptx",
        "image/jpg", "image/jpeg", "image/png", "image/gif", "image/bmp",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    public documentFileSizeInMB = 5;

    constructor(public fb: FormBuilder,
        public router: Router,
        public _profileService: ProfileService,
        public loaderService: LoaderService,
        public accountService: AccountService) {

        this.spinnerLoader$.next(true);
        AccountService.s3Loaded$.subscribe((resFlag) => {
            if (resFlag) {
                this.educationList = this.loaderService.getJobEducations();
                this.allCountriesSubcription = this.loaderService.getAllCountries('alphabetical')
                    .subscribe(
                        (countries) => {
                            this.countryList = countries;
                            this.spinnerLoader$.next(false);
                            this.s3loadComplete = true;
                        }
                    );

            }
        });

    }

    public ngOnInit(): void {

        this.eduForm = this.fb.group({
            edu_id: [this.getObjectValue('id')],
            edu_name: [this.getObjectValue('school'), Validators.required],
            edu_q_id: [this.getObjectValue('job_education', 'id'), Validators.required],
            edu_field_study: [this.getObjectValue('field_of_study'), Validators.required],
            edu_country_id: [this.getObjectValue('country', 'id'), Validators.required],
            edu_city_id: [this.getObjectValue('city', 'id'), Validators.required],
            edu_start_date: [this.getObjectValue('start_date'), Validators.required],
            edu_end_date: [this.getObjectValue('end_date')],
            edu_still_studing: [false],
            edu_grade: [this.getObjectValue('grade'), Validators.required],
            document: [this.getObjectValue('document')],
        });
        AccountService.cachedProfile$.subscribe((selProfile) => {
            if (selProfile) {
                this.jobseekerType = selProfile.jobseeker_type;
            }
        });

        if (this.eduDetails && this.eduDetails['start_date'] != undefined && this.eduDetails['start_date'] != null) {
            if (this.eduDetails && this.eduDetails['end_date'] != undefined && this.eduDetails['end_date'] != null) {
                this.eduForm.controls['edu_still_studing'].setValue(false);
                this.stillStuding = false;
            } else {
                this.eduForm.controls['edu_still_studing'].setValue(true);
                this.stillStuding = true;
            }
        }
        else {
            this.eduForm.controls['edu_still_studing'].setValue(false);
            this.stillStuding = false;
        }

        // Loading Resumes
        if(this.eduDetails['document']){
            this.eduDocList[0] = { };
            // this.eduDocList[0].document  = '';
             this.eduDocList[0].document = this.eduDetails['document'];
             this.eduForm.controls['document']
             .setValue(this.eduDocList[0].document);
             this.gotDoc = true;
         }


        if (this.eduDetails && this.eduDetails['city']) {
            this.currentCityObj.id = this.eduDetails['city']['id'];
            this.currentCityObj.name = this.eduDetails['city']['name'];
            this.currentCityObj.text = this.eduDetails['city']['name'];
        }

        this.eduForm.valueChanges.subscribe((res) => {
            if (this.s3loadComplete) {
                this.changeEduDetails.emit(this.getPostFormat());
            }
        });

        this.currLan = this.accountService.getCurrLang();
    }

    // Set Invalid Attachment.
    public setInvalidTypeFlags(fileType = 'document', value = true) {
        if (fileType === 'document') {
            this.invalidEduDoc = value;
        } else {
            this.invalidCoverLetter = value;
        }
        this.setFileValidationObservables();
    }
 
    // Remove All Attached Resume
    public removeResume() {
        this.notShowAttachment = true;
        this.gotDoc = false;
        this.eduDocList[0].document = '';
    }
 
    // Set too Large File Flag.
    public setTooLargeFileFlags(fileType = 'document', value = true) {
        if (fileType === 'document') {
            this.tooLargeEduDoc = value;
        }
        this.setFileValidationObservables();
    }
 
    // Reset File validation Flags.
    public resetValidationFlags(fileType = 'cover_letter_document') {
        if (fileType === 'cover_letter_document') {
            this.invalidCoverLetter = false;
        } else {
            this.tooLargeEduDoc = false;
            this.invalidEduDoc = false;
        }
 
        this.setFileValidationObservables();
 
    }
 
    // Set File validation flags to Obervables.
    public setFileValidationObservables() {
        this.invalidEduDoc$.next(this.invalidEduDoc);
        this.tooLargeEduDoc$.next(this.tooLargeEduDoc);
    }
 
    // Select and Validate uploaded CV or Cover letter.
    public selectFile2($event, fileType = 'document') {
        if (!$event.target.files[0]) {
            return;
        }
        this.eduForm.controls['document'].setValue($event.target.files[0].name);
        this.docTitle = $event.target.files[0].name;
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
                that.eduDocument = loadEvent.target.result;
            };
            myReader.readAsDataURL(file);
            setTimeout(()=>{ 
                this.changeEduDetails.emit(this.getPostFormat());
           }, 300);
        }
    }
 
    // check if selected file is valid.
    public checkSelectedfilesValid() {
        if (this.tooLargeEduDoc || this.invalidEduDoc ||
            this.invalidCoverLetter) {
            return false;
 
        }
        return true;
    }
 
    // Validate and load object
    public getLoadObject(selList = []) {
 
        if (Array.isArray(selList) && selList.length > 0) {
            return selList;
        } else {
            // this.workExpPostErrorFLagsList[0] = true;
            return [{ _destroy: 0 }];
        }
 
    }
 
    // Validate Has resume
    public getValidateHasResume() {
        return (this.eduDocList.length > 1 || this.eduDocList[0].hasOwnProperty('document'));
    }

    public ngAfterViewInit() {
        if (this.s3loadComplete) {
            this.moduleInitialized = true;
        }
    }

    makeControlInvalid(control){
        control.markAsTouched();
        control.setErrors({'incorrect': true})
        control.value = null;       
    }

    public setStartDate($event) {
        if (this.moduleInitialized) {
            this.setStillWorking();
            this.eduForm.controls['edu_start_date'].setValue($event['selDate']);
            // this.eduForm.controls['edu_end_date'].setValue(null);
            this.eduForm.controls['edu_still_studing'].setValue(false);
        }
    }

    public setStillWorking() {
        this.stillStuding = false;
        this.eduEndDateError = true;
    }

    public getPostFormat() {
        let document;
        if (this.eduDocument) {
            document =  this.eduDocument;
        }else{
            document = { };
        }

        let postFormat = {
            id: this.eduForm.controls['edu_id'].value,
            job_education_id: this.eduForm.controls['edu_q_id'].value,
            city_id: this.eduForm.controls['edu_city_id'].value,
            country_id: this.eduForm.controls['edu_country_id'].value,
            grade: this.eduForm.controls['edu_grade'].value,
            school: this.eduForm.controls['edu_name'].value,
            field_of_study: this.eduForm.controls['edu_field_study'].value,
            from: this.eduForm.controls['edu_start_date'].value,
            to: this.eduForm.controls['edu_end_date'].value,
            document:document
        };

        return {
            data: postFormat, valid_form: this.eduForm.valid,
            custom_error: this.eduEndDateError
        };
    }

    public getObjectValue(parentId, childId = null) {

        if (this.eduDetails && parentId && this.eduDetails[parentId]) {
            if (childId && this.eduDetails[parentId][childId]) {
                return this.eduDetails[parentId][childId];
            } else {
                return this.eduDetails[parentId];
            }
        }

        return '';
    }

    public setCountry($event) {
        this.eduForm.controls['edu_country_id'].setValue($event.id);
        this.eduForm.controls['edu_city_id'].setValue('');
        this.eduForm.controls['edu_name'].setValue('');
    }

    public getSelectEndDate($event) {
        if (this.moduleInitialized) {
            this.eduEndDateError = false;
            this.stillStuding = false;
            this.eduForm.controls['edu_end_date'].setValue($event['selDate']);
            this.eduForm.controls['edu_still_studing'].setValue(false);
        }
    }

    public getRemoveMe() {
        this.removeMe.emit(true);
    }
    public onSelectCity($event) {
        if ($event.id) {
            this.eduForm.controls['edu_city_id'].setValue($event.id);
        }
    }
    public ngOnDestroy(): void {
        if (this.allCountriesSubcription) {
            this.allCountriesSubcription.unsubscribe();
        }
    }

    public onToggleCurrentlyStuding() {
        this.stillStuding = (!this.stillStuding);
        this.eduForm.controls['edu_end_date'].setValue(null);
        if (!this.stillStuding) {
            this.eduEndDateError = true;
        } else {
            this.eduEndDateError = false;
        }
    }

    //To Set End Date Value
    public setEndDate(event) {
        this.ShowEndDate = false;
        this.minEndDate = moment(event.selDate, "D MMM, YYYY")._d;
        setTimeout(() => { this.ShowEndDate = true, jQuery("input[name=edu_grade]").click() }, 100);
         var from = new Date(this.eduForm.controls['edu_start_date'].value);
          var to = new Date(this.eduForm.controls['edu_end_date'].value);

        if (from > to) {
            this.eduForm.controls['edu_end_date'].setValue(null);
        }
    }

}
