import { OnInit, Input, Component, OnDestroy } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

// Service
import { LoaderService } from '../../../shared/services/loader.service';
import { JobService } from '../../../core/services/job.service';
import { AccountService } from '../../../core/account/services/account.service';
import { Router } from '@angular/router';

// Models
import { Sector } from '../../../shared/models/Sector';
import { FunctionalArea } from '../../../shared/models/FunctionalArea';
import { Education } from '../../../shared/models/Education';
import { Experience } from '../../../shared/models/Experience';
import { JobType } from '../../../shared/models/JobType';
import { Country } from '../../../shared/models/Country';
import { City } from '../../../shared/models/City';
import { Company } from '../../../shared/models/Company';
import { SalaryRange } from '../../../shared/models/SalaryRange';
import { FilterElement } from '../../../shared/models/FilterElement';

@Component({
    selector: 'filter-area-company',
    templateUrl: 'filter.component.html',
    styleUrls: ['./filter.scss']
})

export class FilterComponent implements OnInit, OnDestroy {

    // Observables
    public queryParams$;
    public params$;
    public minShowMoreCount = 5;
    public resetFilter = false;
    public orderBy = null;
    public locations$: BehaviorSubject<any> = new BehaviorSubject(null);
    public fareas$: BehaviorSubject<any> = new BehaviorSubject(null);
    public sectors$: BehaviorSubject<any> = new BehaviorSubject(null);
    public cities$: BehaviorSubject<any> = new BehaviorSubject(null);
    public jobTypes$: BehaviorSubject<any> = new BehaviorSubject(null);
    public salarylevels$: BehaviorSubject<any> = new BehaviorSubject(null);
    public edulevels$: BehaviorSubject<any> = new BehaviorSubject(null);
    public explevels$: BehaviorSubject<any> = new BehaviorSubject(null);
    public companies$: BehaviorSubject<any> = new BehaviorSubject(null);
    public sector;

    //hash keys
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
    public queryParams = {};

    @Input() public page: string = '/companies/all';

    // Members
    public elementList = [];
    public filters = ['locations', 'cities', 'sectors', 'fareas', 'jobtypes', 'salarylevels',
        'edulevels', 'explevels', 'companies'];
    public currLan = 'en';
    public fixedTextHash = this.loadService.getFixedText();

    public constructor(public loadService: LoaderService,
                       public _jobservice: JobService,
                       public  accountService: AccountService,
                       public _router: Router,
                       public _activeRoute: ActivatedRoute) {

        this.getInitialize();
    }

    public ngOnDestroy() {
        this.queryParams$.unsubscribe();
        this.params$.unsubscribe();
    }

    public ngOnInit() {
        this.getLoadData();
        this.currLan = this.accountService.getCurrLang();
    }

    public getInitialize() {
        this.filters.forEach((selfilter) => {
            this.elementList[selfilter] = new FilterElement();
        });
    }

    public getBuildParamsUrl(params) {

        let ary = [];
        if (params != null && params) {
            ary = params.toString().split(',').map(Number);
        }
        return ary;
    }

