import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { BasicValidators } from '../../../shared/validators/basicValidators';

import { City } from '../../../shared/models/City';

// Validators
import { PasswordValidator } from '../../../shared/validators/passwordValidator';
import { TypeValidators } from '../../../shared/validators/basicValidators';

// Services
import { SignupService } from '../services/signup.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { Observable } from 'rxjs/Observable';
import { AccountService } from '../../account/services/account.service';
import { ConfigService } from '../../../shared/config.service';

let moment = require('moment');
declare var jQuery: any;

@Component({
    selector: 'signup-generic',
    templateUrl: 'signupGeneric.component.html',
    styleUrls: ['signupGeneric.scss']
})

export class SignupGenericComponent implements OnInit, OnDestroy {

    public screenwidth = 0;
    public signupForm: FormGroup;
    public pristineFlag$: BehaviorSubject<any> = new BehaviorSubject(true);
    public cityList$: BehaviorSubject<any> = new BehaviorSubject(null);
    public cityList = [];
    public activeParamsSubscription;
    public yearRange = [];
    public monthRange = [];
    public dateRange = [];
    public cityObj: City = new City();
    public birthDate;
    public signUpType:string;
    public title;

    public defaultBirthDate = moment().subtract(25, 'years')._d;
    public toYear = moment().subtract(18.1, 'y').format('YYYY');
    public maxDate = moment().subtract(18.1, 'y')._d;
    public country_id = null;
    public country_name = null;
    public nationality_id = null;
    public nationality_name = null;
    public errorFlag = false;
    public successFlag = false;
    public postinProgress = false;
    public isFormEmpty = false;

    public socialMediaHash = {facebook: 'Facebook', twitter_login: 'Twitter'};
    public linkedinSpinner = false;
    public facebookSpinner = false;
    public googleSpinner = false;
    public twitterSpinner = false;
    public windowSizeDivider = ConfigService.windowSizeDivider;

    @Input() public popupMode: boolean = true;
    public errorMessage;
    public currLan = 'en';
    public fixedTextHash = this.loaderService.getFixedText();

    constructor(public signupService: SignupService,
                public loaderService: LoaderService,
                public accountService: AccountService,
                public _activeRoute: ActivatedRoute,
                public _router: Router,
                public _fb: FormBuilder) {

        this.accountService.setPageSeo('signup-experienced-hire');
        this.errorMessage = this.fixedTextHash['registration_error'][this.currLan];
    }
    public ngOnDestroy() {
        try{
            this.activeParamsSubscription.unsubscribe();
        }catch(e){}
    }

    public ngOnInit() {
        this.currLan = this.accountService.getCurrLang();
        let type = this._activeRoute.params['value'].name;
        if(type && (type=="coop-program" || type=="summer-training" || type=="fresh") ){
            this.signUpType = type;
        }else{
            this._router.navigate(['/']);
        }
        this.title = 'signup_' + type;
        window.scroll(0, 0);
        this.screenwidth = window.innerWidth;
        let reset = true;

        this.monthRange = [
            {id: 1, name: 'Jan'},
            {id: 2, name: 'Feb'},
            {id: 3, name: 'Mar'},
            {id: 4, name: 'Apr'},
            {id: 5, name: 'May'},
            {id: 6, name: 'Jun'},
            {id: 7, name: 'Jul'},
            {id: 8, name: 'Aug'},
            {id: 9, name: 'Sep'},
            {id: 10, name: 'Oct'},
            {id: 11, name: 'Nov'},
            {id: 12, name: 'Dec'}
        ];
        let endYear = this.toYear * 1 - 60;
        let startYear = this.toYear * 1;
        for (let i = startYear; i >= endYear; i--) {
            this.yearRange.push(i);
        }

        for (let j = 1; j <= 31; j++) {
            this.dateRange.push(j);
        }

        this.cityObj.id = null;

        this.signupForm = this._fb.group({
            first_name: ['', [Validators.required]],
            last_name: ['', [Validators.required]],
            email: [null, [Validators.required, BasicValidators.email]],
            gender: [''],
            country_id: [''],
            city_id: [''],
            nationality_id: [''],
            birth_date: [''],
            dob_date: [null],
            dob_month: [null],
            dob_year: [null],
            password: ['', [Validators.required]],
            confirm_password: [''],
        });
        
        this.activeParamsSubscription = this._activeRoute.queryParams.subscribe((params) => {
            if (params['first_name'] && params['last_name'] &&
                params['error'] && params['error'] == 'true' && params['provider']) {

                this.signupForm.controls['first_name'].setValue(params['first_name']);
                this.signupForm.controls['last_name'].setValue(params['last_name']);
                this.errorFlag = true;
                this.errorMessage = this.fixedTextHash['no_email_link_error'][this.currLan]
                    .replace('PROVDR', this.socialMediaHash[params['provider']]);
            }

        });

    }

