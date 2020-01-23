import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router, ActivatedRoute } from '@angular/router';

// services
import { AccountService } from '../../../core/account/services/account.service';
import { CompanyService } from '../../../core/services/company.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { AlgoliaService } from '../../../shared/services/algolia.service';

// Models
import { City } from '../../../shared/models/City';

@Component({
    selector: 'search-candidates-employer',
    templateUrl: 'searchCandidates.component.html',
    styleUrls: ['./searchCandidates.scss']
})

export class SearchCandidatesComponent implements OnInit, OnDestroy {

    public loadedData: boolean = false;
    public countryList = [];
    public nationalityList = [];
    public functionalAreaList$: BehaviorSubject<any> = new BehaviorSubject(null);
    public sectors$: BehaviorSubject<any> = new BehaviorSubject(null);
    public expLevelList$: BehaviorSubject<any> = new BehaviorSubject(null);
    public maritalStatusList$: BehaviorSubject<any> = new BehaviorSubject(null);
    public expRange$: BehaviorSubject<any> = new BehaviorSubject(null);
    public educationList$: BehaviorSubject<any> = new BehaviorSubject(null);
    public salary_range$: BehaviorSubject<any> = new BehaviorSubject(null);
    public salary_range_expected$: BehaviorSubject<any> = new BehaviorSubject(null);
    public ageGroup$: BehaviorSubject<any> = new BehaviorSubject(null);
    public languagesList$: BehaviorSubject<any> = new BehaviorSubject(null);
    public genderList$: BehaviorSubject<any> = new BehaviorSubject(null);
    public lastActiveList$: BehaviorSubject<any> = new BehaviorSubject(null);
    public noticePeriodList$: BehaviorSubject<any> = new BehaviorSubject(null);
    public visaStatusList$: BehaviorSubject<any> = new BehaviorSubject(null);
    public jobTypeList$: BehaviorSubject<any> = new BehaviorSubject(null);
    public company_name$: BehaviorSubject<any> = new BehaviorSubject([]);
    public education$: BehaviorSubject<any> = new BehaviorSubject([]);
    public candidateForm: FormGroup;
    public candidateNameForm: FormGroup;
    public someThingSelected = false;
    public title$: BehaviorSubject<any> = new BehaviorSubject([]);

    // Model
    public cityObj: City = new City();
    public activeRouteObs;
    public firstcome = false;
    public formList = {};
    public prevList = {graduation_university: null, company_name: null};
    public resetNowComp = false;
    public resetNowEdu = false;
    public currLan = 'en';
    public fixedTextHash = this.loaderService.getFixedText();

    constructor(public accountService: AccountService, public _fb: FormBuilder,
                public _companyService: CompanyService,
                public loaderService: LoaderService,
                public algoliaService: AlgoliaService,
                public _activeRoute: ActivatedRoute,
                public _router: Router) {

        this.cityObj.id = null;
        this.cityObj.name = '';
        this.cityObj.text = '';
        this.cityObj.country_id = null;

        this._buildForm();

        this.candidateNameForm = this._fb.group({
            search_string: ['']
        });

        this.candidateNameForm.controls['search_string'].valueChanges.subscribe((res) => {

            this.validateData();

        });

        this.candidateForm.valueChanges.subscribe((res) => {
            this.validateData();
        });

        this.accountService.setSwitchFlag(false);

    }

    public ngOnInit() {
        this.accountService.setCustomSeo();
        this.currLan = this.accountService.getCurrLang();
        this.loader();
    }

    public setSelCompany(event) {
        this.candidateForm.controls['company_name'].setValue(event.name);
    }

    public setSelEducation(event) {
        this.candidateForm.controls['graduation_university'].setValue(event.name);
    }

    public setSelTitle(event) {
        this.candidateForm.controls['job_title'].setValue(event.name);
    }

    public validateData() {

        this.someThingSelected = false;
        for (let myvar in this.candidateForm.value) {
            if (this.formList.hasOwnProperty(myvar)) {
                if (this.candidateForm.value[myvar]) {
                    this.someThingSelected = true;
                }
            }
        }

        if (this.candidateNameForm.controls['search_string'].value) {
            this.someThingSelected = true;
        }

    }