    public _loadCities() {

        if (this.elementList['locations'].elementsChecked.length > 0) {
            this.loadService.getCitiesList(this.elementList['locations'].elementsChecked,
                this.elementList['cities'].elementsSearchString, 'auto')
                .subscribe((res) => {

                this.elementList['cities'].showAddmoreFlag =
                    (this.elementList['cities'].elementsChecked.length > 0 ||
                        res.length >= this.minShowMoreCount);

                this.elementList['cities'].elements = [];
                this.elementList['cities'].elementsMapper = [];
                res.forEach((selval) => {
                    let city = new City();
                    city.id = selval.id;
                    city.name = selval.name;
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
                    if (selCity.country_id === id &&
                        this.elementList['cities'].elementsChecked.indexOf(selCity.id) !== -1) {
                        this.toggleSelectElement('cities', selCity.id);
                    }
                });
            }
        }
    }

    public onAddElement($event, key = 'locations') {

        if ($event.id) {
            let selElement = null;
            if (key === 'locations') {
                selElement = new Country();
            }
            if (key === 'sectors') {
                selElement = new Sector();
            }
            if (key === 'salarylevels') {
                selElement = new SalaryRange();
            }
            if (key === 'fareas') {
                selElement = new FunctionalArea();
            }
            if (key === 'jobtypes') {
                selElement = new JobType();
            }
            if (key === 'edulevels') {
                selElement = new Education();
            }
            if (key === 'companies') {
                selElement = new Company();
            }
            if (key === 'explevels') {
                selElement = new Experience();
            }
            if (key === 'cities') {
                selElement = new City();
                selElement.country_id = this.loadService.getS3JobsByCities()
                    .cities.filter((selcity) => selcity.id === $event.id)[0].country.id;
            }

            selElement.id = $event.id;
            selElement.name = $event.name;
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
            (this.elementList[key].expendAddmoreFlag) ? false : true;

    }

    public _getFetchData() {

        if (this.elementList['locations'].loadedDataFlag === false) {
            AccountService.s3Loaded$.subscribe((resFlag) => {
                if (resFlag) {
                    this.elementList['locations'].loadedDataFlag = true;

                    // Loading Locations
                    this.loadService.getGeneralCountries(this.minShowMoreCount,
                        this.elementList['locations'].elementsSearchString)
                        .subscribe((res) => {

                        this.elementList['locations'].elements = [];
                        this.elementList['locations'].showAddmoreFlag =
                            (this.elementList['locations'].elementsChecked.length > 0 ||
                                res.length >= this.minShowMoreCount);
                        this.elementList['locations'].elementsMapper = [];
                        res.forEach((selval) => {
                            let selElement = new Country();
                            this._buildElementBody(selElement, selval, 'locations');
                        });
                        this.locations$.next(this.elementList['locations']);

                        // Loading Cities
                        this._loadCities();
                    });
                }
            });

        }

        if (this.elementList['sectors'].loadedDataFlag == false) {

            // Loading sectors
            AccountService.s3Loaded$.subscribe((resFlag) => {
                if (resFlag) {
                    this.elementList['sectors'].loadedDataFlag = true;
                    let sector_res =
                        this.loadService.getSectors('jobs', this.minShowMoreCount,
                            this.elementList['sectors'].elementsSearchString);

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

        if (this.elementList['fareas'].loadedDataFlag === false) {
            AccountService.s3Loaded$.subscribe((resFlag) => {
                if (resFlag) {
                    this.elementList['fareas'].loadedDataFlag = true;

                    // Loading fareas
                    let func_res = this.loadService
                        .getFunctionalAreas('auto',
                            this.elementList['fareas'].elementsSearchString);
                    this.elementList['fareas'].elements = [];
                    this.elementList['fareas'].showAddmoreFlag =
                        (this.elementList['fareas'].elementsChecked.length > 0 ||
                            func_res.length >= this.minShowMoreCount);
                    this.elementList['fareas'].elementsMapper = [];
                    func_res.forEach((selval) => {
                        let selElement = new FunctionalArea();
                        this._buildElementBody(selElement, selval, 'fareas');

                    });
                    this.fareas$.next(this.elementList['fareas']);

                }
            });

        }

        if (this.elementList['jobtypes'].loadedDataFlag === false) {
            AccountService.s3Loaded$.subscribe((resFlag) => {
                if (resFlag) {
                    this.elementList['jobtypes'].loadedDataFlag = true;

                    // Loading jobTypes
                    let job_res = this.loadService.getJobTypes('auto',
                        this.elementList['jobtypes'].elementsSearchString);

                    this.elementList['jobtypes'].elements = [];
                    this.elementList['jobtypes'].showAddmoreFlag =
                        (this.elementList['jobtypes'].elementsChecked.length > 0 ||
                            job_res.length >= this.minShowMoreCount);
                    this.elementList['jobtypes'].elementsMapper = [];
                    job_res.forEach((selval) => {
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
                    let edu_res =
                        this.loadService
                            .getJobEducations('auto',
                                this.elementList['edulevels'].elementsSearchString);
                    this.elementList['edulevels'].elements = [];
                    this.elementList['edulevels'].showAddmoreFlag =
                        (this.elementList['edulevels'].elementsChecked.length > 0 ||
                            edu_res.length >= this.minShowMoreCount);
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
                    let explevelRes =
                        this.loadService.getJobExperienceLevels('auto',
                            this.elementList['explevels'].elementsSearchString);
                    this.elementList['explevels'].elements = [];
                    this.elementList['explevels'].showAddmoreFlag =
                        (this.elementList['explevels'].elementsChecked.length > 0 ||
                            explevelRes.length >= this.minShowMoreCount);
                    this.elementList['explevels'].elementsMapper = [];
                    explevelRes.forEach((selval) => {
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
                    this.loadService.getCompanies(this.minShowMoreCount,
                        this.elementList['companies'].elementsSearchString)
                        .subscribe((res) => {

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
                    let res = this.loadService
                        .getSalaryRanges(this.elementList['salarylevels'].elementsSearchString);

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

    public _buildElementBody(selElement, selval, key) {

        selElement.id = selval.id;
        if (key == 'salarylevels') {
            selElement.name = selval.salary_from + '-' + selval.salary_to;
        }
        else {
            selElement.name = selval.name;
        }

        selElement.selectedFlag = false;
        if (this.elementList[key].elementsChecked.indexOf(selval.id) != -1) {
            selElement.selectedFlag = true;
        }
        this.elementList[key].elements.push(selElement);
        this.elementList[key].elementsMapper.push(selElement.id);
    }

    public onApply() {

        let params = {queryParams: {}};
        this.filters.forEach((selFilter) => {

            if (this.elementList[selFilter].elementsChecked.length > 0)
                params['queryParams'][selFilter] = this.elementList[selFilter].elementsChecked;
        });

        if (this.orderBy)
            params['queryParams']['order'] = this.orderBy;

        this._router.navigate([this.page], params);
    }

    public onResetUrl() {

        if (this.orderBy) {
            this._router.navigate([this.page], {queryParams: {order: this.orderBy}});
        }
        else {
            this._router.navigate([this.page]);
        }
        this.getInitialize();
    }

    public onReset() {

        this.getInitialize();
        this.getLoadData();
    }

    public getLoadData() {

        //URL Params Fetch
        this.queryParams$ = this._activeRoute.queryParams.subscribe((params) => {

            this.queryParams = {};
            if (params) {
                Object.assign(this.queryParams, params);
            }
            // URL Params Fetch    Used for seo urls
            this.params$ = this._activeRoute.params.subscribe((params2) => {

                if (params2['country_name']) {
                    this.loadService.getStaticCountries().forEach((val) => {
                        if (this.accountService.getSpaceToDashLowerCase(val.name) ==
                            params2['country_name']) {
                            this.queryParams['locations'] = val.id;
                        }
                    });
                } else if (params2['sector_name']) {
                    this.loadService.getStaticSectors().forEach((val) => {
                        if (this.accountService.getSpaceToDashLowerCase(val.name) ==
                            params2['sector_name']) {
                            this.queryParams['sectors'] = val.id;
                        }
                    });
                }

                this.resetFilter = false;
                if ((this.queryParams['order'] && this.orderBy == null) ||
                    ((!this.queryParams['order']) && this.orderBy != null)) {
                    this.resetFilter = true;
                }

                if (this.queryParams['order']) {
                    this.orderBy = this.queryParams['order'];
                } else {
                    this.orderBy = null;

                }
                if (this.resetFilter) {
                    this.onResetUrl();
                }

                this.filters.forEach((selfilter) => {

                    this.elementList[selfilter].elementsChecked =
                        this.getBuildParamsUrl(this.queryParams[this.paramsHash[selfilter]]);
                    this.elementList[selfilter].elementsSearchString = this.queryParams;
                });

                this._getFetchData();
            });
        });
    }


}
