import { AfterViewChecked, Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router, ActivatedRoute } from '@angular/router';

// Services
import { AccountService } from '../../../core/account/services/account.service';
import { CompanyService } from '../../../core/services/company.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { ConfigService } from '../../../shared/config.service';

// Models
import { City } from '../../../shared/models/City';

// Validations
import { TypeValidators } from '../../../shared/validators/basicValidators';
import { DateValidator } from '../../../shared/validators/basicValidators';
import { ExpLessThanValidator } from '../../../shared/validators/basicValidators';

// Import TinyMCE
let tinymce = require('tinymce/tinymce');

// A theme is also required
require('tinymce/themes/modern/theme');

// Any plugins you want to use has to be imported
require('tinymce/plugins/paste/plugin');
require('tinymce/plugins/link/plugin');
require('tinymce/plugins/autoresize/plugin');
require('tinymce/plugins/lists/plugin');

declare var jQuery: any;
let moment = require('moment');

@Component({
    selector: 'add-edit-jobs',
    templateUrl: 'addEditJob.component.html',
    styleUrls: ['./addEditJob.scss']
})

export class AddEditJobComponent implements OnInit, AfterViewChecked, OnDestroy {

    public paramsRoute;

    public jobForm: FormGroup;
    public loadedData: boolean = false;
    public allowReset: boolean = false;
    public pristineFlag$: BehaviorSubject<any> = new BehaviorSubject(true);

    // Observables
    public salary_range$: BehaviorSubject<any> = new BehaviorSubject(null);
    public jobTypeList$: BehaviorSubject<any> = new BehaviorSubject(null);
    public jobExpList$: BehaviorSubject<any> = new BehaviorSubject(null);
    public functionalAreaList$: BehaviorSubject<any> = new BehaviorSubject(null);
    public expLevelList$: BehaviorSubject<any> = new BehaviorSubject(null);
    public benefits$: BehaviorSubject<any> = new BehaviorSubject(null);
    public ageGroup$: BehaviorSubject<any> = new BehaviorSubject(null);
    public visaStatusList$: BehaviorSubject<any> = new BehaviorSubject(null);
    public maritalStatusList$: BehaviorSubject<any> = new BehaviorSubject(null);
    public genderList$: BehaviorSubject<any> = new BehaviorSubject(null);
    public educationList$: BehaviorSubject<any> = new BehaviorSubject(null);
    public sectors$: BehaviorSubject<any> = new BehaviorSubject(null);
    public companyBranch$;
    public jobId$: BehaviorSubject<any> = new BehaviorSubject(null);
    public job$: BehaviorSubject<any> = new BehaviorSubject(null);
    public joburl$: BehaviorSubject<any> = new BehaviorSubject(null);

    public yearsExpList;
    public excludeToYears = [];
    public cityObj: City = new City();

    public branchObj = {};
    public countryList;
    public geoGroupList;
    public educationList;
    public sectorsList;

    public drivingLicenseRequired: boolean = false;
    public joinImidiateFlag: boolean = true;
    public savedDraft: boolean = false;
    public country_id: number = null;

    public certarry = [];
    public companyBranches = [];
    public skillsarry = [];
    public languagearry = [];
    public genderHash = { male: 1, female: 2, any: null };
    public iframeBlock = '';
    public startDate = null;
    public toYear = moment().format('YYYY');
    public maxDate = moment()._d;

    public postProgress: boolean = false;
    public currLan = 'en';
    public fixedTextHash = this.loaderService.getFixedText();
    public jobDetailsUrl;
    public showCompanyBranches = ConfigService.SHOW_COMPANY_BRANCHES;
    public showInternalHiring = (ConfigService.SHOW_INTERNAL_HIRING === 'true');
    public showNonDiscloseSalary = (ConfigService.SHOW_NON_DISCLOSE_SALARY === 'true');
    public editor;
    public editor2;

    constructor(public accountService: AccountService, public _fb: FormBuilder,
        public _companyService: CompanyService,
        public loaderService: LoaderService,
        public _activeRoute: ActivatedRoute,
        private cdRef:ChangeDetectorRef,
        public _router: Router) {

        this.yearsExpList = this.loaderService.getExpList();

        this.accountService.setSwitchFlag(false);
    }

    public onBack() {
        this._router.navigate([this.accountService.getCurrLangUrl() + 'employer/jobs']);
    }