    public _buildForm() {

        this.formList = {
            locations: [''],
            cities: [''],
            marital_status: [''],
            job_title: [''],
            graduation_university: [''],
            company_name: [''],
            fareas: [''],
            sectors: [''],
            explevels: [''],
            exprange: [''],
            edulevels: [''],
            current_sal: [''],
            expect_sal: [''],
            nationality: [''],
            age_group: [''],
            language: [''],
            gender: [''],
            notice_period: [''],
            last_active: [''],
            visa_status: [''],
            jobtypes: [''],
        };

        this.candidateForm = this._fb.group(this.formList);

        let that = this;

        this.candidateForm.controls['graduation_university'].valueChanges.debounceTime(100)
            .subscribe((val) => {
            this.resetNowEdu = false;

            if (this.prevList['graduation_university'] !==
                this.candidateForm.controls['graduation_university'].value) {

                this.prevList['graduation_university'] =
                    this.candidateForm.controls['graduation_university'].value;
                this.algoliaService
                    .getUniversityList(this.candidateForm.controls['graduation_university'].value)
                    .then(function (res) {

                    let eduList = [];
                    res.facetHits.forEach((val) => {
                        eduList.push({id: val.value, name: val.value});
                    });

                    that.education$.next(eduList);

                });
            }
        });

        this.candidateForm.controls['company_name'].valueChanges.debounceTime(100)
            .subscribe((val) => {

            this.resetNowComp = false;
            if (this.prevList['company_name'] !== this.candidateForm.controls['company_name'].value)
            {
                this.prevList['company_name'] = this.candidateForm.controls['company_name'].value;
                this.algoliaService
                    .getCompanyList(this.candidateForm.controls['company_name'].value)
                    .then(function (res) {

                    let compList = [];
                    res.facetHits.forEach((val) => {
                        compList.push({id: val.value, name: val.value});
                    });

                    that.company_name$.next(compList);
                });
            }
        });

        this.candidateForm.controls['job_title'].valueChanges.debounceTime(100)
            .subscribe((val) => {

            if (this.prevList['job_title'] !== this.candidateForm.controls['job_title'].value) {
                this.prevList['job_title'] = this.candidateForm.controls['job_title'].value;
                this.algoliaService.getTitleList(this.candidateForm.controls['job_title'].value)
                    .then(function (res) {
                    let titleList = [];

                    res.facetHits.forEach((val) => {
                        titleList.push({id: val.value, name: val.value});
                    });

                    that.title$.next(titleList);
                });
            }
        });
    }

    public onReset() {

        this.candidateForm.reset();
        this.candidateNameForm.reset();
        this.resetNowComp = true;
        this.resetNowEdu = true;
    }

    public searchCandidate() {

        if (this.candidateForm.valid && this.candidateNameForm.valid) {
            let params = {};

            for (let key in this.candidateForm.value) {
                if (this.candidateForm.value.hasOwnProperty(key)) {
                    if (this.candidateForm.value[key] !== '' &&
                        this.candidateForm.value[key] != null) {
                        params[key] = this.candidateForm.value[key];
                    }
                }
            }
            for (let key in this.candidateNameForm.value) {
                if (this.candidateNameForm.value.hasOwnProperty(key)) {
                    if (this.candidateNameForm.value[key] !== '' &&
                        this.candidateNameForm.value[key] != null &&
                        this.candidateNameForm.value['search_string'] !== '') {
                        params[key] = this.candidateNameForm.value[key];
                    }
                }
            }

            if (!this.accountService.getAuth()) {
                this._router.navigate([this.accountService.getCurrLangUrl()]);
            } else {
                if (this.someThingSelected) {
                    this._router.navigate([this.accountService.getCurrLangUrl() +
                    this.accountService.getPath() + '/candidate/list'],
                        {queryParams: params});
                }
            }

        }
    }

