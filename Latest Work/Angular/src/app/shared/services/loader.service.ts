import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../shared/config.service';
import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';

// Models
import { Country } from '../models/Country';
import { City } from '../models/City';
import { Sector } from '../models/Sector';
import { FunctionalArea } from '../models/FunctionalArea';
import { JobType } from '../models/JobType';
import { Company } from '../models/Company';
import { Education } from '../models/Education';
import { SalaryRange } from '../models/SalaryRange';
import { Experience } from '../models/Experience';

// Services
import { AccountService } from '../../core/account/services/account.service';

import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';

const FixedText = require('../../../data/translate_ar.json');
const CustomFixedText = require('../../../data/custom_translate_ar.json');

@Injectable()
export class LoaderService {

    // Initialization
    public static loaderDone$: BehaviorSubject<any> = new BehaviorSubject(false);

    public static countryAllAlphaCache = Array();
    public static sectorAlphaCache = Array();
    public static functionalAreaCache = Array();
    public minCount = 5;
    public maxCount = 10;
    public _paramsHash = {
        general: 'id_in',
        location: 'country_id_in',
        city: 'ci_in',
        search: 'name_cont'
    };
    public authService;
    public location_key = 'locations';
    public nationality_key = 'nationality';
    public city_key = 'cities';
    public job_key = 'jobtypes';
    public visa_key = 'visa_status';
    public age_group = 'age_group';
    public jobexp_key = 'explevels';
    public salary_range_key = 'salarylevels';
    public education_key = 'edulevels';
    public language_key = 'language';
    public sector_key = 'sectors';
    public func_area_key = 'fareas';
    public company_key = 'companies';
    public constants = {};

    public _country_url = 'countries';
    public _city_url = 'cities';

    public _company_url = 'companies';
    public _certificates_url = 'certificates';
    public _skills_url = 'skills';
    public _tags_url = 'tags';
    public _job_educations_url = 'job_educations.json';

    public countryList: Country[] = new Array();
    public cityList: City[] = new Array();
    public sectorList: Sector[] = new Array();
    public visaStatusList: Sector[] = new Array();
    public functionalAreaList: FunctionalArea[] = new Array();
    public university_url = 'universities';

    // Default array
    public countryCache = null;
    public CompanyCache = null;

    public visaStatusCache = null;
    public countryCacheURL = null;
    public CompanyCacheURL = null;
    public currLan = 'en';

    constructor(public _http: HttpClient, @Inject(AccountService) authService: AccountService) {
        this.authService = authService;

        AccountService.s3Loaded$.subscribe((resFlag) => {
            if (resFlag) {
                // Adding Featured companies
                this.constants = JSON.parse(localStorage.getItem('static_json'));
                // Adding Companies by followers
                this.constants['companies_by_followers'] = JSON.parse(localStorage
                    .getItem('company_by_followers_json')).companies;

                // Set Load complete
                LoaderService.loaderDone$.next(true);
            }
        });

    }

    public getS3JobsBySectors(order = 'alpha') {
        if (order === 'alpha') {
            return (localStorage.getItem('sectors_alpha_json')) ?
                JSON.parse(localStorage.getItem('sectors_alpha_json')) : {};
        } else {
            return (localStorage.getItem('sectors_jobs_json')) ?
                JSON.parse(localStorage.getItem('sectors_jobs_json')) : {};
        }
    }

    public getS3JobsByCountries(order = 'alpha') {
        if (order === 'alpha') {
            return (localStorage.getItem('countries_alpha_json')) ?
                JSON.parse(localStorage.getItem('countries_alpha_json')) : {};
        } else {
            return (localStorage.getItem('countries_jobs_json')) ?
                JSON.parse(localStorage.getItem('countries_jobs_json')) : {};
        }
    }

    public getS3JobsByCities(order = 'alpha') {

        if (order === 'alpha') {
            return (localStorage.getItem('cities_alpha_json')) ?
                JSON.parse(localStorage.getItem('cities_alpha_json')) : {};
        } else {
            return (localStorage.getItem('cities_jobs_json')) ?
                JSON.parse(localStorage.getItem('cities_jobs_json')) : {};
        }
    }