    public onBackJobDetails() {
        this._router.navigate([this.jobDetailsUrl]);
    }


    public ngAfterViewChecked() {
        this.cdRef.detectChanges();
        let that = this;
        tinymce.init({
            selector: '#edit-jobdesc-area',
            skin_url: '/assets/skins/lightgray',
            plugins: ['lists', 'paste'],
            // plugins: "paste",
            paste_as_text: true,
            force_br_newlines: false,
            force_p_newlines: false,
            content_style: 'body {color:#7ba1b2 !important;helvetica,sans-serif !important;font-size:14px;} p {margin: 0px; padding: 0px; -webkit-margin-before: 0em;  -webkit-margin-after: 0em;  -webkit-margin-start: 0px; -webkit-margin-end: 0px;}',
            font_formats: 'helvetica,sans-serif !important;',
            toolbar: 'undo redo | bold italic  | bullist numlist |',
            menubar: false,
            statusbar: false,
            setup: (editor) => {
                this.editor = editor;
                editor.on('Change', () => {
                    that.jobForm.controls['description'].setValue(editor.getContent());
                });
            },
        });

        tinymce.init({
            selector: '#edit-jobrequirements-area',
            skin_url: '/assets/skins/lightgray',
            // plugins: "paste",
            plugins: ['lists', 'paste'],
            paste_as_text: true,
            force_br_newlines: false,
            force_p_newlines: false,
            content_style: 'body {color:#7ba1b2 !important;helvetica,sans-serif !important;font-size:14px;} p {margin: 0px; padding: 0px; -webkit-margin-before: 0em;  -webkit-margin-after: 0em;  -webkit-margin-start: 0px; -webkit-margin-end: 0px;}',
            font_formats: 'helvetica,sans-serif !important;',
            toolbar: 'undo redo | bold italic  | bullist numlist |',
            menubar: false,
            statusbar: false,
            setup: (editor) => {
                this.editor2 = editor;
                editor.on('Change', () => {
                    that.jobForm.controls['requirements'].setValue(editor.getContent());
                });
            },
        });

    }

    public ngOnDestroy() {
        tinymce.remove(this.editor);
        tinymce.remove(this.editor2);
        if (this.companyBranch$) {
            this.companyBranch$.unsubscribe();
        }
    }

    public getStartDate($event) {
        if (this.allowReset) {
            this.jobForm.controls['start_date'].setValue($event['selDate']);
            this.jobForm.controls['end_date'].setValue(null);
            this.jobForm.controls['join_date'].setValue(null);
            this.startDate = moment(new Date($event['selDate'])).add(1, 'days')._d;
        }

    }