    public ngOnDestroy() {
        this.activeRouteObs.unsubscribe();
    }

    public numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    public loader() {
        this.firstcome = true;

        this.activeRouteObs = this._activeRoute.queryParams.subscribe((params) => {

            window.scroll(0, 0);
            for (let key in this.candidateForm.value) {
                if (params.hasOwnProperty(key)) {
                    this.candidateForm.controls[key].setValue(params[key]);
                }
            }
        });

        let reset = true;

        AccountService.s3Loaded$.subscribe((resFlag) => {
            if (resFlag) {
                this.sectors$.next(this.loaderService.getSectors('alpha'));
                this.countryList = this.loaderService.getCountries('alphabetical', reset);
                this.nationalityList = this.loaderService.getCountries('alphabetical', reset);
                this.functionalAreaList$.next(this.loaderService.getFunctionalArea());
                this.expLevelList$.next(this.loaderService.getJobExperienceLevels());
                this.maritalStatusList$.next(this.loaderService.getMaritalStatus());

                let exprg = this.loaderService.getExpRange();
                let expRangeList = [];

                exprg.forEach((res) => {

                    if (res['experience_to'] !== 100) {
                        expRangeList.push({
                            id: res['id'],
                            name: ' ' + res['experience_from'] + '-' + res['experience_to'] + ' '
                                + this.fixedTextHash['year'][this.currLan]
                        });
                    } else {
                        expRangeList.push({
                            id: res['id'],
                            name: ' ' + res['experience_from'] + '+ ' +
                                this.fixedTextHash['year'][this.currLan]
                        });
                    }
                });

                this.expRange$.next(expRangeList);

                this.educationList$.next({education: this.loaderService.getJobEducations()});

                let salary_range = this.loaderService.getSalaryRanges();

                let salaryRange = [];
                let expectedSalaryRange = [];

                salary_range.forEach((selRange) => {

                    if (selRange['salary_to'] > 100000) {

                        salaryRange.push({id: selRange['id'], name: '10k+'});
                        expectedSalaryRange.push({id: selRange['id'], name: '10k+'});

                    } else {
                        salaryRange.push({
                            id: selRange['id'],
                            name: this.numberWithCommas(selRange['salary_from']) + '-' +
                                this.numberWithCommas(selRange['salary_to'])
                        });
                        expectedSalaryRange.push({
                            id: selRange['id'],
                            name: this.numberWithCommas(selRange['salary_from']) + '-' +
                                this.numberWithCommas(selRange['salary_to'])
                        });
                    }

                });
                this.salary_range$.next({salary_range: salaryRange});
                this.salary_range_expected$.next({salary_range: expectedSalaryRange});

                // need expected salary

                let res = this.loaderService.getAgeGroups();

                let ageGroupList = [];
                res.forEach((selAge) => {

                    if (selAge['max_age'] > 60) {
                        ageGroupList.push({id: selAge['id'], name: selAge['min_age'] + '+'});
                    } else {
                        ageGroupList.push({
                            id: selAge['id'],
                            name: selAge['min_age'] + '-' + selAge['max_age']
                        });
                    }
                });

                this.ageGroup$.next(ageGroupList);

                this.languagesList$.next({languages: this.loaderService.getLanguages()});

                let resGender =
                    [{id: '1', name: this.fixedTextHash['male'][this.currLan], code: 'male'},
                        {id: '2', name: this.fixedTextHash['female'][this.currLan],
                            code: 'female'}];

                this.genderList$.next(resGender);
                this.lastActiveList$.next(this.loaderService.getLastActive());

                let noticePeriod = [];
                this.loaderService.getNoticePeriod().forEach((res) => {
                    noticePeriod.push({name: res.name, id: res.id});
                });
                this.noticePeriodList$.next(noticePeriod);

                // //need last active
                let visa_statuses = this.loaderService.getVisaStatus();
                this.visaStatusList$.next(visa_statuses);

                this.jobTypeList$.next({job_types: this.loaderService.getJobTypes()});
                this.loadedData = true;
            }
        });

    }
}
