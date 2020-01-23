import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

// Services
import { AccountService } from '../../../core/account/services/account.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasicValidators, TypeValidators } from '../../../shared/validators/basicValidators';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { ConfigService } from '../../../shared/config.service';
import { ProfileService } from '../../../core/services/profile.service';
import { City } from '../../../shared/models/City';
declare var jQuery: any;

@Component({
    selector: 'complete-profile-steps-one',
    templateUrl: 'stepOne.component.html',
    styleUrls: ['./stepOne.component.scss']

})

export class StepOneComponent implements OnInit, OnDestroy {

    public maritalList$: BehaviorSubject<any> = new BehaviorSubject(null);
    public queryParamsObs;
    public currLan = 'en';
    public fixedTextHash = this.loaderService.getFixedText();
    public completeFirstForm: FormGroup;
    public defaultBirthDate = moment().subtract(25, 'years')['_d'];
    public birthDate;
    public maxDateDob = moment().subtract(18.1, 'y')['_d'];
    public toYearDob = moment().subtract(18.1, 'y').format('YYYY');
    public pristineFlag$: BehaviorSubject<any> = new BehaviorSubject(true);
    public screenwidth = 0;
    public windowSizeDivider = ConfigService.windowSizeDivider;
    public countryList = [];
    public dateRange = [];
    public monthRange = [];
    public yearRange = [];
    public countryId;
    public cityObj: City = new City();
    public genderHash = { not_defined: null, null: null, male: 'male', female: 'female' };
    public languagesList = [];
    public maxLangCount = 3;
    public visaStatusList$: BehaviorSubject<any> = new BehaviorSubject(null);
    public s3Holder;
    public cacheProfileHolder;
    public loadedFlag: boolean = false;
    public postInProcess: boolean = false;
    public toYear = moment().format('YYYY');
    public updateProfileSubcription;

    public isLocationSaudi;
    public isNationalitySaudi;
    public isNationalitySaudi$: BehaviorSubject<any> = new BehaviorSubject(false);
    public isLocationSaudi$: BehaviorSubject<any> = new BehaviorSubject(false);
    public showCitizen$: BehaviorSubject<any> = new BehaviorSubject(true);
    public visaCodeTaken$: BehaviorSubject<any> = new BehaviorSubject(false);