    public loginLinkedIn() {

        this.linkedinSpinner = true;
        window.location.href = ConfigService.getAPI() + 'users/auth/linkedin';
    }

    public loginFacebook() {
        this.facebookSpinner = true;
        window.location.href = ConfigService.getAPI() + 'users/auth/facebook';
    }

    public loginGoogle() {
        this.googleSpinner = true;
        window.location.href = ConfigService.getAPI() + 'users/auth/google_oauth2';
    }

    public loginTwitterIn() {
        this.twitterSpinner = true;
        window.location.href = ConfigService.getAPI() + 'users/auth/twitter_login';
    }

    public createDob() {

        if (this.signupForm.controls['dob_month'].value &&
            this.signupForm.controls['dob_year'].value) {
            this.dateRange = [];
            for (let j = 1; j <= moment(this.signupForm.controls['dob_year'].value +
                '-' + this.signupForm.controls['dob_month'].value, 'YYYY-M').daysInMonth(); j++) {
                this.dateRange.push(j);
            }
        }

        if (this.signupForm.controls['dob_date'].value &&
            this.signupForm.controls['dob_month'].value &&
            this.signupForm.controls['dob_year'].value) {
            this.signupForm.controls['birth_date']
                .setValue(this.signupForm.controls['dob_year'].value + '-' +
                    this.signupForm.controls['dob_month'].value + '-' +
                    this.signupForm.controls['dob_date'].value);
        }
    }

    public signup_jobseeker() {
        this.pristineFlag$.next(false);
        let formAllControls:any = this.signupForm.controls;
        if (!this.signupForm.valid) {
            if(formAllControls.first_name.value=='' &&  formAllControls.last_name.value=='' && 
            formAllControls.email.value=='' && formAllControls.password.value==''){
                this.isFormEmpty = true;
            }else this.isFormEmpty = false;
            return;
        }
        let jobRole;
        if(this.signUpType=="coop-program"){
            jobRole = "coops";
        }else if(this.signUpType=='fresh'){
            jobRole = "fresh_grad";
        } else {
            jobRole = "summer_training";
        }

        this.pristineFlag$.next(true);

            let postDate = {
                user: {
                    first_name: this.signupForm.value['first_name'],
                    last_name: this.signupForm.value['last_name'],
                    email: this.signupForm.value['email'].trim(),
                    password: this.signupForm.value['password'],
                    password_confirmation: this.signupForm.value['password'],
                    role:'jobseeker',
                    jobseeker_type: jobRole,
                }
            };
            if (this.postinProgress == false) {
                this.postinProgress = true;
                this.signupService.signupJobseeker(postDate).subscribe((res) => {
                    this.successFlag = true;
                    if (this.popupMode) {
                        jQuery('.join-jobseeker').modal('hide');
                        jQuery('.conform-jobseeker').modal();
                        Observable.timer(5000).subscribe((val) => {
                            this.successFlag = false;
                            jQuery('.conform-jobseeker').modal('hide');
                            this._router.navigate(['login']);        
                        });
                    } else {
                        Observable.timer(7000).subscribe((val) => {
                            this.successFlag = false;
                            this._router.navigate([this.accountService.getCurrLangUrl()]);
                        });
                    }

                }, (error) => {
                    this.postinProgress = false;
                    this.errorFlag = true;
                    let body = error['error'];

                    for (let errorkey in body) {
                        this.errorMessage = this.fixedTextHash['registration_error'][this.currLan];
                        if (errorkey == 'email') {
                            this.errorMessage =
                                this.fixedTextHash['email_taken_error'][this.currLan];
                        }
                        if (errorkey == 'password') {
                            this.errorMessage = this.fixedTextHash['password_error'][this.currLan];
                        }

                    }
                    Observable.timer(5000).subscribe((val) => {
                        this.errorFlag = false;
                    });
                });

            }


    }

    public onSelectCountryMob($event) {
        this.country_id = jQuery('#countries-mobile option:selected').val();
        this.country_name = $event.name;

        this.cityObj.id = null;
        this.cityObj.text = null;
        this.cityObj.name = null;
        this.cityObj.country_id = null;
        this.cityList = [];
        this.loaderService.getCitiesList([this.country_id]).subscribe((city) => {

            city.forEach((res) => {
                this.cityList.push({id: res.id, text: res.name});
            });

            this.cityList$.next(this.cityList);
        });
    }

    public onSelectCountry($event) {
        this.country_id = $event.id;
        this.country_name = $event.name;

        this.cityObj.id = null;
        this.cityObj.text = null;
        this.cityObj.name = null;
        this.cityObj.country_id = null;

    }

    public onSelectNationality($event) {
        this.nationality_id = $event.id;
        this.nationality_name = $event.name;

    }

    public setDate($event) {
        this.birthDate = $event['selDate'];
    }



}