    public getSearchJson(jsonList = {}, searchString = '') {

        let newJson = [];
        for (let key in jsonList) {
            if (jsonList.hasOwnProperty(key)) {

                if (jsonList[key] && jsonList[key]['name'].toLowerCase()
                    .indexOf((searchString.toLowerCase())) != -1) {
                    newJson.push(jsonList[key]);
                }

            }
        }
        return newJson;
    }

    // Method is dyanamically called
    public getFunctionalAreaSearch(searchString: string = '', order = ''): Observable<any[]> {
        return Observable.of(this.constants['functional_areas'])
            .map((res) => res['functional_areas']);
    }

    // Method is dyanamically called
    public getLanguageSearch(query: string = null, order = ''): Observable<any[]> {
        return Observable.of(this.getSearchJson(this.constants['languages'],
            query));
    }

    // Method is dyanamically called
    public getSkillSearch(searchString: string = '', order = '') {
        return this._http.get(ConfigService.getAPI() + this._skills_url + '?q[name_cont]=' +
            searchString)
            .map((res) => res['skills']);
    }

    // Method is dyanamically called
    public getTagSearch(searchString: string, order = '') {
        return this._http.get(ConfigService.getAPI() + this._tags_url + '?q[name_cont]=' +
            searchString)
            .map((res) => res['tags']);

    }

    // Method is dyanamically called
    public getCertificateSearch(searchString: string = '', order = '') {
        return this._http.get(ConfigService.getAPI() + this._certificates_url + '?q[name_cont]='
            + searchString)
            .map((res) => res['certificates']);
    }

    // Method is dyanamically called
    public getSectorSearch(searchString: string = '', order = '') {
        return this.getSearchJson(this.getS3JobsBySectors()['sectors'], searchString);
    }

    // Method is dyanamically called
    public getCountrySearch(searchString: string = null, order = ''): Observable<any[]> {
        return Observable.of(this.getSearchJson(this.getS3JobsByCountries()['countries'],
            searchString));
    }

    // Method is dyanamically called
    public getJobEducationSearch(searchString: string, order = ''): Observable<any[]> {
        let url = ConfigService.getAPI() + this._job_educations_url + '?q[level_cont]='
            + searchString;
        return this._http.get(url)
            .map((res) => res['job_educations']);
    }

    // Method is dyanamically called
    public getCompanySearch(searchString: string= '', order = '')  {
        return this._http.get(ConfigService.getAPI() + this._company_url + '?q[name_cont]='
            + searchString)
            .map((res) => res['companies']);
    }

    public onCleanString(selvalue) {

        let patt = new RegExp(/[^0-9\-]/g);
        if (selvalue != null) {
            if (patt.test(selvalue.toString())) {

                selvalue = selvalue.toString().replace(/[^0-9\-]/g, '');
                return selvalue;
            }
        }
        return false;

    }

    public getLimiter(res, limit: any) {
        if (!isNaN(limit) && res) {
            return res.slice(0, limit);
        } else {
            return (res && res.length > this.maxCount) ? res.slice(0, this.minCount) : res;
        }
    }

    public _getBuildParamsUrl(params, key: string = null, mode = 2) {

        let url = '';
        if (key != null && params != null && params[key]) {

            let firstOne = true;
            if (!Array.isArray(params[key])) {

                let Ids = params[key].toString().split(',');
                if (Ids.length > 0) {
                    Ids.forEach((id) => {
                        url += (firstOne === true && mode === 1) ? '?q[' +
                            this._paramsHash.general + '][]=' + id : '&q[' +
                            this._paramsHash.general + '][]=' + id;
                        firstOne = false;
                    });
                }
            } else if (Array.isArray(params[key])) {
                if (params[key].length > 0) {
                    params[key].forEach((id) => {
                        url += (firstOne === true && mode === 1) ? '?q[' +
                            this._paramsHash.general + '][]=' + id : '&q[' +
                            this._paramsHash.general + '][]=' + id;
                        firstOne = false;
                    });
                }
            }

        }
        return url;
    }

    public getLoadDefaults(): any[][] {
        let defaultsArry = Array();
        return defaultsArry;
    }

    public getEducationLevels() {
        return this.constants['job_educations'];
    }

    public getExperienceLevels() {
        return this.constants['job_experience_levels'];
    }

    public getCompanySizes() {
        let new_company_sizes = [];
        this.constants['company_sizes']
            .forEach((res) => new_company_sizes.push({
            id: res.id,
            name: res.size
        }));
        return new_company_sizes;

    }