    public numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    public loader() {
        let reset = true;
        AccountService.s3Loaded$.subscribe((resFlag) => {
            if (resFlag) {
                let country = this.loaderService.getCountries('alphabetical', reset);
                let geoGroups;
                this.countryList = country.slice();
                geoGroups = country.slice();
                geoGroups.unshift({ id: '-1', name: this.fixedTextHash['all'][this.currLan] });
                this.countryList = { countries: this.countryList };
                this.geoGroupList = { geo_countries: geoGroups };

                let education = this.loaderService.getJobEducations();
                this.educationList = education;
                // this.educationList.push({id:'',name:"Highest Education Achievement"});
                this.educationList$.next({ education: this.educationList });

                let salary_range = this.loaderService.getSalaryRanges();

                let salaryRange = (this.showNonDiscloseSalary) ?
                    [{ id: -1, name: this.fixedTextHash['not_disclosed'][this.currLan] }] : [];

                salary_range.forEach((selRange) => {

                    if (selRange['salary_to'] > 100000) {
                        salaryRange.push({id: selRange['id'], name: '10k+'});

                    } else {
                        salaryRange.push({
                            id: selRange['id'],
                            name: this.numberWithCommas(selRange['salary_from']) + '-' +
                                this.numberWithCommas(selRange['salary_to'])
                        });
                    }
                });
                this.salary_range$.next({ salary_range: salaryRange });

                this.jobTypeList$.next({ job_types: this.loaderService.getJobTypes() });
                this.jobExpList$.next([
                    { id: 1, name: '1 ' + this.fixedTextHash['year'][this.currLan] },
                    { id: 2, name: '2 ' + this.fixedTextHash['years'][this.currLan] },
                    { id: 3, name: '3 ' + this.fixedTextHash['years'][this.currLan] },
                    { id: 4, name: '4 ' + this.fixedTextHash['years'][this.currLan] },
                    { id: 5, name: '5 ' + this.fixedTextHash['years'][this.currLan] },
                    { id: 6, name: '6 ' + this.fixedTextHash['years'][this.currLan] },
                    { id: 7, name: '7 ' + this.fixedTextHash['years'][this.currLan] },
                    { id: 8, name: '8 ' + this.fixedTextHash['years'][this.currLan] },
                    { id: 9, name: '9 ' + this.fixedTextHash['years'][this.currLan] },
                    { id: 10, name: '10 ' + this.fixedTextHash['years'][this.currLan] }]);

                this.sectorsList = this.loaderService.getSectors('alpha');
                this.sectors$.next(this.sectorsList);

                this.functionalAreaList$.next(this.loaderService.getFunctionalArea());
                this.expLevelList$.next(this.loaderService.getJobExperienceLevels());
                this.benefits$.next(this.loaderService.getBenefits());

                let visa_statuses = this.loaderService.getVisaStatus();
                // To Do  Change this to 0 . Since now visa status 0 is giving error
                if (visa_statuses[0]['name'] !== 'Any') {
                    visa_statuses.unshift({ id: 0, name: this.fixedTextHash['any'][this.currLan] });
                }
                this.visaStatusList$.next(visa_statuses);

                let res = this.loaderService.getAgeGroups();
                let ageGroupList = [];
                res.forEach((selAge) => {

                    if (selAge['max_age'] < 100) {
                        ageGroupList.push({
                            id: selAge['id'],
                            name: selAge['min_age'] + ' ' + this.fixedTextHash['to'][this.currLan]
                                + ' ' + selAge['max_age']
                        });
                    } else {
                        ageGroupList.push({ id: selAge['id'], name: selAge['min_age'] + '+' });
                    }
                });
                ageGroupList.unshift({ id: 0, name: this.fixedTextHash['any'][this.currLan] });
                this.ageGroup$.next(ageGroupList);

                this.maritalStatusList$.next(this.loaderService.getMaritalStatus2());
                this.genderList$.next(this.loaderService.getGender());

            }
        });
        this._companyService.getCompanyBranches().subscribe((res) => {
            this.companyBranches = res;
        });
    }

    public setJoinDate($event) {

        this.jobForm.controls['join_date'].setValue($event['selDate']);
        if ($event['selDate'] != null) {
            this.jobForm.controls['join_immediately'].setValue(false);
        } else {
            this.jobForm.controls['join_immediately'].setValue(true);
        }
    }

    public onRemoveElement(index: number, mode = 'cert') {

        if (mode === 'cert' && index > -1) {
            this.certarry.splice(index, 1);
        }
        if (mode === 'skills' && index > -1) {
            this.skillsarry.splice(index, 1);
        }
        if (mode === 'language' && index > -1) {
            this.languagearry.splice(index, 1);
        }
    }

    public onAddElement($event, mode = 'cert') {

        if (mode === 'cert') {
            this.certarry.push({ id: $event.id, name: $event.name });
        }
        if (mode === 'skills') {
            this.skillsarry.push({ id: $event.id, name: $event.name });
        }

        if (mode === 'language') {
            this.languagearry.push({ id: $event.id, name: $event.name });
        }
    }

    public getSetBenefit(id) {
        let benefitList = this.jobForm.controls['benefit_ids'].value;
        let foundlocation = benefitList.indexOf(id);
        if (foundlocation === -1) {
            benefitList.push(id);
        } else {

            benefitList.splice(foundlocation, 1);
        }

        this.jobForm.controls['benefit_ids'].setValue(benefitList);
    }

