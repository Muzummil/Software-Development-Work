import { Injectable, Inject } from '@angular/core';
import { LoaderService } from './loader.service';
import { ConfigService } from '../config.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AccountService } from '../../core/account/services/account.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

let moment = require('moment');
let algoliasearch = require('algoliasearch');
let algoliasearchHelper = require('algoliasearch-helper');

@Injectable()
export class AlgoliaService {

    public static sectorText;
    public static cityText;
    public static countryText;
    public client = algoliasearch(ConfigService.getAlgoliaAppId(), ConfigService.getAlgoliaSearchKey());
    public currentPage = 1;

    public loadEvent: BehaviorSubject<any> = new BehaviorSubject(null);
    public loadComplete$: BehaviorSubject<any> = new BehaviorSubject(false);
    public lastActiveHash = {
        '1 week': {format: 'd', value: 7},
        '1 month': {format: 'months', value: 1},
        '3 months': {format: 'months', value: 3},
        '6 months': {format: 'months', value: 6}
    };
    public ageGroupsList = [];
    public helper = algoliasearchHelper(this.client, 'jobseekers', {
        hitsPerPage: 10,
        typoTolerance: false
    });
    public helperComp = algoliasearchHelper(this.client, 'jobseekers', {
        facets: ['work_experience.company.name'],
        hitsPerPage: 10
    });
    public helperEdu = algoliasearchHelper(this.client, 'jobseekers', {
        facets: ['education.school'],
        hitsPerPage: 10
    });
    public helpertitle = algoliasearchHelper(this.client, 'jobseekers', {
        facets: ['current_experience.position'],
        hitsPerPage: 10
    });

    public parms_numericHash = {
        locations: 'country.id',
        cities: 'city.id',
        userId: 'id',
        job_title: 'current_experience.position',
        age_group: 'general_info.dob_timestamp',
        nationality: 'nationality.id',
        jobtypes: 'general_info.job_type.id',
        visa_status: 'general_info.visa_status.id',
        language: 'general_info.languages.id',
        expect_sal: 'general_info.expected_salary',
        fareas: 'functional_area.id',
        sectors: 'general_info.sector.id',
        edulevels: 'general_info.highest_edu.id',
        gender: 'user.gender',
        marital_status: 'general_info.marital_status',
        notice_period: 'general_info.notice_period_in_months',
        last_active: 'general_info.last_active_timestamp',
        graduation_university: 'education.school',
        current_company: 'current_experience.company_name',
        company_name: 'work_experience.company.name',
        exprange: 'general_info.total_years_experience',
        current_sal: 'general_info.current_salary'
    };

    public gender_Hash = {male: 1, female: 2};

    public loaderService;
    public accountService;
    public expRange = [];
    public loadDataComplete = false;
    public salaryRanges = [];
    public numericFilterList = [];
    public facetFiltersList = [];

    constructor(private _http: HttpClient, @Inject(LoaderService) loaderService,
                @Inject(AccountService) accountService) {
        this.loaderService = loaderService;
        this.accountService = accountService;

        if (this.accountService.isArabic()) {
            this.loadArabicJson();
        }
    }

    public getBuildNumericFilterList(facetKey, facetVal) {

        let searchList = [];
        facetVal.forEach((val) => {
            searchList.push(facetKey + ' = ' + val);
        });

        return searchList;
    }

    public setAddEqulFacets(facetKey, facetVal) {

        if (facetKey == 'gender') {
            facetVal = this.gender_Hash[facetKey];
        }

        this.numericFilterList.push(this.getBuildNumericFilterList(facetKey, facetVal));
    }

    public setFacets(facetVal) {
        this.numericFilterList.push(facetVal);
    }

    public removeFacets() {

        this.numericFilterList = [];
        this.facetFiltersList = [];
        this.helper.setQueryParameter('numericFilters', []);
        this.helper.setQueryParameter('facetFilters', []);
        this.helper.setQuery();
    }