    public getCompanyTypes() {
        return this.constants['company_types'];
    }

    public getCompanyTypesClassifications() {
        return this.constants['company_classifications'];
    }

    public _getBuildFunctionalArea(fuctionalAreas) {

        this.functionalAreaList = Array();

        fuctionalAreas.forEach((selFuctionalArea) => {
            let faNew = new FunctionalArea();
            faNew.id = selFuctionalArea.id;
            faNew.name = selFuctionalArea.name;
            this.functionalAreaList.push(faNew);
        });

        LoaderService.functionalAreaCache = this.functionalAreaList;
        return this.functionalAreaList;
    }

    public getFunctionalArea() {

        let functionalAreaList = Array();
        AccountService.s3Loaded$.subscribe((resFlag) => {
            if (resFlag) {
                functionalAreaList =  this._getBuildFunctionalArea(
                    this.constants['functional_areas']);
            }
        });

        return functionalAreaList;
    }

    public _sortSectors(sectors) {
        if (!LoaderService.sectorAlphaCache || LoaderService.sectorAlphaCache.length == 0) {
            LoaderService.sectorAlphaCache = sectors.slice(0);

            LoaderService.sectorAlphaCache.sort(function (a, b) {
                return (a.name < b.name) ? -1 : 1;
            });
        }

        return LoaderService.sectorAlphaCache;
    }

    public _getBuildVisaStatus(visa_statuses) {

        this.visaStatusList = Array();
        visa_statuses.forEach((selVisa) => {
            this.visaStatusList.push(selVisa);
        });

        this.visaStatusCache = this.visaStatusList;
        return this.visaStatusList;
    }

    public _getBuildCountries(countries) {
        this.countryList = Array();
        let cnt = 0;
        countries.forEach((selCountry) => {

            let countryNew = new Country();
            countryNew.id = selCountry.id;
            countryNew.name = selCountry.name;
            countryNew.jobs_count = selCountry.jobs_count;
            this.countryList.push(countryNew);
            cnt++;

        });
        return this.countryList;
    }

    public getCountriesNonZero() {
      return this.getS3JobsByCountries()['countries'].filter((selVal) => selVal.jobs_count > 0);
    }

    public getRegHrEvent(name, company, position, department, email, mobile_phone) {

        let url = ConfigService.getAPI() + 'event_visitors';
        let post_data = {
            event_visitor: {
                name,
                company,
                position,
                department,
                email,
                mobile_phone }};
        return this._http.post(url, post_data)
            .map((res) => res);
    }

    public getDemo(company_name: string, location_id: string,
                   contact_person: string, phone_number: string, email: string, reason: string) {

        let post_data = {
            demo: {
                company_name,
                country: location_id,
                contact_person,
                phone_number,
                email,
                reason
            }
        };
        let url = ConfigService.getAPI() + 'demo_requests/create_ats';
        return this._http.post(url, post_data)
            .map((res) => res);
    }

    public getCountries(order_by = 'jobs', reset = false) {
        return this._getBuildCountries(this.getS3JobsByCountries()['countries']);
    }

    public getGeneralCountries(limit: any = 1000, params = null, order = 'jobs', all = false,
                               forceReset = false): Observable<any[]> {
        if (forceReset === true) {
            this.countryCacheURL = null;
            this.countryCache = null;
        }

        let ctype = 2; // 1 All , 2 subset , 3 search
        // This is a special case . If specific ids are given do not put order by filters
        if (params != null && params['locations']) {
            ctype = 3;
        }
        return this.getStaticCountryByJobs(ctype, order, limit, params[this.location_key]);

    }

    public getStaticCountryByJobs(stype, order = '', limit, keyList) {

        if (stype === 3) {
                return Observable.of(this.getIdSeachJson(
                    this.getS3JobsByCountries()['countries'], keyList))
                    .map((res) => this.getLimiter(res, limit));
            } else {
                if (order === 'jobs') {
                    return Observable.of(this.getS3JobsByCountries('jobs')['countries'])
                        .map((res) => this.getLimiter(res, limit));
                } else {
                    return Observable.of(this.getS3JobsByCountries()['countries'])
                        .map((res) => this.getLimiter(res, limit));
                }
            }

    }

    public getAllCountries(order_by = 'alphabetical', reset = false): Observable<any> {
        return Observable.of(this.getS3JobsByCountries())
            .map((res) => this._getBuildAllCountries(res['countries']));
    }