    public getPostJson() {
        if (this.jobForm.controls['join_immediately'].value === true) {
            this.jobForm.controls['join_date'].setValue(null);
        }

        let langList = [];

        this.languagearry.forEach((selLang) => {
            langList.push(selLang['id']);
        });

        if (this.jobForm.value['geo_countries_ids'].indexOf('-1') !== -1) {

            let selectedCountries = [];
            this.geoGroupList['geo_countries'].forEach((selCountry) => {
                if (selCountry.id !== -1) {
                    selectedCountries.push(selCountry.id);
                }
            });

            this.jobForm.controls['geo_countries_ids'].setValue(selectedCountries);
        }

        let visa_status_id = (this.jobForm.value['visa_status_id'] === 0) ? null :
            this.jobForm.value['visa_status_id'];
        let age_group_id = (this.jobForm.value['age_group_id'] === 0) ? null :
            this.jobForm.value['age_group_id'];
        let negitiveKey = this.jobForm.value['geo_countries_ids'].indexOf('-1');

        if (negitiveKey > -1) {
            this.jobForm.value['geo_countries_ids'].splice(negitiveKey, 1);
        }

        let postJson = {
            job: {
                title: this.jobForm.value['title'],
                description: this.jobForm.value['description'],
                qualifications: '',
                active: true,
                deleted: false,
                requirements: this.jobForm.value['requirements'],
                job_status_id: this.jobForm.value['job_status'],
                job_type_id: this.jobForm.value['job_type_id'],
                start_date: this.jobForm.value['start_date'],
                end_date: this.jobForm.value['end_date'],
                country_id: this.jobForm.value['country_id'],
                city_id: this.jobForm.value['city_id'],
                sector_id: this.jobForm.value['sector_id'],
                functional_area_id: this.jobForm.value['functional_area_id'],
                job_education_id: this.jobForm.value['job_education_id'],
                job_experience_level_id: this.jobForm.value['job_experience_level_id'],
                experience_from: this.jobForm.value['experience_from'],
                experience_to: this.jobForm.value['experience_to'],
                join_date: this.jobForm.value['join_date'],
                nationality_id: '',
                age_group_id,
                gender: this.genderHash[this.jobForm.value['gender_type']],
                visa_status_id,
                language_ids: langList,
                notification_type: this.jobForm.value['notification_type'],
                license_required: this.jobForm.value['license_required'],
                marital_status: this.jobForm.value['marital_status_id'],
                benefit_ids: this.jobForm.value['benefit_ids'],
                geo_country_ids: this.jobForm.value['geo_countries_ids'],
                salary_range_id: this.setManupilateSalaryId(this.jobForm.value['salary_range_id']),
                certificates: this.certarry,
                skills: this.skillsarry
            }
        };

        if (this.getShowBranches()) {
            postJson['job']['branch_id'] = parseInt(this.jobForm.value['branch_id'], 10);
        }
        if (this.showInternalHiring) {
            postJson['job']['is_internal_hiring'] = this.jobForm.value['is_internal_hiring'];
        }

        return postJson;

    }

    public setManupilateSalaryId(selId) {
        return (selId === -1) ? null : selId;
    }

    public getManupilateSalaryId(selId) {
        return (!selId) ? -1 : selId;
    }

    public getIfExpired() {

        if (this.jobForm.controls['job_status'].value !== 1 &&
            !moment(Date.parse(this.jobForm.controls['end_date'].value)).isAfter(new Date())) {
            return true;
        } else {
            return false;
        }
    }

    public saveDraft() {

        this.jobForm.controls['job_status'].setValue(1);

        let postJson = this.getPostJson();

        if (this.jobForm.controls['id'].value == null) {

            if (this.postProgress === false) {

                this.postProgress = true;
                this._companyService.getAddJobs(postJson).subscribe((res) => {
                    this.postProgress = false;

                    this.jobForm.controls['id'].setValue(res['job']['id']);
                    this.jobId$.next(res['job']['id']);
                    this.job$.next(res['job']);
                    if (res['job'].city && res['job'].country) {
                        this.joburl$.next(ConfigService.getDomain() +
                            this.accountService.getSpaceToDashLowerCase(res['job'].country.name)
                            + '/jobs/' + this.accountService
                                .getSpaceToDashLowerCase(res['job'].city.name) + '/' +
                            this.accountService.getSpaceToDashLowerCase(res['job'].sector.name)
                            + '/' + this.accountService
                                .getSpaceToDashLowerCase(res['job'].title) + '-' +
                            res['job']['id']);
                    }
                    this.savedDraft = true;
                    jQuery('#post-draft').modal('show');
                    Observable.timer(2000).subscribe((val) => {
                        this.savedDraft = false;
                        jQuery('#post-draft').modal('hide');
                    });

                },
                    (error) => {
                        this.postProgress = false;
                        this.accountService.getErrorCheck(error);
                    });
            }
        } else {

            if (this.postProgress === false) {
                this.postProgress = true;
                this._companyService.getUpdateJobs(this.jobForm.controls['id'].value, postJson)
                    .subscribe((res) => {
                        this.postProgress = false;
                        this.jobId$.next(res['job']['id']);
                        this.job$.next(res['job']);
                        if (res['job'].city && res['job'].country) {
                            this.joburl$.next(ConfigService.getDomain() +
                                this.accountService
                                    .getSpaceToDashLowerCase(res['job'].country.name)
                                + '/jobs/' + this.accountService
                                    .getSpaceToDashLowerCase(res['job'].city.name) + '/' +
                                this.accountService
                                    .getSpaceToDashLowerCase(res['job'].sector.name)
                                + '/' + this.accountService
                                    .getSpaceToDashLowerCase(res['job'].title) + '-'
                                + res['job']['id']);
                        }

                        this.jobForm.controls['id'].setValue(res['job']['id']);
                        this.savedDraft = true;
                        jQuery('#post-draft').modal('show');
                        Observable.timer(2000).subscribe((val) => {
                            this.savedDraft = false;
                            jQuery('#post-draft').modal('hide');
                            this._router.navigate([this.accountService.getCurrLangUrl()
                                + this.accountService.getPath() + '/jobs']);
                        });

                    },
                        (error) => {
                            this.postProgress = false;
                            this.accountService.getErrorCheck(error);
                        });
            }
        }

    }