    public getBuildList(from, to, list = []) {

        for (let i = from; i <= to; i++) {
            list.push(i);
        }
        return list;
    }

    public getSeachList(list = [], id = '', key = 'id') {

        let selectedVal = {};
        list.forEach((val) => {

            if (val[key] == id) {

                selectedVal = val;
            }
        });
        return selectedVal;
    }

    public getUniversityList(searchString = '') {
        return this.helperEdu.searchForFacetValues(this.parms_numericHash['graduation_university'],
            searchString, 50);
    }

    public getCompanyList(searchString = '') {
        return this.helperComp.searchForFacetValues(this.parms_numericHash['company_name'],
            searchString, 50);
    }

    public getTitleList(searchString = '') {
        return this.helpertitle.searchForFacetValues(this.parms_numericHash['job_title'],
            searchString, 50);
    }

    public setbuildSearch(postQuery, currentPage = 1) {

        this.currentPage = currentPage;

        this.removeFacets();

        this.loadComplete$.subscribe((val) => {
            // Waiting for expRange to finish
            if (val === false) {
                this.getLoadData();
            } else {
                this.getBuildQuery(postQuery);
            }
        });
    }

    public getSectorName(name) {
        if (this.accountService.getCurrLang() === 'en') {
            return name;
        } else {
            return (AlgoliaService.sectorText) ? AlgoliaService.sectorText[name] : name;
        }
    }

    public getCityName(name) {
        if (this.accountService.getCurrLang() === 'en') {
            return name;
        } else {
            return (AlgoliaService.cityText) ? AlgoliaService.cityText[name] : name;
        }
    }

    public getCountryName(name) {
        if (this.accountService.getCurrLang() === 'en') {
            return name;
        } else {
            return (AlgoliaService.countryText) ? AlgoliaService.countryText[name] : name;

        }
    }

    public getLoadData() {
        this.expRange = this.loaderService.getExpRange();

        // Waiting for age Group to finish
        let ageGroup = this.loaderService.getAgeGroups();
        this.ageGroupsList = ageGroup;
        // Waiting for Salary range to finish
        let salaryRange = this.loaderService.getSalaryRanges();
        this.salaryRanges = salaryRange;

        if (this.expRange.length > 0 && this.ageGroupsList.length > 0
            && this.salaryRanges.length > 0
            && this.loadDataComplete === false) {
            this.loadDataComplete = true;
            this.loadComplete$.next(true);
        }
    }

