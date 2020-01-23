import {
    AfterViewInit,
    Component, DoCheck, EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ChangeDetectionStrategy
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from '../../../core/services/profile.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { AccountService } from '../../../core/account/services/account.service';
import { BehaviorSubject } from 'rxjs';
import { City } from '../../../shared/models/City';

declare var jQuery: any;

let moment = require('moment');

@Component({
    selector: 'add-work-experience-step-two',
    templateUrl: 'workExperienceStepTwo.component.html',
    styleUrls: ['./workExperienceStepTwo.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,

})

export class WorkExperienceStepTwoComponent implements OnDestroy, OnInit, AfterViewInit {

    @Input() public prestineForm$ = new BehaviorSubject(true);
    @Input() public workExp = {};
    @Input() public workExperienceIndex = 0;
    @Input() public allowDelete: boolean = true;
    @Output() public removeMe = new EventEmitter();
    @Output() public changeWorkExp = new EventEmitter();
    public currLan = 'en';
    public fixedTextHash = this.loaderService.getFixedText();
    public workForm: FormGroup;
    public allCountriesSubcription;
    public spinnerLoader$: BehaviorSubject<any> = new BehaviorSubject(false);
    public sectorList = [];
    public countryList = [];
    public companyStillWorking = true;
    public currentCityObj = new City();
    public toYear = moment().format('YYYY');
    public maxDate = moment()._d;
    public companyEndDateReq = false;
    public rolesRes = [];
    public s3loadComplete: boolean = false;
    public moduleInitialized: boolean = false;

    public minEndDate = moment();
    ShowEndDate: boolean = true;

    constructor(public fb: FormBuilder,
        public _profileService: ProfileService,
        public loaderService: LoaderService,
        public accountService: AccountService) {

        this.spinnerLoader$.next(true);
        AccountService.s3Loaded$.subscribe((resFlag) => {
            if (resFlag) {
                this.sectorList = this.loaderService.getSectors('alpha');
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

    public ngAfterViewInit() {
        if (this.s3loadComplete) {
            this.moduleInitialized = true;
        }
    }

    public ngOnInit(): void {

        this.workForm = this.fb.group({
            work_id: [this.getObjectValue('id')],
            company_id: [this.getObjectValue('company', 'id')],
            company_name: [this.getObjectValue('company', 'name'), Validators.required],
            company_title: [this.getObjectValue('position'), Validators.required],
            company_sector_id: [this.getObjectValue('sector', 'id'), Validators.required],
            company_country_id: [this.getObjectValue('country', 'id'), Validators.required],
            company_city_id: [this.getObjectValue('city', 'id'), Validators.required],
            company_start_date: [this.getObjectValue('from'), Validators.required],
            company_end_date: [this.getObjectValue('to')],
            company_still_working: [false],
            company_description: [this.getObjectValue('description')]
        });


        if (this.workExp && this.workExp['from'] != undefined && this.workExp['from'] != null) {
            if (this.workExp && this.workExp['to'] != undefined && this.workExp['to'] != null) {
                this.workForm.controls['company_still_working'].setValue(false);
                this.companyStillWorking = false;
            } else {
                this.workExp['company_still_working'] = true;
                this.workForm.controls['company_still_working'].setValue(true);
                this.companyStillWorking = true;
            }
        }
        else {
            this.workForm.controls['company_still_working'].setValue(false);
            this.companyStillWorking = false;
        }



        if (this.workExp && this.workExp['city']) {
            this.currentCityObj.id = this.workExp['city']['id'];
            this.currentCityObj.name = this.workExp['city']['name'];
            this.currentCityObj.text = this.workExp['city']['name'];
        }

        // Loading Roles
        this.rolesRes = Array.isArray(this.workForm.controls['company_description'].value) ?
            this.workForm.controls['company_description'].value : [];

        // Emitting every change.
        this.workForm.valueChanges.subscribe((res) => {
            if (this.s3loadComplete) {
                this.changeWorkExp.emit(this.getPostFormat());
            }
        });

        this.currLan = this.accountService.getCurrLang();

    }

    public getSelectEndDate($event) {
        if (this.moduleInitialized) {
            this.companyEndDateReq = false;
            this.companyStillWorking = false;
            this.workForm.controls['company_end_date'].setValue($event['selDate']);
            this.workForm.controls['company_still_working'].setValue(false);
        }
    }

    makeControlInvalid(control){
        control.markAsTouched();
        control.setErrors({'incorrect': true})
        control.value = null;       
    }

    public getPostFormat() {

        let postFormat = {
            id: this.workForm.controls['work_id'].value,
            sector_id: this.workForm.controls['company_sector_id'].value,
            country_id: this.workForm.controls['company_country_id'].value,
            company_name: this.workForm.controls['company_name'].value,
            company_id: this.workForm.controls['company_id'].value,
            city_id: this.workForm.controls['company_city_id'].value,
            position: this.workForm.controls['company_title'].value,
            description: this.workForm.controls['company_description'].value || [],
            from: this.workForm.controls['company_start_date'].value,
            to: this.workForm.controls['company_end_date'].value
        };

        this.rolesRes = Array.isArray(this.workForm.controls['company_description'].value) ?
            this.workForm.controls['company_description'].value : [];
        return {
            data: postFormat, valid_form: this.workForm.valid,
            custom_error: this.companyEndDateReq
        };
    }

    public setStartDate($event) {
        if (this.moduleInitialized) {
            this.setStillWorking();
            this.workForm.controls['company_start_date'].setValue($event['selDate']);
            // this.workForm.controls['company_end_date'].setValue(null);
            this.workForm.controls['company_still_working'].setValue(false);

        }
    }

    // Initializing Modular
    public setModuleInitializer() {
        this.moduleInitialized = true;
    }

    public setStillWorking() {
        this.companyStillWorking = false;
        this.companyEndDateReq = true;
    }

    public getObjectValue(parentId, childId = null) {

        if (this.workExp && parentId && this.workExp[parentId]) {
            if (childId && this.workExp[parentId][childId]) {
                return this.workExp[parentId][childId];
            } else {
                return this.workExp[parentId];
            }
        }

        return '';
    }

    public setCountry($event) {
        this.workForm.controls['company_country_id'].setValue($event.id);
        this.workForm.controls['company_city_id'].setValue('');
    }

    public getRemoveMe() {
        this.removeMe.emit(true);
    }
    public onSelectCity($event) {
        if ($event.id) {
            this.workForm.controls['company_city_id'].setValue($event.id);
        }
    }
    public ngOnDestroy(): void {
        if (this.allCountriesSubcription) {
            this.allCountriesSubcription.unsubscribe();
        }
    }

    public onToggleCurrentlyWorking() {
        this.companyStillWorking = (!this.companyStillWorking);

        // this.workForm.controls['company_end_date'].setValue(null);
        if (!this.companyStillWorking) {
            this.companyEndDateReq = true;
            this.workForm.controls['company_still_working'].setValue(false);
        } else {
            this.companyEndDateReq = false;
            this.workForm.controls['company_still_working'].setValue(true);
            this.workForm.controls['company_end_date'].setValue('');
        }
    }

    public addRole(description) {
        if (description) {
            this.rolesRes.push(description);
        }
        this.workForm.controls['company_description'].setValue(this.rolesRes);
    }

    public removeRole(rIndex) {
        if (this.rolesRes[rIndex]) {
            this.rolesRes.splice(rIndex, 1);
        }
        this.workForm.controls['company_description'].setValue(this.rolesRes);
    }

    //To Set End Date Value
    public setEndDate(event) {
        this.ShowEndDate = false;
        this.minEndDate = moment(event.selDate, "D MMM, YYYY")._d;
        setTimeout(() => { this.ShowEndDate = true, jQuery("input[name=formCompany_company_title]").click() }, 100);
        var from = new Date(this.workForm.controls['company_start_date'].value);
        var to = new Date(this.workForm.controls['company_end_date'].value);
        if (from > to) {
            this.workForm.controls['company_end_date'].setValue(null);
        }
    }
}