    public updateJob() {

        this.pristineFlag$.next(false);
        if (this.jobForm.valid && this.languagearry.length > 0) {

            this.jobForm.controls['job_status'].setValue(2);
            let postJson = this.getPostJson();

            if (this.jobForm.controls['id'].value == null) {

                if (this.postProgress === false) {

                    this.postProgress = true;
                    this._companyService.getAddJobs(postJson).subscribe((res) => {
                        this.setPageSeo(res);
                        this.getUpdateDetails(res);

                    },
                        (error) => {
                            this.postProgress = false;
                            this.accountService.getErrorCheck(error);
                        });
                }

            } else {

                if (this.postProgress === false) {
                    this.postProgress = true;
                    this._companyService
                        .getUpdateJobs(this.jobForm.controls['id'].value, postJson)
                        .subscribe((res) => {
                            this.setPageSeo(res);
                            this.getUpdateDetails(res);
                            this.iframeBlock =
                                '<iframe src="' + res['job']['id'] + '"><iframe>';
                        },
                            (error) => {
                                this.postProgress = false;
                                this.accountService.getErrorCheck(error);
                            });
                }
            }
        }
    }

    public setPageSeo(res) {
        this.accountService.setPageDynamicSeo([res['job']['title'] +
            ' Vacancy in ' + res['job']['city']['name'] + ', ' +
            res['job']['country']['name'] + ' with ' +
            res['job']['company']['name']], true,
            'New vacancy for ' + res['job']['title'] +
            ' added on ' + res['job']['created_at'] + ' based in ' +
            res['job']['city']['name'] + ', '
            + res['job']['country']['name'] + ' with ' +
            res['job']['company']['name'] + ' - Apply today!');
    }

    public getUpdateDetails(res) {
        this.postProgress = false;
        this.jobId$.next(res['job']['id']);
        this.job$.next(res['job']);
        this.joburl$.next(ConfigService.getDomain() +
            this.accountService.getSpaceToDashLowerCase(res['job'].country.name)
            + '/jobs/' + this.accountService
                .getSpaceToDashLowerCase(res['job'].city.name)
            + '/' + this.accountService
                .getSpaceToDashLowerCase(res['job'].sector.name)
            + '/' + this.accountService
                .getSpaceToDashLowerCase(res['job'].title) + '-' +
            res['job']['id']);

        this.jobDetailsUrl = '/employer/jobs/' +
            this.accountService.getSpaceToDashLowerCase(res['job'].title) + '-' + res['job']['id'];
        this.jobForm.controls['id'].setValue(res['job']['id']);
        jQuery('#post-published').modal('show');
    }

    public clean(obj) {
        for (let propName in obj) {
            if (obj[propName] === null || obj[propName] === undefined) {

                if (propName !== 'join_date') {
                    obj[propName] = {};
                }
            }
        }
        return obj;
    }

    public cleanData(res) {

        if (res['job']['experience_from'] == null) {
            res['job']['experience_from'] = '';
        }

        if (res['job']['experience_to'] == null) {
            res['job']['experience_to'] = '';
        }

        if (typeof (res['job']['gender_type']) === 'object') {

            res['job']['gender_type'] = 'any';
        }

        if (typeof (res['job']['marital_status']) === 'object') {

            res['job']['marital_status'] = null;
        }

        return res;
    }

