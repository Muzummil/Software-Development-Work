import { OnInit, Input, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// Directives
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

// service
import { LoaderService } from '../../../shared/services/loader.service';
import { AccountService } from '../../../core/account/services/account.service';
import { Router } from '@angular/router';

// Models
import { Sector } from '../../../shared/models/Sector';
import { FunctionalArea } from '../../../shared/models/FunctionalArea';
import { Education } from '../../../shared/models/Education';
import { Experience } from '../../../shared/models/Experience';
import { JobType } from '../../../shared/models/JobType';
import { JobSearch } from './../models/JobSearch';
import { Country } from '../../../shared/models/Country';
import { City } from '../../../shared/models/City';
import { Company } from '../../../shared/models/Company';
import { FilterElement } from './../models/FilterElement';
import { SalaryRange } from '../../../shared/models/SalaryRange';

@Component({
    selector: 'filter1-area-job',
    templateUrl: 'filter1.component.html',
    styleUrls: ['./filter1.scss']
})

export class Filter1Component implements OnInit {

    // Observables
    public queryParams$;
    public queryParams;
    public params$;
    public minShowMoreCount = 5;
    public selJob: JobSearch = new JobSearch();

    public locations$: BehaviorSubject<any> = new BehaviorSubject(null);
    public fareas$: BehaviorSubject<any> = new BehaviorSubject(null);
    public sectors$: BehaviorSubject<any> = new BehaviorSubject(null);
    public cities$: BehaviorSubject<any> = new BehaviorSubject(null);
    public jobTypes$: BehaviorSubject<any> = new BehaviorSubject(null);
    public salarylevels$: BehaviorSubject<any> = new BehaviorSubject(null);
    public edulevels$: BehaviorSubject<any> = new BehaviorSubject(null);
    public explevels$: BehaviorSubject<any> = new BehaviorSubject(null);
    public companies$: BehaviorSubject<any> = new BehaviorSubject(null);

    public isPublic$: BehaviorSubject<any> = new BehaviorSubject(null);
    public sector;

    // Hash keys
    public paramsHash = {
        locations: 'locations',
        cities: 'cities',
        sectors: 'sectors',
        fareas: 'fareas',
        jobtypes: 'jobtypes',
        salarylevels: 'salarylevels',
        edulevels: 'edulevels',
        explevels: 'explevels',
        companies: 'companies'
    };

    public currLan = 'en';
    public fixedTextHash = this.loaderService.getFixedText();

    @Input() page: string = this.accountService.getPath() + '/jobs';

    // Members
    public elementList = [];
    public filters = ['locations', 'cities', 'sectors', 'fareas', 'jobtypes', 'salarylevels',
        'edulevels', 'explevels', 'companies'];

    public constructor(public  accountService: AccountService,
                       public loaderService: LoaderService,
                       public _router: Router,
                       public _activeRoute: ActivatedRoute) {

        // Unassigned
        this.selJob.id = -1;
        this.selJob.alertTypeId = null;
        this._getInitialize();

    }

    public _getInitialize() {

        this.filters.forEach((selfilter) => {
            this.elementList[selfilter] = new FilterElement();
        });

        this.isPublic$.next(!this.accountService.getAuth());

    }

    public _getBuildParamsUrl(params) {

        let ary = [];
        if (params != null && params) {
            ary = params.toString().split(',').map(Number);
        }
        return ary;
    }

    public _loadCities() {

        if (this.elementList['locations'].elementsChecked.length > 0) {
            this.loaderService.getCitiesList(this.elementList['locations'].elementsChecked,
                this.elementList['cities'].elementsSearchString,
                'auto',
                'jobs').subscribe((res) => {
                this.elementList['cities'].showAddmoreFlag =
                    (this.elementList['cities'].elementsChecked.length > 0 ||
                        res.length >= this.minShowMoreCount) ? true : false;

                this.elementList['cities'].elements = [];
                this.elementList['cities'].elementsMapper = [];
                res.forEach((selval) => {
                    let city = new City();
                    city.id = selval.id;
                    city.name = selval.name;
                    city.jobs_count = selval.jobs_count;
                    city.selectedFlag = false;
                    city.country_id = selval.country.id;
                    if (this.elementList['cities'].elementsChecked.indexOf(selval.id) != -1) {
                        city.selectedFlag = true;
                    }
                    this.elementList['cities'].elements.push(city);
                    this.elementList['cities'].elementsMapper.push(city.id);
                });

                this.cities$.next(this.elementList['cities']);

            });
        }
    }

    public onSelectElement(id, key) {

        this.toggleSelectElement(key, id);

        if (key === 'locations') {
            this._loadCities();
        }

        this.onApply();

    }

    public toggleSelectElement(key, id) {
        if (this.elementList[key].elementsChecked.indexOf(id) == -1) {
            this.elementList[key].elementsChecked.push(id);
        } else {
            this.elementList[key].elementsChecked.splice(this.elementList[key]
                .elementsChecked.indexOf(id), 1);
            if (key === 'locations') {
                this.elementList['cities'].elements.forEach((selCity) => {
                    if (selCity.country_id === id && selCity.selectedFlag) {
                        this.toggleSelectElement('cities', selCity.id);
                    }
                });
            }
        }
    }

    public onAddElement($event, key = 'locations') {

        if ($event.id) {
            let selElement = null;
            if (key == 'locations') {
                selElement = new Country();
            }
            if (key == 'sectors') {
                selElement = new Sector();
            }
            if (key == 'salarylevels') {
                selElement = new SalaryRange();
            }
            if (key == 'fareas') {
                selElement = new FunctionalArea();
            }
            if (key == 'jobtypes') {
                selElement = new JobType();
            }
            if (key == 'edulevels') {
                selElement = new Education();
            }
            if (key == 'companies') {
                selElement = new Company();
            }
            if (key == 'explevels') {
                selElement = new Experience();
            }
            if (key == 'cities') {
                selElement = new City();
                selElement.country_id = this.loaderService.getS3JobsByCities()
                    .cities.filter((selcity) => selcity.id === $event.id)[0].country.id;
            }

            selElement.id = $event.id;
            selElement.name = $event.name;
            selElement.jobs_count = $event.jobs_count;
            selElement.selectedFlag = false;
            selElement.selectedFlag = true;
            this.elementList[key].elementsChecked.push(selElement.id);
            this.elementList[key].elements.push(selElement);
            this.elementList[key].elementsMapper.push(selElement.id);

            if (key === 'locations') {
                this._loadCities();
            }
        }

        this.onApply();
    }

    public customAdd(key = 'locations') {
        this.elementList[key].expendAddmoreFlag =
            (!this.elementList[key].expendAddmoreFlag);
    }

    public _getFetchData() {

        if (this.elementList['locations'].loadedDataFlag === false) {
            this.elementList['locations'].loadedDataFlag = true;

            // Loading Locations
            let order = 'jobs';
            let allRecords = true;
            this.loaderService.getGeneralCountries(this.minShowMoreCount,
                this.elementList['locations'].elementsSearchString, order, allRecords)
                .subscribe((res) => {

                    this.elementList['locations'].elements = [];
                    this.elementList['locations'].showAddmoreFlag =
                        ((this.elementList['locations'].elementsChecked &&
                            this.elementList['locations'].elementsChecked.length > 0) ||
                            res.length >= this.minShowMoreCount);
                    this.elementList['locations'].elementsMapper = [];

                    res.forEach((selval) => {
                        if (selval['jobs_count'] > 0 || res[0]['jobs_count'] == 0) {
                            let selElement = new Country();
                            this._buildElementBody(selElement, selval, 'locations');
                        }
                    });

                    this.locations$.next(this.elementList['locations']);

                    // Loading Cities
                    this._loadCities();
                });
        }

        if (this.elementList['sectors'].loadedDataFlag == false) {

            AccountService.s3Loaded$.subscribe((resFlag) => {
                if (resFlag) {
                    this.elementList['sectors'].loadedDataFlag = true;
                    // Loading sectors
                    let sector_res = this.loaderService.getSectors('jobs',
                        this.minShowMoreCount, this.elementList['sectors'].elementsSearchString);

                    this.elementList['sectors'].elements = [];
                    this.elementList['sectors'].showAddmoreFlag =
                        (this.elementList['sectors'].elementsChecked.length > 0 ||
                            sector_res.length >= this.minShowMoreCount);
                    this.elementList['sectors'].elementsMapper = [];
                    sector_res.forEach((selval) => {
                        let selElement = new Sector();
                        this._buildElementBody(selElement, selval, 'sectors');

                    });
                    this.sectors$.next(this.elementList['sectors']);
                }
            });

        }

        if (this.elementList['fareas'].loadedDataFlag == false) {

            AccountService.s3Loaded$.subscribe((resFlag) => {
                if (resFlag) {
                    this.elementList['fareas'].loadedDataFlag = true;

                    // Loading fareas
                    let funcRes = this.loaderService.getFunctionalAreas(this.minShowMoreCount,
                        this.elementList['fareas'].elementsSearchString);

                    this.elementList['fareas'].elements = [];
                    this.elementList['fareas'].showAddmoreFlag = false;
                    this.elementList['fareas'].elementsMapper = [];
                    funcRes.forEach((selval) => {
                        let selElement = new FunctionalArea();
                        this._buildElementBody(selElement, selval, 'fareas');

                    });
                    this.fareas$.next(this.elementList['fareas']);
                }

            });

        }

        if (this.elementList['jobtypes'].loadedDataFlag == false) {
            this.elementList['jobtypes'].loadedDataFlag = true;

            // Loading jobTypes

            AccountService.s3Loaded$.subscribe((resFlag) => {
                if (resFlag) {

                    let jobRes = this.loaderService.getJobTypes();

                    this.elementList['jobtypes'].elements = [];
                    this.elementList['jobtypes'].showAddmoreFlag = false;
                    this.elementList['jobtypes'].elementsMapper = [];
                    jobRes.forEach((selval) => {
                        let selElement = new JobType();
                        this._buildElementBody(selElement, selval, 'jobtypes');

                    });
                    this.jobTypes$.next(this.elementList['jobtypes']);
                }
            });

        }

        if (this.elementList['edulevels'].loadedDataFlag == false) {

            AccountService.s3Loaded$.subscribe((resFlag) => {
                if (resFlag) {

                    this.elementList['edulevels'].loadedDataFlag = true;

                    // Loading edulevels
                    let edu_res = this.loaderService.getJobEducations(this.minShowMoreCount,
                        this.elementList['edulevels'].elementsSearchString);

                    this.elementList['edulevels'].elements = [];
                    this.elementList['edulevels'].showAddmoreFlag = false;
                    this.elementList['edulevels'].elementsMapper = [];
                    edu_res.forEach((selval) => {
                        let selElement = new Education();
                        this._buildElementBody(selElement, selval, 'edulevels');

                    });
                    this.edulevels$.next(this.elementList['edulevels']);
                }
            });

        }

        if (this.elementList['explevels'].loadedDataFlag == false) {

            AccountService.s3Loaded$.subscribe((resFlag) => {
                if (resFlag) {
                    this.elementList['explevels'].loadedDataFlag = true;

                    // Loading explevels
                    let explevel_res = this.loaderService.getJobExperienceLevels();

                    this.elementList['explevels'].elements = [];
                    this.elementList['explevels'].showAddmoreFlag = false;
                    this.elementList['explevels'].elementsMapper = [];
                    explevel_res.forEach((selval) => {
                        let selElement = new Experience();
                        this._buildElementBody(selElement, selval, 'explevels');

                    });
                    this.explevels$.next(this.elementList['explevels']);

                }
            });

        }

        if (this.elementList['companies'].loadedDataFlag == false) {

            AccountService.s3Loaded$.subscribe((resFlag) => {
                if (resFlag) {
                    this.elementList['companies'].loadedDataFlag = true;

                    // Loading explevels
                    this.loaderService.getCompanies(this.minShowMoreCount,
                        this.elementList['companies'].elementsSearchString).subscribe((res) => {

                        this.elementList['companies'].elements = [];
                        this.elementList['companies'].showAddmoreFlag =
                            (this.elementList['companies'].elementsChecked.length > 0 ||
                                res.length >= this.minShowMoreCount);
                        this.elementList['companies'].elementsMapper = [];
                        res.forEach((selval) => {
                            let selElement = new Company();
                            this._buildElementBody(selElement, selval, 'companies');

                        });
                        this.companies$.next(this.elementList['companies']);
                    });
                }
            });

        }

        if (this.elementList['salarylevels'].loadedDataFlag == false) {

            AccountService.s3Loaded$.subscribe((resFlag) => {
                if (resFlag) {
                    this.elementList['salarylevels'].loadedDataFlag = true;

                    // Loading jobTypes
                    let res = this.loaderService.getSalaryRanges();
                    this.elementList['salarylevels'].elements = [];
                    this.elementList['salarylevels'].showAddmoreFlag =
                        (this.elementList['salarylevels'].elementsChecked.length > 0 ||
                            res.length >= this.minShowMoreCount);
                    this.elementList['salarylevels'].elementsMapper = [];
                    res.forEach((selval) => {
                        let selElement = new SalaryRange();
                        this._buildElementBody(selElement, selval, 'salarylevels');

                    });
                    this.salarylevels$.next(this.elementList['salarylevels']);
                }
            });

        }

    }

    public numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    public _buildElementBody(selElement: any, selval, key) {

        selElement.id = selval.id;
        if (key == 'salarylevels') {

            if (selval.salary_to > 100000) {
                selElement.name = '10+';

            } else {
                selElement.name = this.numberWithCommas(selval.salary_from) + '-' +
                    this.numberWithCommas(selval.salary_to);
            }

        } else
            selElement.name = selval.name;

        if (selval.jobs_count != null) selElement.jobs_count = selval.jobs_count;

        selElement.selectedFlag = false;
        if (this.elementList[key].elementsChecked.indexOf(selval.id) != -1) {
            selElement.selectedFlag = true;
        }
        this.elementList[key].elements.push(selElement);
        this.elementList[key].elementsMapper.push(selElement.id);

    }

    public onSaveSearch() {
        this.selJob.web_url = window.location.href;
    }

    public onApply() {

        let pagination_url = {queryParams: {}};

        this.queryParams$ = this._activeRoute.queryParams.subscribe((params) => {
            for (let key in params) {

                if (params.hasOwnProperty(key)) {

                    // All parameters other than the filters
                    if (this.filters[key] === 'undefined') {
                        pagination_url['queryParams'][key] = params[key];
                    } else if (key == 'title') {
                        pagination_url['queryParams'][key] = params[key];
                    }
                }
            }

        });

        this.params$ = this._activeRoute.params.subscribe((params) => {
            for (let key in params) {

                if (params.hasOwnProperty(key)) {

                    // All parameters other than the filters
                    if (this.filters[key] === 'undefined') {
                        pagination_url['queryParams'][key] = params[key];
                    } else if (key == 'title') {
                        pagination_url['queryParams'][key] = params[key];
                    }
                }
            }

        });

        this.filters.forEach((selFilter) => {

            if (this.elementList[selFilter].elementsChecked.length > 0) {
                pagination_url['queryParams'][selFilter] =
                    this.elementList[selFilter].elementsChecked;
            }
        });

        this._router.navigate([this.page], pagination_url);
    }

    public onReset() {

        this._router.navigate([this.page]);
        this.getLoadData();
    }

    public getLoadData() {

        // URL QueryParams Fetch
        this.queryParams$ = this._activeRoute.queryParams.subscribe((params) => {

            this.queryParams = {};
            if (params) {
                Object.assign(this.queryParams, params);
            }

            // URL Params Fetch  Used for seo urls
            this.params$ = this._activeRoute.params.subscribe((params2) => {

                if (params2['country']) {
                    this.loaderService.getStaticCountries('jobs').forEach((val) => {
                        if (this.accountService.getSpaceToDashLowerCase(val.name) ==
                            params2['country']) {
                            this.queryParams['locations'] = val.id;
                        }
                    });

                    if (params2['city_name'] && this.queryParams['locations']) {
                        let cntList = [this.queryParams['locations']];

                        this.loaderService.getCitiesListAll().forEach((val) => {

                            if (this.accountService.getSpaceToDashLowerCase(val.name) ==
                                params2['city_name']) {
                                this.queryParams['cities'] = val.id;
                            }
                        });

                        // if country and city
                        this.getBuildFilter(params2, this.queryParams);

                    }

                    // if only country
                    this.getBuildFilter(this.queryParams, params2);

                } else if (params2['sector_name']) {
                    this.loaderService.getStaticSectors().forEach((val) => {
                        if (this.accountService.getSpaceToDashLowerCase(val.name) ==
                            params2['sector_name']) {
                            this.queryParams['sectors'] = val.id;
                        }
                    });
                    // Sector
                    this.getBuildFilter(params2, this.queryParams);
                } else {
                    //  general
                    this.getBuildFilter(this.queryParams, params2);

                }
            });
        });
    }

    public getBuildFilter(params, params2) {
        this.filters.forEach((selfilter) => {

            if (params[this.paramsHash[selfilter]]) {

                this.elementList[selfilter].elementsChecked =
                    this._getBuildParamsUrl(params[this.paramsHash[selfilter]]);
                this.elementList[selfilter].elementsSearchString = params;
            } else {
                this.elementList[selfilter].elementsChecked =
                    this._getBuildParamsUrl(params2[this.paramsHash[selfilter]]);
                this.elementList[selfilter].elementsSearchString = params2;
            }
        });

        this._getFetchData();

        // For Remove tags Feature
        this._getResetSelectTags();
    }

    public _getResetSelectTags() {

        this.filters.forEach((selfilter) => {

            if (this.elementList[selfilter].elements.length > 0) {

                this.elementList[selfilter].elements.forEach((selval, key) => {

                    if (this.elementList[selfilter].elementsChecked.indexOf(selval.id) != -1) {
                        selval.selectedFlag = true;
                    } else {
                        selval.selectedFlag = false;
                    }

                });
            }
        });

        this._getLoadObervables();

    }

    public _getLoadObervables() {

        this.locations$.next(this.elementList['locations']);
        this.cities$.next(this.elementList['cities']);
        this.sectors$.next(this.elementList['sectors']);
        this.fareas$.next(this.elementList['fareas']);
        this.jobTypes$.next(this.elementList['jobtypes']);
        this.salarylevels$.next(this.elementList['salarylevels']);
        this.edulevels$.next(this.elementList['edulevels']);
        this.explevels$.next(this.elementList['explevels']);
        this.companies$.next(this.elementList['companies']);
    }

    public ngOnDestroy() {
        this.queryParams$.unsubscribe();
        this.params$.unsubscribe();
    }

    public ngOnInit() {
        this.getLoadData();
        this.currLan = this.accountService.getCurrLang();
    }
}