    public jobseekerType: string;
    public cvDocument;
    public documentTitle;
    public resumeList = [];
    public gotDoc: boolean = false;
    public invalidCv: boolean = false;
    public notShowAttachment = false;
    public invalidCoverLetter: boolean = false;
    public invalidCv$: BehaviorSubject<any> = new BehaviorSubject(null);
    public tooSmallCv: boolean = false;
    public tooSmallCv$: BehaviorSubject<any> = new BehaviorSubject(null);
    public tooLargeCv: boolean = false;
    public tooLargeCv$: BehaviorSubject<any> = new BehaviorSubject(null);
    public fileFormatList = ["application/pdf", "application/msword", "application/vnd.ms-office", "text/plain", "application/xls",
        "application/xlsx", "application/doc", "application/docx", "application/ppt", "application/pptx",
        "image/jpg", "image/jpeg", "image/png", "image/gif", "image/bmp",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    public documentFileSizeInMB = 5;


    public saudiArabiaObj = { id: 145, visa_id: 5, visa_name: 'Citizen' };
    public showCitizen: boolean = (ConfigService.SHOW_CITIZEN_LOCALS === 'true');

    public filteredVisaList = [];
    public isSaudi: boolean = false;

    // Language
    public languageTouched = false;
    public languageIdList = [];

    // Driving License

    constructor(public accountService: AccountService,
        public loaderService: LoaderService,
        public fb: FormBuilder,
        public profileService: ProfileService,
        public router: Router) {

        this.completeFirstForm = this.fb.group({
            first_name: ['', [Validators.required]],
            last_name: ['', [Validators.required]],
            email: ['', BasicValidators.email],
            has_driving_license: ['false'],
            driving_license_country_id: [null],
            mobile_phone: ['', [Validators.required, BasicValidators.phoneNo]],
            gender: ['', Validators.required],
            country_id: ['', Validators.required],
            marital_status: ['', Validators.required],
            visa_status_id: ['', Validators.required],
            language_ids: [[], Validators.required],
            city_id: ['', Validators.required],
            nationality_id: ['', Validators.required],
            birth_date: ['', Validators.required],
            dob_date: [null, Validators.required],
            dob_month: [null, Validators.required],
            dob_year: [null, Validators.required],
            visa_code: [null],
            cv_document: ['']
        });

        let endYear = parseInt(this.toYear, 10) - 60;
        let startYear = parseInt(this.toYear, 10) - 17;

        for (let i = startYear; i >= endYear; i--) {
            this.yearRange.push(i);
        }

        for (let j = 1; j <= 31; j++) {
            this.dateRange.push((j < 10) ? '0' + j : j);
        }

        this.monthRange = [
            { id: '01', name: this.fixedTextHash['jan'][this.currLan] },
            { id: '02', name: this.fixedTextHash['feb'][this.currLan] },
            { id: '03', name: this.fixedTextHash['mar'][this.currLan] },
            { id: '04', name: this.fixedTextHash['apr'][this.currLan] },
            { id: '05', name: this.fixedTextHash['may'][this.currLan] },
            { id: '06', name: this.fixedTextHash['jun'][this.currLan] },
            { id: '07', name: this.fixedTextHash['jul'][this.currLan] },
            { id: '08', name: this.fixedTextHash['aug'][this.currLan] },
            { id: '09', name: this.fixedTextHash['sep'][this.currLan] },
            { id: '10', name: this.fixedTextHash['oct'][this.currLan] },
            { id: '11', name: this.fixedTextHash['nov'][this.currLan] },
            { id: '12', name: this.fixedTextHash['dec'][this.currLan] }
        ];

    }

    public ngOnInit() {
        window.scroll(0, 0);
        this.screenwidth = window.innerWidth;
        this.currLan = this.accountService.getCurrLang();

        // Loading Marital Statuses
        this.maritalList$
            .next([{ id: 'married', name: this.fixedTextHash['married'][this.currLan] },
            { id: 'single', name: this.fixedTextHash['single'][this.currLan] }]);

        // Loading S3 Data
        this.s3Holder = AccountService.s3Loaded$.subscribe((resFlag) => {
            if (resFlag) {
                this.countryList = this.loaderService.getCountries('alphabetical');
                this.visaStatusList$.next(this.loaderService.getVisaStatuses());
                this.cacheProfileHolder = AccountService.cachedProfile$.subscribe((selProfile) => {
                    if (selProfile) {
                        this.jobseekerType = selProfile.jobseeker_type;
                        this.loadData(selProfile);
                    }
                });
            }
        });
        this.filteredVisaList = this.visaStatusList$.value;
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

    // Setting Date of birth
    public setDate($event) {
        this.birthDate = $event['selDate'];
        this.completeFirstForm.controls['dob_date']
            .setValue(moment(new Date(this.birthDate)).format('DD'));
        this.completeFirstForm.controls['dob_month']
            .setValue(moment(new Date(this.birthDate)).format('MM'));
        this.completeFirstForm.controls['dob_year']
            .setValue(moment(new Date(this.birthDate)).format('YYYY'));

    }

    // Loading Profile data
    public loadData(selProfile) {
        this.accountService.setSwitchFlag(false);

        this.onChangeNationality(this.getHashValue(selProfile['nationality'], 'id'));

        // First name.
        this.completeFirstForm.controls['first_name']
            .setValue(selProfile['first_name']);

        // Last name.
        this.completeFirstForm.controls['last_name']
            .setValue(selProfile['last_name']);

        // Mobile Number
        this.completeFirstForm.controls['mobile_phone']
            .setValue(this.getHashValue(selProfile['contact'],
                'mobile_no'));

        // Loading Resumes issue
        this.resumeList = [];
        // this.resumeList = this.getLoadObject(selProfile['resumes']);
        this.resumeList = this.getLoadObject([]);
        if (this.getValidateHasResume()) {
            this.completeFirstForm.controls['cv_document']
                .setValue(this.resumeList[0].document_file_name);
        }
        if (selProfile['document_nationality_id']) {
            this.resumeList[0]['document'] = selProfile['document_nationality_id'];
            this.completeFirstForm.controls.cv_document.setValue(selProfile['document_nationality_id']);
            this.cvDocument = selProfile['document_nationality_id'];
            this.gotDoc = true;
        }

        // Email id.
        this.completeFirstForm.controls['email']
            .setValue(this.getHashValue(selProfile['contact'],
                'email_address'));

        // Date of Birth
        let dob = this.getHashValue(selProfile['general_info'], 'dob');
        this.createDob();
        if (dob['year'] && dob['month'] && dob['day']) {
            this.birthDate = dob['year'] + '-' + dob['month'] + '-' + dob['day'];
            this.completeFirstForm.controls['birth_date'].setValue(this.birthDate);
            this.completeFirstForm.controls['dob_year'].setValue(dob['year']);
            this.completeFirstForm.controls['dob_month'].setValue(dob['month']);
            this.completeFirstForm.controls['dob_date'].setValue(dob['day']);
        } else {
            this.birthDate = '';
            this.completeFirstForm.controls['dob_year'].setValue(null);
            this.completeFirstForm.controls['dob_month'].setValue(null);
            this.completeFirstForm.controls['dob_date'].setValue(null);
        }
        if (!moment(new Date(this.completeFirstForm.value['birth_date'])).isValid()) {
            this.completeFirstForm.controls['birth_date'].setValue('');
        }

        // Gender
        this.completeFirstForm.controls['gender']
            .setValue(this.genderHash[this.getHashValue(selProfile['general_info'],
                'gender')]);

        // Marital Status
        this.completeFirstForm.controls['marital_status']
            .setValue(this.getHashValue(selProfile['general_info'],
                'marital_status'));

        // Current country of residence
        this.completeFirstForm.controls['country_id']
            .setValue(this.getHashValue(selProfile['country'], 'id'));
        this.countryId = this.getHashValue(selProfile['country'], 'id');

        // Current city of residence
        this.completeFirstForm.controls['city_id']
            .setValue(this.getHashValue(selProfile['city'], 'id'));
        this.cityObj = selProfile['city'];

        // Loading City object
        if (selProfile['city']) {
            this.cityObj.id = selProfile['city']['id'];
            this.cityObj.name = selProfile['city']['name'];
            this.cityObj.text = selProfile['city']['name'];
            this.cityObj.country_id = selProfile['country']['id'];
        }

        this.isSaudi = this.validateSaudiLocationByCountryId(this.getHashValue(selProfile['nationality'], 'id'));
        this.isLocationSaudi = this.validateSaudiLocationByCountryId(this.getHashValue(selProfile['country'], 'id'));
        this.isNationalitySaudi$.next(this.isSaudi);
        this.isLocationSaudi$.next(this.isLocationSaudi);

        // Load Nationality
        this.completeFirstForm.controls['nationality_id']
            .setValue(this.getHashValue(selProfile['nationality'], 'id'));


        if (selProfile['visa_code']) {
            this.completeFirstForm.controls['visa_code'].setValue(selProfile['visa_code']);
        }
        if (selProfile['document_nationality_id']) {
            this.completeFirstForm.controls['cv_document'].setValue(selProfile['document_nationality_id']);
        }

        // Load Visa
        this.completeFirstForm.controls['visa_status_id']
            .setValue(this.getHashValue(selProfile['general_info'],
                'visa_status', 'id'));

        // Load Languages
        this.languagesList = this.getHashValue(selProfile['general_info'],
            'languages') || [];
        this.languageIdList = this.languagesList.map((res) => res['id']);
        this.completeFirstForm.controls['language_ids'].setValue(this.languageIdList);

        // Load Driving License
        let drivingLc = this.getHashValue(selProfile['general_info'],
            'driving_license_issued_from', 'id');
        if (drivingLc) {
            this.completeFirstForm.controls['driving_license_country_id']
                .setValue(this.getHashValue(selProfile['general_info'],
                    'driving_license_issued_from', 'id'));
            this.completeFirstForm.controls['has_driving_license'].setValue('true');

        }

        this.loadedFlag = true;

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

    // Set too small File Flag.
    public setTooSmallFileFlags(fileType = 'cv_document', value = true) {
        if (fileType === 'cv_document') {
            this.tooSmallCv = value;
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
            this.tooSmallCv = false;
            this.invalidCv = false;
        }

        this.setFileValidationObservables();

    }

    // Remove All Attached Resume
    public removeResume() {
        this.gotDoc = false;
        this.notShowAttachment = true;
        this.completeFirstForm.controls['cv_document'].setValue('');

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
        // size is in bytes so 1kb = 1000 bytes
        if ($event.target.files[0].size < 1000) {
            this.setTooSmallFileFlags(fileType, true);
            return;
        }
        this.completeFirstForm.controls['cv_document'].setValue($event.target.files[0].name);
        this.documentTitle = $event.target.files[0].name;
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
        if (this.resumeList && this.resumeList[0] != undefined) {
            return (this.resumeList.length > 1 || this.resumeList[0].hasOwnProperty('document'));
        } else {
            return false;
        }
    }

    // Creating date of birth.
    public createDob() {

        if (this.completeFirstForm.controls['dob_month'].value &&
            this.completeFirstForm.controls['dob_year'].value) {
            this.dateRange = [];
            for (let j = 1; j <= moment(this.completeFirstForm.controls['dob_year'].value + '-' +
                this.completeFirstForm.controls['dob_month'].value, 'YYYY-M').daysInMonth(); j++) {
                this.dateRange.push((j < 10) ? '0' + j : j);
            }
        }

        if (this.completeFirstForm.controls['dob_date'].value &&
            this.completeFirstForm.controls['dob_month'].value &&
            this.completeFirstForm.controls['dob_year'].value) {
            this.completeFirstForm.controls['birth_date']
                .setValue(this.completeFirstForm.controls['dob_year'].value + '-' +
                    this.completeFirstForm.controls['dob_month'].value + '-' +
                    this.completeFirstForm.controls['dob_date'].value);
        }
    }

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

    // Changing Language. Second form
    public onChangeLan($event) {
        this.languageIdList = [];
        if ($event.languageList) {

            $event.languageList.forEach((selLan) => {
                this.languageIdList.push(selLan.id);
            });
        }
        this.languageTouched = true;
        this.completeFirstForm.controls['language_ids'].setValue(this.languageIdList);
    }

    // Check if valid Language
    public getValidLanguage() {
        return this.completeFirstForm.value['language_ids'].length > 0;
    }

    // Selecting Country and resetting city.
    public onSelectCountry($event) {
        this.completeFirstForm.controls['country_id'].setValue($event.id);
        this.countryId = $event.id;
        this.isLocationSaudi = this.validateSaudiLocationByCountryId(this.countryId);
        this.isLocationSaudi$.next(this.isLocationSaudi);
        this.resetCity();
    }
    resetIdDocument() {
        this.completeFirstForm.controls['visa_code'].setValue(null);
        this.removeResume();
        return;
    }

    validateSaudiLocationByCountryId(countryId) {
        if (this.saudiArabiaObj.id == countryId) {
            return true;
        } else {
            return false;
        }
    }

    // Resetting City
    public resetCity() {
        this.cityObj = new City();
        this.completeFirstForm.controls['city_id'].setValue(null);
    }

    // Selecting City
    public onSelectCity($event) {

        // Current city of residence
        this.completeFirstForm.controls['city_id']
            .setValue($event.id);
        this.cityObj = new City();
        this.cityObj.id = $event.id;
        this.cityObj.name = $event.name;
        this.cityObj.text = $event.name;
        this.cityObj.country_id = this.completeFirstForm.controls['country_id'].value;
    }

    // Validate Driving License
    public getValidateDrivingLicense() {
        if (this.completeFirstForm.controls['has_driving_license'].value === 'false' ||
            (this.completeFirstForm.controls['has_driving_license'].value === 'true' &&
                this.completeFirstForm.controls['driving_license_country_id'].value)) {
            return true;
        } else {
            return false;
        }
    }

    // Submit step
    public getSubmit() {
        this.pristineFlag$.next(false);
        if (!this.isLocationSaudi$.value && !this.isNationalitySaudi$.value) {
            this.completeFirstForm.controls['visa_code'].setValue(null);
            this.completeFirstForm.controls['cv_document'].setValue(null);
        } else if ((this.completeFirstForm.controls['visa_code'].value == '' ||
            this.completeFirstForm.controls['visa_code'].value == null) || this.completeFirstForm.controls['cv_document'].value == '' ||
            this.completeFirstForm.controls['cv_document'].value == null) {
            this.completeFirstForm.controls['visa_code'].setErrors({ required: true });
            this.completeFirstForm.controls['cv_document'].setErrors({ required: true });
            this.completeFirstForm.updateValueAndValidity();
        }

        if (this.completeFirstForm.valid &&
            this.getValidLanguage() &&
            this.getValidateDrivingLicense()) {
            // Attach the Attachment
            // Removing existing resumes

            let document;
            if (this.cvDocument) {
                document = this.cvDocument;
                this.completeFirstForm.controls['cv_document'].setValue(document);
            } else {
                document = null;
            }
            let postData = {
                driving_license_country_id:
                    this.completeFirstForm.value['driving_license_country_id'],
                marital_status: this.completeFirstForm.value['marital_status'],
                mobile_phone: this.completeFirstForm.value['mobile_phone'],
                visa_status_id: this.completeFirstForm.value['visa_status_id'],
                nationality_id: this.completeFirstForm.value['nationality_id'],
                visa_code:this.completeFirstForm.value['visa_code'],
                document_nationality_id:document,
                language_ids: this.languageIdList,
                user_attributes: {
                    first_name: this.completeFirstForm.value['first_name'],
                    last_name: this.completeFirstForm.value['last_name'],
                    city_id: this.completeFirstForm.value['city_id'],
                    country_id: this.completeFirstForm.value['country_id'],
                    gender: this.completeFirstForm.value['gender'],
                    dob_day: moment(new Date(this.completeFirstForm.value['birth_date']
                        .replace(/-/g, '/'))).format('DD'),
                    dob_month: moment(new Date(this.completeFirstForm.value['birth_date']
                        .replace(/-/g, '/'))).format('MM'),
                    dob_year: moment(new Date(this.completeFirstForm.value['birth_date']
                        .replace(/-/g, '/'))).format('YYYY'),
                }
            };
            this.postInProcess = true;
            this.updateProfileSubcription = this.profileService
                .updateProfile(postData).subscribe((res) => {
                    if (this.jobseekerType == "coops" || this.jobseekerType == "summer_training") {
                        this.router.navigate([this.accountService.getCurrLangUrl()
                            + 'job-seeker/complete-profile/complete-step-two']);
                    } else {
                        this.router.navigate([this.accountService.getCurrLangUrl()
                            + 'job-seeker/complete-profile/step-two']);
                    }
                    this.postInProcess = false;
                }, (error) => {
                    if(error.error.visa_code){
                        this.visaCodeTaken$.next(true);
                    }
                    setTimeout(()=>{ 
                        this.visaCodeTaken$.next(false);
                   }, 2000);
                    this.postInProcess = false;
                });

        }
    }

    public onChangeNationality(countryId,from='') {
        if (countryId != undefined && countryId != null) {
 
            this.isSaudi = this.getIsSaudi();
            this.isNationalitySaudi$.next(this.isSaudi);
            this.isNationalitySaudi = this.isSaudi;
        }
        if(from=='fromView'){
            this.resetIdDocument();
        }
    }

    makeControlInvalid(control) {
        control.markAsTouched();
        control.setErrors({ 'incorrect': true })
        control.value = null;
    }

    public getIsSaudi() {
        if (this.showCitizen) {
            if (this.completeFirstForm.controls['nationality_id'].value === this.saudiArabiaObj.id) {
                this.filteredVisaList = this.visaStatusList$.value;
                this.completeFirstForm.controls['visa_status_id'].setValue(this.saudiArabiaObj.visa_id);
                return true;
            }
            else {
                this.filteredVisaList = [];
                this.visaStatusList$.value.forEach((res) => {
                    if (res.id != this.saudiArabiaObj.visa_id) {
                        this.filteredVisaList.push({ "id": res.id, "name": res.name });
                    }
                    else {
                        if (this.completeFirstForm.controls['visa_status_id'].value == this.saudiArabiaObj.visa_id) {
                            this.completeFirstForm.controls['visa_status_id'].setValue(null);
                        }
                    }
                });
                return false;
            }
        }
        else {
            return false;
        }
    }
}