    // Validate Required branch
    public getShowBranches() {
        return (this.showCompanyBranches === 'true');
    }

    public ngOnInit() {
        this.accountService.setCustomSeo();
        this.currLan = this.accountService.getCurrLang();

        this.paramsRoute = this._activeRoute.params.subscribe((params) => {
            window.scroll(0, 0);

            if (params['id']) {
                let jobId = +params['id'];
                this._companyService.getCompanyJob(jobId).subscribe((res) => {

                    res['job'] = this.clean(res['job']);

                    this.cityObj.id = res['job']['city']['id'];
                    this.cityObj.name = res['job']['city']['name'];
                    this.cityObj.text = res['job']['city']['name'];
                    this.cityObj.country_id = res['job']['country']['id'];

                    this.joinImidiateFlag = (res['job']['join_date'] == null) ? true : false;
                    this.drivingLicenseRequired = (res['job']['license_required'] == null) ?
                        false : res['job']['license_required'];

                    let benefit_ids = [];

                    if (res['job']['benefits'] !== 'undefined' && res['job']['benefits'] != null) {
                        res['job']['benefits'].forEach((selBenefit) => {

                            benefit_ids.push(selBenefit['id']);
                        });
                    }

                    let geo_countries_ids = [];

                    if (res['job']['geo_countries'] !== 'undefined' && res['job']['geo_countries']
                        != null) {
                        res['job']['geo_countries'].forEach((selGeo) => {

                            geo_countries_ids.push(selGeo['id']);
                        });
                    }

                    if (res['job']['languages'] !== 'undefined' && res['job']['languages'] != null) {
                        res['job']['languages'].forEach((selLang) => {

                            this.languagearry.push({ id: selLang['id'], name: selLang['name'] });
                        });
                    }

                    if (res['job']['skills'] !== 'undefined' && res['job']['skills'] != null) {
                        res['job']['skills'].forEach((selSkill) => {

                            this.skillsarry.push({ id: selSkill['id'], name: selSkill['name'] });
                        });
                    }

                    if (res['job']['certificates'] !== 'undefined' &&
                        res['job']['certificates'] != null) {
                        res['job']['certificates'].forEach((certSkill) => {

                            this.certarry.push({ id: certSkill['id'], name: certSkill['name'] });
                        });
                    }

                    let start_date = moment(res['job']['start_date']).format('D MMM, YYYY');
                    let end_date = moment(res['job']['end_date']).format('D MMM, YYYY');

                    let visa_status_id = (!res['job']['visa_status'] ||
                        !res['job']['visa_status']['id']) ? 0 : res['job']['visa_status']['id'];
                    let age_group_id = (!res['job']['age_group'] || !res['job']['age_group']['id'])
                        ? 0 : res['job']['age_group']['id'];

                    res = this.cleanData(res);
                    this.branchObj = (this.getShowBranches()) ? res['job']['branch'] : {};
                    this.country_id = res['job']['country']['id'];
                    let jobFormJson = {
                        id: [res['job']['id']],
                        job_status: [res['job']['job_status']['id'].toString(),
                        Validators.required],
                        branch_id: [res['job']['branch']['id'],
                        (this.getShowBranches()) ? Validators.required : []],
                        notification_type: [res['job']['notification_type'].toString(),
                        Validators.required],
                        country_id: [res['job']['country']['id'], Validators.required],
                        city_id: [res['job']['city']['id'], Validators.required],
                        job_education_id: [res['job']['job_education']['id'], Validators.required],
                        salary_range_id:
                            [this.getManupilateSalaryId(res['job']['salary_range']['id']),
                            Validators.required],
                        job_type_id: [res['job']['job_type']['id'], Validators.required],
                        sector_id: [res['job']['sector']['id'], Validators.required],
                        functional_area_id: [res['job']['functional_area']['id'],
                        Validators.required],
                        description: [res['job']['description'], Validators.required],
                        benefit_ids: [benefit_ids],
                        geo_countries_ids: [geo_countries_ids, TypeValidators.array],
                        age_group_id: [age_group_id, Validators.required],
                        requirements: [res['job']['requirements'], Validators.required],
                        visa_status_id: [visa_status_id, Validators.required],
                        gender_type: [res['job']['gender_type'], Validators.required],
                        license_required: [this.drivingLicenseRequired.toString(),
                        Validators.required],
                        marital_status_id: [res['job']['marital_status'], Validators.required],
                        join_date: [res['job']['join_date']],
                        join_immediately: [this.joinImidiateFlag],
                        job_experience_level_id: [res['job']['job_experience_level']['id'],
                        Validators.required],
                        start_date: [start_date, [Validators.required, DateValidator.validDate,
                        DateValidator.validDateGrtEqlToday]],
                        end_date: [end_date, [Validators.required, DateValidator.validDate,
                        DateValidator.validDateRange]],
                        experience_from: [res['job']['experience_from'], [Validators.required,
                        TypeValidators.numeric_no_decimal]],
                        experience_to: [res['job']['experience_to'], [Validators.required,
                        TypeValidators.numeric_no_decimal, ExpLessThanValidator.explessThan]],
                        title: [res['job']['title'], Validators.required]
                    };

                    // Add Internal Hiring
                    if (this.showInternalHiring) {
                        jobFormJson['is_internal_hiring'] =
                            [res['job']['is_internal_hiring'], Validators.required];
                    }
                    this.jobForm = this._fb.group(jobFormJson);
                    
                    if (this.getShowBranches()) {
                        this.getBranchListener();
                    }

                    this.loadedData = true;
                });

            } else {

                if (!this.accountService.getCreateJob()) {
                    this._router.navigate([this.accountService.getCurrLangUrl()
                        + this.accountService.getPath() + '/jobs']);
                }

                this.cityObj.id = null;
                this.cityObj.name = '';
                this.cityObj.text = '';
                this.cityObj.country_id = null;

                this.joinImidiateFlag = true;
                this.drivingLicenseRequired = false;

                let benefit_ids = [];

                let geo_countries_ids = [];

                this.country_id = null;
                let jobFormJson = {
                    id: [null],
                    job_status: ['2', Validators.required],
                    branch_id: [null, (this.getShowBranches()) ? Validators.required : []],
                    notification_type: ['1', Validators.required],
                    country_id: ['', Validators.required],
                    city_id: ['', Validators.required],
                    job_education_id: ['', Validators.required],
                    salary_range_id: [1, Validators.required],
                    job_type_id: ['', Validators.required],
                    sector_id: ['', Validators.required],
                    functional_area_id: ['', Validators.required],
                    description: ['', Validators.required],
                    benefit_ids: [benefit_ids],
                    geo_countries_ids: [geo_countries_ids, Validators.required],
                    age_group_id: [null, Validators.required],
                    requirements: ['', Validators.required],
                    visa_status_id: [null, Validators.required],
                    gender_type: ['', Validators.required],
                    license_required: [this.drivingLicenseRequired.toString(), Validators.required],
                    marital_status_id: ['', Validators.required],
                    join_date: [''],
                    join_immediately: [this.joinImidiateFlag],
                    job_experience_level_id: ['', Validators.required],
                    start_date: ['', [Validators.required, DateValidator.validDate,
                    DateValidator.validDateGrtEqlToday]],
                    end_date: ['', [Validators.required, DateValidator.validDate]],
                    experience_from: [-1, [Validators.required, TypeValidators.numeric_no_decimal]],
                    experience_to: [-1, [Validators.required, TypeValidators.numeric_no_decimal,
                    ExpLessThanValidator.explessThan]],
                    title: ['', Validators.required]
                };
                // Add Internal Hiring
                if (this.showInternalHiring) {
                    jobFormJson['is_internal_hiring'] = [false, Validators.required];
                }
                this.jobForm = this._fb.group(jobFormJson);

                if (this.getShowBranches()) {
                    this.getBranchListener();
                }
                this.loadedData = true;
            }

            this.loader();
        });
    }

    public getBranchListener() {
        this.companyBranch$ =
            this.jobForm.controls['branch_id'].valueChanges.subscribe((selId) => {
                this.branchObj = this.companyBranches
                    .filter((selB) => selB.id == selId)[0];

            });
    }
    public updateExp(id) {

        this.excludeToYears = [];
        this.jobForm.controls['experience_to'].setValue(null);
        this.yearsExpList.forEach((selVal) => {
            if (selVal.id <= id) {
                this.excludeToYears.push({ id: selVal.id });
            }
        });
    }

}