    public _getBuildAllCountries(countries) {
        this.countryList = Array();
        let cnt = 0;
        countries.forEach((selCountry) => {
            let countryNew = new Country();
            countryNew.id = selCountry.id;
            countryNew.name = selCountry.name;
            countryNew.jobs_count = selCountry.jobs_count;
            this.countryList.push(countryNew);
            cnt++;
        });

        LoaderService.countryAllAlphaCache = this.countryList;
        return this.countryList;
    }

    public getExpRange() {
        return this.constants['experience_ranges'];
    }

    public getAgeGroups() {
        return this.constants['age_groups'];
    }

    public getGeneralAgeGroups(limit: any = 1000, params = null) {
        if (this.getValidObject(params)) {
            return this.getIdSeachJson(this.constants['age_groups'],
                params[this.age_group]);
        } else {
            return this.constants['age_groups'];
        }

    }

    public getValidObject(obj) {
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                return true;
            }
        }
        return false;
    }

    public getIdSeachJson(jsonList = [], keyList) {

        if (!keyList || keyList === undefined) {
            return jsonList;
        }

        let newJson = [];
        if (typeof(keyList) === 'number' || typeof(keyList) === 'string'){
            keyList = [keyList];
        }

        for (let index = 0; index < jsonList.length; index++) {
            for (let i = 0; i < keyList.length; i++) {
                if (keyList[i] == jsonList[index]['id']) newJson.push(jsonList[index]);
            }
        }
        return newJson;
    }

    public getSalaryRanges (params = null) {
        if (this.getValidObject(params)) {
            return this.getIdSeachJson(this.constants['salary_ranges'],
                params[this.salary_range_key]);
        } else {
            return this.constants['salary_ranges'];
        }
    }

    public getNationality(limit: any = 1000,
                          params = null,
                          order = 'jobs', all = false): Observable<any[]> {

        if (this.getValidObject(params) && params[this.nationality_key]) {
            return Observable.of(this.getIdSeachJson(this.getS3JobsByCountries()['countries'],
                params[this.nationality_key]));
        } else {
            return Observable.of(this.getLimiter(this.getS3JobsByCountries()['countries'], limit));
        }

    }

    public getCitiesListAll(limit: any = 1000) {
        return this.getLimiter(this.getS3JobsByCities()['cities'], limit);
    }

    public getCitiesList(country_ids = [],
                         params = null,
                         limit: any = 1000,
                         order = 'alpha'): Observable<any[]> {

        let cityList = [];
        let citiesParams = null;
        if (params && params['cities']) {

          if (Array.isArray(params['cities'])) {
              citiesParams = params['cities'].map((selval) => parseInt(selval));
          } else {
              citiesParams =  [parseInt(params['cities'])];
          }
        }

        if (country_ids.length > 0) {
            for (let selCountryId of country_ids) {

                for (let selCity of this.getS3JobsByCities(order)['cities']) {
                    if (citiesParams) {
                        // Dont use === here
                        if (citiesParams.includes(selCity.id) &&
                            selCity.country.id == selCountryId) {
                            cityList.push(selCity);
                        }
                    } else if (selCity.country.id == selCountryId) {  // Dont use === here
                        cityList.push(selCity);
                    }
                }
            }

        } else {
            for (let selCity of this.getS3JobsByCities()['cities']) {
                if (citiesParams && citiesParams.includes(selCity.id)) {
                    cityList.push(selCity);

                }
            }
        }
        return Observable.of(this.getLimiter(cityList, limit));

    }

    public getSectors(order_by = 'jobs', limit: any = 1000, params = null) {

        if (this.getValidObject(params)) {
            return this.getLimiter(this.getBuildSector(this.getIdSeachJson(
                this.getS3JobsBySectors()['sectors'], params[this.sector_key])), limit);
        } else {
            return this.getLimiter(this.
                getBuildSector(this.getS3JobsBySectors(order_by)['sectors']),
                limit);

        }

    }

    public getBuildSector(sectors) {
        this.sectorList = Array();
        sectors.forEach((selSector) => {
            let sectorNew = new Sector();
            sectorNew.id = selSector.id;
            sectorNew.name = selSector.name;
            sectorNew.jobs_count = selSector.jobs_count;
            this.sectorList.push(sectorNew);
        });

        return this.sectorList;
    }

    public getSectorsByOrder(limit: any = 1000, order = 'jobs') {
        let sectors = this.getS3JobsBySectors(); // done
        return this.getLimiter(sectors['sectors'], limit);
    }

    public getSectorTags(limit: any = 1000, params = null) {

        let stype = 1;  // 1 All, 3 search
        if (params) {
            if (this.getValidObject(params)) {
                stype = 3; // 3 search
            }
            return this.getLoadStaticSector(stype, limit, params[this.sector_key]);
        } else {
            return this.getLoadStaticSector(stype, limit, null);
        }

    }

    public getLoadStaticSector(stype, limit, keyList) {

        if (stype === 3) {
            return this.getLimiter(this.getIdSeachJson(this.getS3JobsBySectors()['sectors'],
                keyList), limit);
        } else {
            return this.getLimiter(this.getS3JobsBySectors()['sectors'], limit);
        }

    }

    public getCompanies(limit: any = 1000, params = null): Observable<any[]> {

        // @toDo
        if (params == null || Object.getOwnPropertyNames(params).length === 0
            || !params[this.company_key]) {
            return Observable.of(this.getLimiter(
                this.constants['companies_by_followers'], limit));
        } else {
            let url = ConfigService.getAPI() + this._company_url + '?order=followers' +
                this._getBuildParamsUrl(params, this.company_key);

            if (this.CompanyCache == null || this.CompanyCacheURL !== url) {
                return this.getCompanyAPI(url, limit);
            } else {
                if (this.CompanyCache && this.CompanyCache.length > 0) {
                    return Observable.of(this.CompanyCache).map((res) => res['companies'])
                        .map((res) => this.getLimiter(res, limit));
                } else {
                    return this.getCompanyAPI(url, limit);
                }
            }
        }

    }

    public getCompanyAPI(url: string, limit: any) {
        return this._http.get(url)
            .map((res) => {
                this.CompanyCache = res;
                this.CompanyCacheURL = url;
                return res;
            })
            .map((res) => res['companies'])
            .map((res) => this.getLimiter(res, limit));
    }

    public getFunctionalAreas(limit: any = 1000, params = null) {

        if (this.getValidObject(params)) {
            return this.getIdSeachJson(this.constants['functional_areas'],
                params[this.func_area_key]);

        } else {
            return this.constants['functional_areas'];
        }

    }

    public getJobTypes(limit: any = 1000, params = null, cleanCache = false) {

        if (this.getValidObject(params)) {
            return this.getIdSeachJson(this.constants['job_types'],
                params[this.job_key]);
        } else {
            return this.constants['job_types'];
        }

    }

    public getJobEducations(limit: any = 1000, params = null) {

        if (this.getValidObject(params)) {
            return this.getLimiter(this.getIdSeachJson(
                this.constants['job_educations'], params[this.education_key]),
                limit);
        } else {
            return this.constants['job_educations'];
        }

    }

    public getBenefits() {
        return this.constants['benefits'];
    }

    public getJobExperienceLevels(limit: any = 1000, params = null) {
        if (this.getValidObject(params)) {
            return this.getLimiter(this.getIdSeachJson(
                this.constants['job_experience_levels'],
                params[this.jobexp_key]), limit);
        } else {
            return this.constants['job_experience_levels'];
        }
    }

    public getLanguages(limit: any = 1000, params = null) {

        if (this.getValidObject(params) && params[this.language_key]) {
            return this.getIdSeachJson(this.constants['languages'],
                params[this.language_key]);

        } else {
            return this.getLimiter(this.constants['languages'], limit);
        }

    }

    public getVisaStatus(limit: any = 1000, params = null) {
        if (this.getValidObject(params)) {
            return this.getIdSeachJson(this.constants['visa_statuses'],
                params[this.visa_key]);
        } else {
            return this.constants['visa_statuses'];
        }
    }

    public getVisaStatuses() {
        return this._getBuildVisaStatus(this.constants['visa_statuses']);
    }

    public getJobStatuses() {
        return this.constants['job_application_statuses'];
    }

    public getMaritalStatus() {
      return this.constants['marital_statuses'];
    }

    public getMaritalStatus2() {
        let maritalStatusList = this.constants['marital_statuses'];
        if (maritalStatusList.length < 3) {
            maritalStatusList.push({id: 'any',
                name: (this.isArabic() ? 'أي شيء' : 'Any'), code: 'any'});
        }

        return maritalStatusList;
    }

    public getGender() {
      let genderList = this.constants['genders'];

      if (genderList.length < 3) {
          genderList.push({id: 'any', name: (this.isArabic() ? 'أي شيء' : 'Any'), code: 'any'});
      }
      return genderList;
    }

    public getJobseekerGender() {
      return this.constants['genders'];
    }

    public getLastActive() {
        return this.constants['last_actives'];
    }

    public getYears(count: number = 70): any[] {

        let yearList = [];
        let startYear = 1950;
        for (let i = 1; i <= count; i++) {
            yearList.push({
                id: (startYear + i),
                name: (startYear + i).toString(),
                year: (startYear + i)
            });
        }

        return yearList;
    }

    public isArabic() {
      return this.authService.getCurrLang() === ConfigService.langHash['arabic'];
    }

    public getMonths(): any[] {

        let monthList = [];

        monthList.push({id: 1, name: 'January'});
        monthList.push({id: 2, name: 'February'});
        monthList.push({id: 3, name: 'March'});
        monthList.push({id: 4, name: 'April'});
        monthList.push({id: 5, name: 'May'});
        monthList.push({id: 6, name: 'June'});
        monthList.push({id: 7, name: 'July'});
        monthList.push({id: 8, name: 'August'});
        monthList.push({id: 9, name: 'September'});
        monthList.push({id: 10, name: 'October'});
        monthList.push({id: 11, name: 'November'});
        monthList.push({id: 12, name: 'December'});

        return monthList;

    }

    public getNoticePeriod() {
        return this.constants['notice_periods'];
    }

    public getStaticCountries(order = 'alpha') {
        return this.getS3JobsByCountries(order)['countries'];
    }

    public getStaticSectors() {
        return this.getS3JobsBySectors()['sectors'];
    }

    public getExpList() {

        let totalExp = 50;
        let yearsExpList = [];

        for (let i = 0; i <= totalExp; i++) {

            if (i !== 1) {
                yearsExpList.push({id: i, name: i + ' ' +
                        FixedText['years'][this.authService.getCurrLang()]});
            } else {
                    yearsExpList.push({id: i, name: i + ' ' +
                            FixedText['year'][this.authService.getCurrLang()]});
            }
        }
        return yearsExpList;
    }

    public getCitySearch(country_ids = [], query: string = null, order = 'jobs') {

        let cityList = [];
        for (let selCountryId of country_ids){
            for (let selCity of this.getS3JobsByCities()['cities'] ){
                if (selCity.country.id === selCountryId && selCity.name.toLowerCase()
                    .indexOf(query.toLowerCase()) >= 0) {
                    cityList.push(selCity);
                }
            }
        }
        return Observable.of(cityList);

    }

    public getAlertTypes() {
        return this.constants['alert_types'];

    }

    public getFixedText() {
        return Object.assign(FixedText, CustomFixedText);
    }

    public getCalDuration(start_date, end_date){

        let duration = '';
        let a = end_date ? moment(end_date) : moment();
        let b = moment(start_date);
        let date_diff = a.diff(b, 'months');
        if (date_diff < 12) {
            if (date_diff == 1)
                duration = date_diff + ' ' + FixedText['month'][this.authService.getCurrLang()] ;
            if (date_diff == 0) {
                let date_diff = a.diff(b, 'days');
                if (date_diff == 1) {
                    duration = date_diff + ' ' + FixedText['day'][this.authService.getCurrLang()];
                } else {
                    duration = date_diff + ' ' + FixedText['days'][this.authService.getCurrLang()];
                }
            }
            else
                duration = date_diff + ' ' + FixedText['months'][this.authService.getCurrLang()];
        } else {
            date_diff = a.diff(b, 'years');
            if (date_diff == 1)
                duration = date_diff + ' ' + FixedText['year'][this.authService.getCurrLang()];
            else
               duration = date_diff + ' ' + FixedText['years'][this.authService.getCurrLang()];
        }

        return duration;
    }
    public getUniversityByCountry(searchString: string= '', id: string= '')  {
        return this._http.get(ConfigService.getAPI() + this.university_url + '?q[country_id_eq]='+ id + '&q[name_cont]='
        + searchString + '&all=true')
            .map((res) => res['universities']);
    }

}
