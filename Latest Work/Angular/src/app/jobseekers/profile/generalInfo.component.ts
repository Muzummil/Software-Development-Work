import {
    Input,
    Component,
    OnInit,
    Output,
    EventEmitter,
    ChangeDetectionStrategy,
    OnDestroy
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';

// Services
import { ProfileService } from '../../core/services/profile.service';
import { LoaderService } from '../../shared/services/loader.service';

// Models
import { JobSeekerGeneralInfo, Language } from './models/JobSeekerGeneralInfo';

// Validators
import { TypeValidators } from '../../shared/validators/basicValidators';
import { AccountService } from '../../core/account/services/account.service';
import { ConfigService } from 'app/shared/config.service';

let moment = require('moment');


@Component({
    selector: 'general_info',
    templateUrl: 'generalInfo.component.html',
    styleUrls: ['./generalInfo.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class GeneralInfoComponent implements OnInit, OnDestroy {

    @Input() generalInfo;
    @Input() percentage: BehaviorSubject<any>;

    @Input() jobSeekerGeneralInfo: BehaviorSubject<any>;

    @Output() onUpdateProfileStatus = new EventEmitter();

    // Flags
    public generalInfoLoader = false;
    public toDOBYear = moment().format('YYYY');
    public activeForm = false;
    public drivingLicenseFlag = false;

    // used by component HTML
    public toYear = moment().subtract(18.1, 'y').format('YYYY');
    public maxDate = moment().subtract(18.1, 'y')._d;

    public generalInfoLoader$: BehaviorSubject<any> = new BehaviorSubject(false);
    public yearsExpList;

    // Subscriptions
    public updateMyInformationSubcription: Subscription;
    public jobSeekerGeneralInfoSubcription: Subscription;
    public currently_monthly_salarySubcription: Subscription;
    public total_years_experienceSubcription: Subscription;
    public expected_monthly_salarySubcription: Subscription;
    public allCountriesSubcription: Subscription;
    private ngUnsubscribe: Subject<void> = new Subject<void>();

    // Forms
    generalInfo_form: FormGroup;

    // Members
    public languages: string;
    public languagesList;
    public jobSeekerGeneralInfo_val = new JobSeekerGeneralInfo();
    public experienceLevelList = [];
    public countryList = [];
    public educationList = [];
    public functionalAreaList = [];
    public sectorList = [];
    public jobTypeList = [];
    public profileCacheDirty = false;
    public monthList = [];

    public yearList = [];
    public genderList = [];
    public maritalList = [];
    public visaList = [];
    public noticePeriodMonthsList = [];

    public language_valid: boolean = false;
    public language_touched: boolean = false;

    public formPostedValid: boolean = false;
    public formPostedValid$: BehaviorSubject<any> = new BehaviorSubject(false);

    public tab_status = 'read';
    public jobseeker_id = -1;
    public screenwidth = 0;
    public currLan = 'en';
    public fixedTextHash = this.loaderService.getFixedText();
    public saudiArabiaObj = { id: 145, visa_id: 5, visa_name: 'Citizen' };
    public filteredVisaList = [];

    public showCitizen: boolean = (ConfigService.SHOW_CITIZEN_LOCALS === 'true');
    public isSaudi: boolean = false;
    public jobseekerType:string;
    public hideNoExpFields: boolean = false;

    constructor(public loaderService: LoaderService,
        public accountService: AccountService,
        public fb: FormBuilder,
        public _profileService: ProfileService) {
        this.yearsExpList = this.loaderService.getExpList();
        AccountService.cachedProfile$.subscribe((profile) => {
            if (profile) {
                this.jobseekerType = profile.jobseeker_type;
                if (profile.work_experience.length < 1) {
                    this.hideNoExpFields = true;
                }
            }
        });

    }
    public onRead() {
        this.tab_status = 'read';
        this.activeForm = false;
    }

    public onEdit() {
        this.tab_status = 'edit';
        this.activeForm = true;
        if (this.jobseekerType == 'coops' || this.jobseekerType == 'summer_training') {
            this.buildCoopsSummerForm();
            this.hideNoExpFields = false;
        } else {
            this.buildForm();
        }
    }

    public buildCoopsSummerForm() {
        this.jobSeekerGeneralInfoSubcription = this.jobSeekerGeneralInfo
            .subscribe((jobSeekerGeneralInfo) => {
                if (jobSeekerGeneralInfo) {

                    let languages = Array();
                    let language_ids = Array();


                    jobSeekerGeneralInfo.languages.forEach((selLan) => {

                        this.language_valid = true;
                        let lang1 = new Language(selLan.id, selLan.name);

                        languages.push(lang1);
                        language_ids.push(selLan.id);
                    });

                    this.languagesList = languages;
                    this.drivingLicenseFlag = (jobSeekerGeneralInfo.driving_license_country_id) ? true :
                        false;
                    this.generalInfoLoader = false;

                    jobSeekerGeneralInfo.gender = (jobSeekerGeneralInfo.gender === 'not_defined') ?
                        'null' : jobSeekerGeneralInfo.gender;

                    let group = {
                        jobseeker_id: jobSeekerGeneralInfo.jobseeker_id,
                        jobseeker_name: jobSeekerGeneralInfo.jobseeker_name,
                        // sector_id: [jobSeekerGeneralInfo.sector_id, Validators.required],
                        // functional_area_id: [jobSeekerGeneralInfo.functional_area_id,
                        // Validators.required],
                        highest_edu_name_id: [jobSeekerGeneralInfo.highest_edu_id,
                        Validators.required],
                        // experience_level_id: [jobSeekerGeneralInfo.experience_level_id,
                        // Validators.required],
                        // expected_monthly_salary: [jobSeekerGeneralInfo.expected_salary,
                        // [Validators.required, TypeValidators.numeric_no_decimal]],
                        // job_type_id: [jobSeekerGeneralInfo.job_type_id, Validators.required],
                        // currently_monthly_salary: [
                        //     jobSeekerGeneralInfo.current_salary,
                        //     [Validators.required, TypeValidators.numeric_no_decimal]
                        // ],
                        // total_years_experience: [
                        //     jobSeekerGeneralInfo.total_years_experience,
                        //     [Validators.required, Validators.max(50),
                        //     TypeValidators.numeric_no_decimal]
                        // ],
                        nationality_id: [jobSeekerGeneralInfo.nationality_id, Validators.required],
                        language_ids: [language_ids, Validators.required],
                        dob: [moment(Date.parse(jobSeekerGeneralInfo.dob_year + '/' +
                            jobSeekerGeneralInfo.dob_month + '/' + jobSeekerGeneralInfo.dob_day))
                            .format('D MMM, YYYY'), Validators.required],
                        gender: [jobSeekerGeneralInfo.gender, Validators.required],
                        marital_status: [jobSeekerGeneralInfo.marital_status, Validators.required],
                        visa_status: [jobSeekerGeneralInfo.visa_status['id'], Validators.required],
                        // notice_period_in_months: [jobSeekerGeneralInfo.notice_period_in_months,
                        // Validators.required],
                        driving_license_status_id: [jobSeekerGeneralInfo.driving_license,
                        Validators.required],
                        driving_license_country_id: [jobSeekerGeneralInfo.driving_license_country_id],
                        visa_code: [this.generalInfo.visa_code],
                        document_nationality_id: [this.generalInfo.document_nationality_id]
                    };


                    this.generalInfo_form = this.fb.group(group);
                    this.onChangeNationality(jobSeekerGeneralInfo.nationality_id);

                    // this.total_years_experienceSubcription =
                    //     this.generalInfo_form.controls['total_years_experience'].valueChanges
                    //         .subscribe((selvalue) => {

                    //             let returnVal = this.loaderService.onCleanString(selvalue);
                    //             if (returnVal !== false) {
                    //                 this.generalInfo_form.controls['total_years_experience']
                    //                     .setValue(returnVal);
                    //             }
                    //         });

                    // this.expected_monthly_salarySubcription =
                    //     this.generalInfo_form.controls['expected_monthly_salary']
                    //         .valueChanges.subscribe((selvalue) => {

                    //             let returnVal = this.loaderService.onCleanString(selvalue);
                    //             if (returnVal !== false) {
                    //                 this.generalInfo_form.controls['expected_monthly_salary']
                    //                     .setValue(returnVal);
                    //             }
                    //         });

                    // this.currently_monthly_salarySubcription =
                    //     this.generalInfo_form.controls['currently_monthly_salary'].valueChanges
                    //         .subscribe((selvalue) => {

                    //             let returnVal = this.loaderService.onCleanString(selvalue);
                    //             if (returnVal !== false) {
                    //                 this.generalInfo_form.controls['currently_monthly_salary']
                    //                     .setValue(returnVal);
                    //             }
                    //         });
                }
            });
    }

    public onChangeLan($event) {

        this.language_valid = false;
        let languageIdList = [];
        if ($event.languageList) {

            $event.languageList.forEach((selLan) => {
                this.language_valid = true;

                languageIdList.push(selLan.id);
            });
        }

        this.language_touched = true;
        this.generalInfo_form.controls['language_ids'].setValue(languageIdList);
    }

    public onPost() {
        if (!this.drivingLicenseFlag) {

            this.generalInfo_form.value.driving_license_country_id = null;
        }
        let postList = {
            sector_id: this.generalInfo_form.value.sector_id,
            job_education_id: this.generalInfo_form.value.highest_edu_name_id,
            years_of_experience: this.generalInfo_form.value.total_years_experience,
            current_salary: this.generalInfo_form.value.currently_monthly_salary,
            nationality_id: this.generalInfo_form.value.nationality_id,
            user_attributes: {
                id: AccountService.profileCache['id'],
                dob_day: moment(new Date(this.generalInfo_form.value.dob)).format('DD'),
                dob_month: moment(new Date(this.generalInfo_form.value.dob)).format('MM'),
                dob_year: moment(new Date(this.generalInfo_form.value.dob)).format('YYYY'),
                gender: this.generalInfo_form.value.gender
            },
            marital_status: this.generalInfo_form.value.marital_status,
            driving_license_country_id: this.generalInfo_form.value.driving_license_country_id,
            functional_area_id: this.generalInfo_form.value.functional_area_id,
            job_experience_level_id: this.generalInfo_form.value.experience_level_id,
            job_type_id: this.generalInfo_form.value.job_type_id,
            expected_salary: this.generalInfo_form.value.expected_monthly_salary,
            language_ids: this.generalInfo_form.value.language_ids,
            visa_status_id: this.generalInfo_form.value.visa_status,
            notice_period_in_month: this.generalInfo_form.value.notice_period_in_months
        };

        this.updateMyInformationSubcription = this._profileService
            .updateMyInformation(postList).subscribe(
                (res) => {

                    this.profileCacheDirty = true;
                    this.generalInfoLoader = false;
                    this.generalInfoLoader$.next(false);

                    this.loadGeneralInfo(res['jobseeker_profile']);
                    this.onRead();

                    this.onUpdateProfileStatus.emit({ update: true });

                },
                (error) => {
                    if (error.status == 401) {
                        this._profileService.getLogOutUser();
                    }

                }
            );

    }

    public loadGeneralInfo(profile) {
        this.generalInfo = profile['general_info'];

        this.jobSeekerGeneralInfo_val.jobseeker_id = profile['jobseeker_id'];
        if (profile['general_info']['sector']) {
            this.jobSeekerGeneralInfo_val.sector_id = profile['general_info']['sector']['id'];
            this.jobSeekerGeneralInfo_val.sector_name = profile['general_info']['sector']['name'];
        }
        if (profile['general_info']['functional_area']) {
            this.jobSeekerGeneralInfo_val.functional_area_id =
                profile['general_info']['functional_area']['id'];
            this.jobSeekerGeneralInfo_val.functional_area_name =
                profile['general_info']['functional_area']['name'];
        }
        if (profile['general_info']['highest_edu']) {
            this.jobSeekerGeneralInfo_val.highest_edu_id =
                profile['general_info']['highest_edu']['id'];
            this.jobSeekerGeneralInfo_val.highest_edu_name =
                profile['general_info']['highest_edu']['name'];
        }
        if (profile['general_info']['experince_level']) {
            this.jobSeekerGeneralInfo_val.experience_level_id =
                profile['general_info']['experince_level']['id'];
            this.jobSeekerGeneralInfo_val.experince_level_name =
                profile['general_info']['experince_level']['name'];
        }
        if (profile['general_info']['total_years_experience']) {
            this.jobSeekerGeneralInfo_val.total_years_experience =
                profile['general_info']['total_years_experience'];
        }
        if (profile['general_info']['job_type']) {
            this.jobSeekerGeneralInfo_val.job_type_id =
                profile['general_info']['job_type']['id'];
            this.jobSeekerGeneralInfo_val.job_type_name =
                profile['general_info']['job_type']['name'];
        }
        if (profile['general_info']['current_salary']) {
            this.jobSeekerGeneralInfo_val.current_salary =
                profile['general_info']['current_salary'];
        }
        if (profile['general_info']['nationality']) {
            this.jobSeekerGeneralInfo_val.nationality_id =
                profile['general_info']['nationality']['id'];
            this.jobSeekerGeneralInfo_val.nationality_name =
                profile['general_info']['nationality']['name'];
            this.onChangeNationality(profile['general_info']['nationality']['id']);
        }
        if (profile['country_id']) {
        }else if(profile.country || profile.country.id){
            this.generalInfo.country_id = profile.country.id;
        }


        let lan: Language[] = [];
        profile['general_info']['languages'].forEach(((language) => {
            lan.push(new Language(language.id, language.name));
        })
        );

        this.jobSeekerGeneralInfo_val.languages = lan;

        if (profile['general_info']['expected_salary']) {
            this.jobSeekerGeneralInfo_val.expected_salary = profile['general_info']['expected_salary'];
        }
        this.jobSeekerGeneralInfo_val.gender = profile['general_info']['gender'];

        this.jobSeekerGeneralInfo_val.marital_status = profile['general_info']['marital_status'];
        this.jobSeekerGeneralInfo_val.visa_status = profile['general_info']['visa_status'];
        this.jobSeekerGeneralInfo_val.driving_license = false;
        if (profile['general_info']['driving_license_issued_from']) {
            this.jobSeekerGeneralInfo_val.driving_license = true;
            this.jobSeekerGeneralInfo_val.driving_license_country_id =
                profile['general_info']['driving_license_issued_from']['id'];
        }
        if (profile['general_info']['notice_period_in_months']) {
            this.jobSeekerGeneralInfo_val.notice_period_in_months =
                profile['general_info']['notice_period_in_months'];
        }

        this.jobSeekerGeneralInfo_val.dob_day = profile['general_info']['dob']['day'];
        this.jobSeekerGeneralInfo_val.dob_month = profile['general_info']['dob']['month'];
        this.jobSeekerGeneralInfo_val.dob_year = profile['general_info']['dob']['year'];

        this.jobSeekerGeneralInfo_val.dob = new Date(profile['general_info']['dob']['year'] + '-' +
            profile['general_info']['dob']['month'] + '-' +
            profile['general_info']['dob']['day']);
        if (profile.visa_code) {
            this.generalInfo.visa_code = profile.visa_code;
            this.generalInfo.document_nationality_id = profile.document_nationality_id;
        }
        this.jobSeekerGeneralInfo.next(this.jobSeekerGeneralInfo_val);
    }

    public saveDetails() {
        this.formPostedValid = true;
        this.formPostedValid$.next(true);

        if (this.generalInfo_form.valid && this.language_valid) {
            this.generalInfoLoader = true;
            this.generalInfoLoader$.next(true);
            this.onPost();
        } else {
            console.error('Invalid general Info');
        }
    }

    public buildForm() {
        this.jobSeekerGeneralInfoSubcription = this.jobSeekerGeneralInfo
            .subscribe((jobSeekerGeneralInfo) => {
                if (jobSeekerGeneralInfo) {

                    let languages = Array();
                    let language_ids = Array();


                    jobSeekerGeneralInfo.languages.forEach((selLan) => {

                        this.language_valid = true;
                        let lang1 = new Language(selLan.id, selLan.name);

                        languages.push(lang1);
                        language_ids.push(selLan.id);
                    });

                    this.languagesList = languages;
                    this.drivingLicenseFlag = (jobSeekerGeneralInfo.driving_license_country_id) ? true :
                        false;
                    this.generalInfoLoader = false;

                    jobSeekerGeneralInfo.gender = (jobSeekerGeneralInfo.gender === 'not_defined') ?
                        'null' : jobSeekerGeneralInfo.gender;

                    let group = {
                        jobseeker_id: jobSeekerGeneralInfo.jobseeker_id,
                        jobseeker_name: jobSeekerGeneralInfo.jobseeker_name,
                        sector_id: [jobSeekerGeneralInfo.sector_id, Validators.required],
                        functional_area_id: [jobSeekerGeneralInfo.functional_area_id,
                        Validators.required],
                        highest_edu_name_id: [jobSeekerGeneralInfo.highest_edu_id,
                        Validators.required],
                        experience_level_id: [jobSeekerGeneralInfo.experience_level_id,
                        Validators.required],
                        expected_monthly_salary: [jobSeekerGeneralInfo.expected_salary,
                        [Validators.required, TypeValidators.numeric_no_decimal]],
                        job_type_id: [jobSeekerGeneralInfo.job_type_id, Validators.required],
                        currently_monthly_salary: [
                            jobSeekerGeneralInfo.current_salary,
                            [Validators.required, TypeValidators.numeric_no_decimal]
                        ],
                        total_years_experience: [
                            jobSeekerGeneralInfo.total_years_experience,
                            [Validators.required, Validators.max(50),
                            TypeValidators.numeric_no_decimal]
                        ],
                        nationality_id: [jobSeekerGeneralInfo.nationality_id, Validators.required],
                        language_ids: [language_ids, Validators.required],
                        dob: [moment(Date.parse(jobSeekerGeneralInfo.dob_year + '/' +
                            jobSeekerGeneralInfo.dob_month + '/' + jobSeekerGeneralInfo.dob_day))
                            .format('D MMM, YYYY'), Validators.required],
                        gender: [jobSeekerGeneralInfo.gender, Validators.required],
                        marital_status: [jobSeekerGeneralInfo.marital_status, Validators.required],
                        visa_status: [jobSeekerGeneralInfo.visa_status['id'], Validators.required],
                        notice_period_in_months: [jobSeekerGeneralInfo.notice_period_in_months,
                        Validators.required],
                        driving_license_status_id: [jobSeekerGeneralInfo.driving_license,
                        Validators.required],
                        driving_license_country_id: [jobSeekerGeneralInfo.driving_license_country_id]

                    };


                    this.generalInfo_form = this.fb.group(group);

                    this.onChangeNationality(jobSeekerGeneralInfo.nationality_id);

                    this.total_years_experienceSubcription =
                        this.generalInfo_form.controls['total_years_experience'].valueChanges
                            .subscribe((selvalue) => {

                                let returnVal = this.loaderService.onCleanString(selvalue);
                                if (returnVal !== false) {
                                    this.generalInfo_form.controls['total_years_experience']
                                        .setValue(returnVal);
                                }
                            });

                    this.expected_monthly_salarySubcription =
                        this.generalInfo_form.controls['expected_monthly_salary']
                            .valueChanges.subscribe((selvalue) => {

                                let returnVal = this.loaderService.onCleanString(selvalue);
                                if (returnVal !== false) {
                                    this.generalInfo_form.controls['expected_monthly_salary']
                                        .setValue(returnVal);
                                }
                            });

                    this.currently_monthly_salarySubcription =
                        this.generalInfo_form.controls['currently_monthly_salary'].valueChanges
                            .subscribe((selvalue) => {

                                let returnVal = this.loaderService.onCleanString(selvalue);
                                if (returnVal !== false) {
                                    this.generalInfo_form.controls['currently_monthly_salary']
                                        .setValue(returnVal);
                                }
                            });
                }
            });
    }

    public setDOB($event) {
        this.generalInfo_form.controls['dob'].setValue($event.selDate);
    }

    public ngOnDestroy() {

        if (this.updateMyInformationSubcription) {
            this.updateMyInformationSubcription.unsubscribe();
        }

        if (this.jobSeekerGeneralInfoSubcription) {
            this.jobSeekerGeneralInfoSubcription.unsubscribe();
        }

        if (this.currently_monthly_salarySubcription) {
            this.currently_monthly_salarySubcription.unsubscribe();
        }

        if (this.total_years_experienceSubcription) {
            this.total_years_experienceSubcription.unsubscribe();
        }

        if (this.expected_monthly_salarySubcription) {
            this.expected_monthly_salarySubcription.unsubscribe();
        }

        if (this.allCountriesSubcription) {
            this.allCountriesSubcription.unsubscribe();
        }

        if (this.profileCacheDirty) {
            AccountService.profileCacheDirty = true;
        }

        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();

    }

    public ngOnInit() {
        window.scroll(0, 0);
        this.screenwidth = window.innerWidth;
        this.generalInfoLoader = false;
        AccountService.s3Loaded$.subscribe((resFlag) => {
            if (resFlag) {
                this.sectorList = this.loaderService.getSectors('alpha');
                this.allCountriesSubcription = this.loaderService.getAllCountries('alphabetical')
                    .subscribe(
                        (countries) => {
                            this.countryList = countries;
                        }
                    );
                this.functionalAreaList = this.loaderService.getFunctionalArea();
                this.educationList = this.loaderService.getJobEducations();
                this.experienceLevelList = this.loaderService.getJobExperienceLevels();
                this.monthList = this.loaderService.getMonths();
                this.yearList = this.loaderService.getYears();

                this.genderList = this.loaderService.getJobseekerGender();
                this.maritalList = this.loaderService.getMaritalStatus();

                let visa_statuses = this.loaderService.getVisaStatus();
                this.visaList = visa_statuses;
                this.filteredVisaList = this.visaList;

                this.noticePeriodMonthsList = this.loaderService.getNoticePeriod();

                this.jobTypeList = this.loaderService.getJobTypes();
            }
        });

        this.currLan = this.accountService.getCurrLang();
    }

    public clickSelectDrivingLicense() {
        this.drivingLicenseFlag = true;
    }

    public clickUnSelectDrivingLicense() {
        this.drivingLicenseFlag = false;
    }

    public onChangeNationality(countryId) {
        if (countryId != undefined && countryId != null) {
            this.isSaudi = this.getIsSaudi();
        }
    }

    public getIsSaudi() {
        if (this.showCitizen) {
            if (this.generalInfo_form.controls['nationality_id'].value === this.saudiArabiaObj.id) {
                this.filteredVisaList = this.visaList;
                this.generalInfo_form.value.visa_status = this.saudiArabiaObj.visa_id
                return true;
            }
            else {
                this.filteredVisaList = [];
                this.visaList.forEach((res) => {
                    if (res.id != this.saudiArabiaObj.visa_id) {
                        this.filteredVisaList.push({ "id": res.id, "name": res.name });
                    }
                    else {
                        if (this.generalInfo_form.value.visa_status == this.saudiArabiaObj.visa_id) {
                            this.generalInfo_form.controls['visa_status'].setValue(null);
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
