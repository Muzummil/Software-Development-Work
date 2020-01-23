import { OnInit, Component, OnDestroy, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../../../core/account/services/account.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { Router, ActivatedRoute } from '@angular/router';
// directives
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from '../../../shared/config.service';
import { CareerFairService } from '../../../core/services/careerFair.service';
import { BasicValidators, TypeValidators } from 'app/shared/validators/basicValidators';
declare var jQuery: any;
import * as moment from 'moment';
import { ErrorHandling } from '../../../core/services/errorHandling.service';

@Component({
    selector: 'career-fair-details',
    templateUrl: 'careerFairDetails.component.html',
    styleUrls: ['./careerFairDetails.scss']
})

export class CareerFairDetailsComponent implements OnInit, OnDestroy {

    public careerFairForm: FormGroup;
    public queryParamsObs;
    public errorFlag: boolean = false;
    public pristineFlag$: BehaviorSubject<any> = new BehaviorSubject(true);
    public currLan = 'en';
    public fixedTextHash = this.loaderService.getFixedText();
    public selCareerFair = {};
    public errrorMessage$: BehaviorSubject<any> = new BehaviorSubject(null);
    public successFlag$: BehaviorSubject<any> = new BehaviorSubject(null);
    public carrerFairId;
    public totalRecords$: BehaviorSubject<any> = new BehaviorSubject(0);
    public isAuthorized$: BehaviorSubject<any> = new BehaviorSubject(null);
    public isPublic: boolean = true;
    public showSpinner = false;
    public toYear = moment().format('YYYY');
    public yearRange = [];
    public dateRange = [];
    public monthRange = [];
    public countryList = [];
    public educationList = [];
    public experienceLevelList$: BehaviorSubject<any> = new BehaviorSubject(null);
    public defaultBirthDate = moment().subtract(25, 'years')['_d'];
    public birthDate;
    public maxDateDob = moment().subtract(18.1, 'y')['_d'];
    public toYearDob = moment().subtract(18.1, 'y').format('YYYY');
    public genderHash = { not_defined: null, null: null, male: 'male', female: 'female' };
    public isShowForm: boolean = false;
    public showEmailError: boolean = false;
    public successfulMsg: boolean = false;
    public mailDisabled: boolean = false;
    public alreadyAppliedError: boolean = false;

    constructor(public accountService: AccountService,
        private el: ElementRef,
        public _activeRoute: ActivatedRoute,
        public careerFair: CareerFairService,
        public fb: FormBuilder,
        public errorService: ErrorHandling,
        public _router: Router,
        public loaderService: LoaderService) {

        this.accountService.setPageSeo('careerFair');
        this.accountService.setSwitchFlag(false);

        this.intializeForm();
    }

    public intializeForm() {
        this.pristineFlag$.next(true);

        this.careerFairForm = this.fb.group({
            first_name: ['', [Validators.required]],
            last_name: ['', [Validators.required]],
            email: ['', BasicValidators.email],
            mobile_phone: [null, [Validators.required, BasicValidators.phoneNo]],
            nationality_id: ['', Validators.required],
            gender: ['', Validators.required],
            birth_date: ['', Validators.required],
            dob_date: [null, Validators.required],
            dob_month: [null, Validators.required],
            dob_year: [null, Validators.required],
            job_experience_level_id: ['', Validators.required],
            highest_edu_name_id: ['', Validators.required],
            field_of_study: ['', Validators.required]
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
        this.birthDate = '';
        jQuery(".int-tel-phoneNum").val('');
    }

    public ngOnDestroy() {
        if (this.queryParamsObs) {
            this.queryParamsObs.unsubscribe();
        }
    }


    public ngOnInit(): void {
        this.currLan = this.accountService.getCurrLang();
        AccountService.s3Loaded$.subscribe((resFlag) => {
            if (resFlag) {
                this.countryList = this.loaderService.getCountries('alphabetical');
                this.educationList = this.loaderService.getJobEducations();
                this.experienceLevelList$.next(this.loaderService.getExperienceLevels());
                if (this.accountService.getAuth()) {
                    AccountService.cachedProfile$.subscribe((selProfile) => {
                        if (selProfile) {
                            this.loadData(selProfile);
                        }
                    });
                }
            }
        });
        this.showSpinner = true;
        // URL Params Fetch
        this._activeRoute.params.subscribe((params) => {
            this.isAuthorized$.next(this.accountService.getAuth());
            this.isPublic = !this.accountService.getAuth();
            if (params['CareerFairTitle-id']) {
                let paramList = params['CareerFairTitle-id'].split('-');
                this.carrerFairId = +paramList[paramList.length - 1];
                this.careerFair.getCareerFairDetails(this.carrerFairId).subscribe((res) => {
                    this.showSpinner = false;
                    this.selCareerFair = res['career_fair'];
                }, (error) => {
                    this.errorService.errorHandling(error);
                });
            }
        });
        if (this.accountService.getUserId()) {
            this.mailDisabled = true;
        }
    }

    // Loading Profile data
    public loadData(selProfile) {
        this.accountService.setSwitchFlag(false);
        // First name.
        this.careerFairForm.controls['first_name']
            .setValue(selProfile['first_name']);

        // Last name.
        this.careerFairForm.controls['last_name']
            .setValue(selProfile['last_name']);

        // Mobile Number
        this.careerFairForm.controls['mobile_phone']
            .setValue(this.getHashValue(selProfile['contact'],
                'mobile_no'));

        // Email id.
        this.careerFairForm.controls['email']
            .setValue(this.getHashValue(selProfile['contact'],
                'email_address'));

        // Date of Birth
        let dob = this.getHashValue(selProfile['general_info'], 'dob');
        this.createDob();
        if (dob['year'] && dob['month'] && dob['day']) {
            this.birthDate = dob['year'] + '-' + dob['month'] + '-' + dob['day'];
            this.careerFairForm.controls['birth_date'].setValue(this.birthDate);
            this.careerFairForm.controls['dob_year'].setValue(dob['year']);
            this.careerFairForm.controls['dob_month'].setValue(dob['month']);
            this.careerFairForm.controls['dob_date'].setValue(dob['day']);
        } else {
            this.birthDate = '';
            this.careerFairForm.controls['dob_year'].setValue(null);
            this.careerFairForm.controls['dob_month'].setValue(null);
            this.careerFairForm.controls['dob_date'].setValue(null);
        }
        if (!moment(new Date(this.careerFairForm.value['birth_date'])).isValid()) {
            this.careerFairForm.controls['birth_date'].setValue('');
        }

        // Gender
        this.careerFairForm.controls['gender']
            .setValue(this.genderHash[this.getHashValue(selProfile['general_info'],
                'gender')]);


        // Load Nationality
        this.careerFairForm.controls['nationality_id']
            .setValue(this.getHashValue(selProfile['nationality'], 'id'));

        // Experiece Level   
        this.careerFairForm.controls['job_experience_level_id']
            .setValue(this.getHashValue(selProfile['general_info'],
                'experince_level', 'id'));

        // Education
        if (selProfile['general_info']['highest_edu']) {
            this.careerFairForm.controls['highest_edu_name_id']
                .setValue(selProfile['general_info']['highest_edu']['id']);
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

    public onApplyCareerFair() {
        // this.careerFair.getJoinCareerFair(this.carrerFairId).subscribe((res) => {
        //     this.selCareerFair['applied_date'] = res['career_fair_application']['applied_date'];
        //     jQuery('.apply-career-fair').modal('hide');
        // });    
    }

    public createReffererUrl() {
        let loginUrl = this.accountService.getCurrLangUrl() + this.accountService.getPath()
            + '/login';
        loginUrl = loginUrl.replace(/([^:]\/)\/+/g, '$1');
        this._router.navigateByUrl(loginUrl + '?reffererUrl=' + window.location.pathname + "&iscareerfair=true");
    }

    public makeControlInvalid(control) {
        control.markAsTouched();
        control.setErrors({ 'incorrect': true })
        control.value = null;
    }

    public setDate($event) {
        this.birthDate = $event['selDate'];
        this.careerFairForm.controls['dob_date']
            .setValue(moment(new Date(this.birthDate)).format('DD'));
        this.careerFairForm.controls['dob_month']
            .setValue(moment(new Date(this.birthDate)).format('MM'));
        this.careerFairForm.controls['dob_year']
            .setValue(moment(new Date(this.birthDate)).format('YYYY'));

    }

    // Creating date of birth.
    public createDob() {
        if (this.careerFairForm.controls['dob_month'].value &&
            this.careerFairForm.controls['dob_year'].value) {
            this.dateRange = [];
            for (let j = 1; j <= moment(this.careerFairForm.controls['dob_year'].value + '-' +
                this.careerFairForm.controls['dob_month'].value, 'YYYY-M').daysInMonth(); j++) {
                this.dateRange.push((j < 10) ? '0' + j : j);
            }
        }
        if (this.careerFairForm.controls['dob_date'].value &&
            this.careerFairForm.controls['dob_month'].value &&
            this.careerFairForm.controls['dob_year'].value) {
            this.careerFairForm.controls['birth_date']
                .setValue(this.careerFairForm.controls['dob_year'].value + '-' +
                    this.careerFairForm.controls['dob_month'].value + '-' +
                    this.careerFairForm.controls['dob_date'].value);
        }
    }

    public isAlreadySignUp(resp) {
        if (resp == true) {
            this.createReffererUrl();
        }
        else {
            this.isShowForm = true;
            this.intializeForm();
        }
    }

    public getPostData() {
        let postData = {
            "user": {
                "first_name": this.careerFairForm.value['first_name'],
                "last_name": this.careerFairForm.value['last_name'],
                "email": this.careerFairForm.value['email'],
                "role": "jobseeker",
                "career_fair_id": this.carrerFairId,
                "birthday": this.birthDate,
                "gender": this.careerFairForm.value['gender'],
                "field_of_study": this.careerFairForm.value['field_of_study'],
                "jobseeker_attributes": {
                    "jobseeker_type": "normal",
                    "mobile_phone": this.careerFairForm.value['mobile_phone'],
                    "job_experience_level_id": this.careerFairForm.value['job_experience_level_id'],
                    "job_education_id": this.careerFairForm.value['highest_edu_name_id'],
                    "nationality_id": this.careerFairForm.value['nationality_id'],
                }
            }
        };
        return postData;
    }

    public registerCareerFair() {
        window.scroll(0, 0);
        this.showSpinner = true;
        this.successfulMsg = false;
        this.showEmailError = false;
        this.alreadyAppliedError = false;

        this.pristineFlag$.next(false);
        if (this.careerFairForm.valid) {
            let postData = this.getPostData();
            if (this.accountService.getUserId()) {
                postData["user"]["id"] = this.accountService.getUserId();
                // Update .. Put Request
                this.careerFair.updateJobseekerCareerFair(postData).subscribe((res) => {
                    if (res) {
                        this.successfulMsg = true;
                        this.showSpinner = false;
                        setTimeout(() => {
                            this.successfulMsg = false;
                            this.intializeForm();
                        }, 3000);
                    }
                }, (error) => {
                    this.showSpinner = false;
                    if (error && error["error"]["career_fair_id"] && error["error"]["career_fair_id"][0]) {
                        if (error["error"]["career_fair_id"][0] = "has already been taken") {
                            this.alreadyAppliedError = true;
                        }
                    }
                });
            }
            else {
                // Creates.. Post Request
                this.careerFair.registerCareerFair(postData).subscribe((res) => {
                    if (res) {
                        this.successfulMsg = true;
                        this.showSpinner = false;
                        setTimeout(() => {
                            this.successfulMsg = false;
                            this.intializeForm();
                        }, 3000);
                    }
                }, (error) => {
                    this.showSpinner = false;
                    if (error && error["error"] && error["error"]["email"] && error["error"]["email"][0]) {
                        if (error["error"]["email"][0] = "has already been taken") {
                            this.showEmailError = true;
                        }
                    }
                });
            }
        }
        else {
            this.findInvalidControls();
            this.showSpinner = false;
        }
    }

    public findInvalidControls() {
        // console.log(jQuery('.error-feild'))
        
        // jQuery('html, body').animate({
        //     scrollTop: (jQuery('.error-feild').first().offset().top)
        // },500);

        const invalidElements = this.el.nativeElement.querySelectorAll('.ng-invalid');
        if (invalidElements.length > 0) {
            if (invalidElements[1]) {
                //var errorDiv = invalidElements[1];
                // var scrollPos = errorDiv.offset().top;
                // jQuery(window).scrollTop(scrollPos);
                invalidElements[1].focus();
            }
        }
        // const invalid = [];
        // const controls = this.careerFairForm.controls;
        // for (const name in controls) {
        //     if (controls[name].invalid) {
        //         invalid.push(name);
        //         break;
        //     }
        // }
        // return invalid;
    }

    public getMsg() {
        return this.fixedTextHash['email_exist_career_fair'][this.currLan].replace("##msg##", '<a>' + this.fixedTextHash['signin'][this.currLan] + '</a>')
    }


}