    public getBuildQuery(postQuery) {

        for (let key in postQuery) {
            if (postQuery.hasOwnProperty(key)) {

                if (this.parms_numericHash[key]) {

                    // Total Experience
                    if (key === 'exprange') {
                        let expList = [];
                        postQuery[key].forEach((val) => {

                            if (this.expRange && this.expRange.length > 0) {
                                let selList = this.getSeachList(this.expRange, val);
                                expList = this.getBuildList(selList['experience_from'],
                                    selList['experience_to'], expList);
                            }

                        });
                        this.setAddEqulFacets(this.parms_numericHash[key], expList);

                    } else if (key === 'current_sal') {
                        let currentSalList = [];
                        postQuery[key].forEach((val) => {
                            this.salaryRanges.forEach((range) => {
                                if (range['id'] == val) {
                                    currentSalList.push(this.parms_numericHash[key] + ':' +
                                        range['salary_from'] + ' to ' + range['salary_to']);
                                }
                            });
                        });

                        this.setFacets(currentSalList);

                    } else if (key === 'expect_sal') {
                        let expectedSalList = [];
                        postQuery[key].forEach((val) => {
                            this.salaryRanges.forEach((range) => {
                                if (range['id'] == val) {
                                    expectedSalList.push(this.parms_numericHash[key] + ':' +
                                        range['salary_from'] + ' to ' + range['salary_to']);
                                }
                            });
                        });

                        this.setFacets(expectedSalList);

                    } else if (key === 'marital_status') {
                        this.facetFiltersList.push(this.parms_numericHash[key] + ':' +
                            postQuery[key]);
                    } else if (key === 'company_name') {this.facetFiltersList
                        .push(this.parms_numericHash[key] + ':' + postQuery[key]);
                    } else if (key === 'job_title') {
                        this.facetFiltersList.push(this.parms_numericHash[key] + ':' +
                            postQuery[key]);
                    } else if (key === 'graduation_university') {
                        this.facetFiltersList.push(this.parms_numericHash[key] + ':' +
                            postQuery[key]);
                    } else if (key === 'age_group') {
                        let ageGroupList = [];
                        postQuery[key].forEach((val) => {
                            this.ageGroupsList.forEach((selAG) => {
                                if (selAG['id'] == val) {

                                    let minAgeTS = moment().subtract(selAG['min_age'],
                                        'years').unix();
                                    let maxAgeTS = moment().subtract(selAG['max_age'],
                                        'years').unix();

                                    ageGroupList.push(this.parms_numericHash[key] + ':'
                                        + minAgeTS + ' to ' + maxAgeTS);
                                }
                            });
                        });

                        this.setFacets(ageGroupList);

                    } else if (key === 'last_active') {
                        let lastactiveList = [];

                        postQuery[key].forEach((val) => {
                            if (this.lastActiveHash[val]) {
                                let xx = moment().subtract(this.lastActiveHash[val]['value'],
                                    this.lastActiveHash[val]['format']);

                                lastactiveList.push(this.parms_numericHash[key] + ':' +
                                    moment().subtract(this.lastActiveHash[val]['value'],
                                        this.lastActiveHash[val]['format']).unix() + ' to ' +
                                    moment().unix());
                            }
                        });
                        this.setFacets(lastactiveList);

                    } else {
                        this.setAddEqulFacets(this.parms_numericHash[key], postQuery[key]);
                    }
                }

                if (key === 'search_string') {

                    this.helper.setQuery(postQuery[key]);

                    this.facetFiltersList.push(['notification.visible_by_employer:true',
                        'current_experience.company_id:-' + this.accountService.getCompanyId()]);
                }
            }
        }

        this.getSearchResult();
    }

    public getUserId(uId) {
        this.removeFacets();
        let searchList = [this.parms_numericHash['userId'] + ' = ' + uId];
        this.numericFilterList.push(searchList);
    }

    public getSearchResult() {

        if (this.numericFilterList.length > 0) {
            this.helper.setQueryParameter('numericFilters', this.numericFilterList);
        }

        if (this.facetFiltersList.length > 0) {
            this.helper.setQueryParameter('facetFilters', this.facetFiltersList);
        }

        this.helper.setPage(this.currentPage - 1).search();
    }

    public getHelper() {
        return this.helper;
    }

    public loadArabicJson() {
        this.setS3Json();
    }

    // JSON DATA FROM AWS S3
    public setS3Json() {

        if (!AlgoliaService.cityText || !AlgoliaService.countryText || !AlgoliaService.sectorText) {
            let url1 = this._http.get(ConfigService.CITY_ALGOLIA_TRANSLATION_URL, {
                headers: {'Content-Type': 'application/json'}
            }).map((res) => {
                AlgoliaService.cityText = res;
                return res;
            });
            let url2 = this._http.get(ConfigService.COUNTRY_ALGOLIA_TRANSLATION_URL, {
                headers: {'Content-Type': 'application/json'}
            }).map((res) => {
                AlgoliaService.countryText = res;
                return res;
            });
            let url3 = this._http.get(ConfigService.SECTOR_ALGOLIA_TRANSLATION_URL, {
                headers: {'Content-Type': 'application/json'}
            }).map((res) => {
                AlgoliaService.sectorText = res;
                return res;
            });

            Observable.forkJoin([url1, url2, url3])
                .subscribe((res) => {
                });
        }

    }

}
