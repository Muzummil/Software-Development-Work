import { OnInit, Input, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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
import { Country } from '../../../shared/models/Country';
import { City } from '../../../shared/models/City';
import { Company } from '../../../shared/models/Company';
import { SalaryRange } from '../../../shared/models/SalaryRange';
import { FilterElement } from '../../../shared/models/FilterElement';

@Component({
    selector: 'filter-applied-candidate',
    templateUrl: 'filterAppliedCandidate.component.html',
    styleUrls: ['./filterAppliedCandidate.scss']
})

export class FilterAppliedCandidateComponent implements OnInit, OnDestroy {

    // Observables
    public queryParams$;
    public params$;
    public minShowMoreCount = 5;
    public minShowMoreSpecialCount = 25;
    public resetFilter = false;
    public orderBy = null;
    public paramsList = {};
    public locations$: BehaviorSubject<any> = new BehaviorSubject(null);
    public fareas$: BehaviorSubject<any> = new BehaviorSubject(null);
    public sectors$: BehaviorSubject<any> = new BehaviorSubject(null);
    public exprange$: BehaviorSubject<any> = new BehaviorSubject(null);
    public cities$: BehaviorSubject<any> = new BehaviorSubject(null);
    public jobTypes$: BehaviorSubject<any> = new BehaviorSubject(null);
    public current_sal$: BehaviorSubject<any> = new BehaviorSubject(null);
    public expect_sal$: BehaviorSubject<any> = new BehaviorSubject(null);
    public edulevels$: BehaviorSubject<any> = new BehaviorSubject(null);
    public explevels$: BehaviorSubject<any> = new BehaviorSubject(null);
    public age_group$: BehaviorSubject<any> = new BehaviorSubject(null);
    public language$: BehaviorSubject<any> = new BehaviorSubject(null);
    public gender$: BehaviorSubject<any> = new BehaviorSubject(null);
    public notice_period$: BehaviorSubject<any> = new BehaviorSubject(null);
    public last_active$: BehaviorSubject<any> = new BehaviorSubject(null);
    public visa_status$: BehaviorSubject<any> = new BehaviorSubject(null);
    public job_type$: BehaviorSubject<any> = new BehaviorSubject(null);
    public nationality$: BehaviorSubject<any> = new BehaviorSubject(null);
    public sector;
    public selval;

    public salaryLevels = [];

    // hash keys
    public paramsHash = {
        locations: 'locations',
        cities: 'cities',
        sectors: 'sectors',
        fareas: 'fareas',
        jobtypes: 'jobtypes',
        expect_sal: 'expect_sal',
        current_sal: 'current_sal',
        edulevels: 'edulevels',
        explevels: 'explevels',
        companies: 'companies',
        age_group: 'age_group',
        language: 'language',
        gender: 'gender',
        notice_period: 'notice_period',
        last_active: 'last_active',
        visa_status: 'visa_status',
        job_type: 'job_type',
        nationality: 'nationality',
        exprange: 'exprange'
    };
    public expRangeList = [{id: 1, name: '0 - 1 years'}, {id: 2, name: '2 - 3 years'}, {
        id: 3,
        name: '3 - 4 years'
    }];
    public id;

    @Input() public page: string = '/jobs/applicants';

    // Members
    public elementList = [];
    public filters = ['locations', 'cities', 'sectors', 'fareas', 'jobtypes', 'current_sal',
        'expect_sal', 'edulevels', 'explevels', 'companies', 'age_group', 'language', 'gender',
        'notice_period', 'last_active', 'visa_status', 'job_type', 'nationality', 'exprange'];
    public specialCaseList = ['gender', 'last_active'];
    public singleCheckList = ['last_active'];
    public currLan = 'en';
    public fixedTextHash = this.loaderService.getFixedText();

    public constructor(public loaderService: LoaderService,
                       public _router: Router,
                       public accountService: AccountService,
                       public _activeRoute: ActivatedRoute) {

        this.getInitialize();
    }

    public ngOnDestroy() {
        this.queryParams$.unsubscribe();
        this.params$.unsubscribe();
    }

    public ngOnInit() {
        this.getLoadData();
    }

    public getInitialize() {

        this.filters.forEach((selfilter) => {
            this.elementList[selfilter] = new FilterElement();
        });
    }

    public _getBuildParamsUrl(params, selfilter) {

        let ary = [];

        if (params != null && params) {

            // Special Case
            if (this.specialCaseList.indexOf(selfilter) == -1) {
                ary = params.toString().split(',').map(Number);
            } else {
                ary = params.toString().split(',');
            }

        }
        return ary;
    }

    public _loadCities() {
        this.loaderService.getCitiesList(this.elementList['locations'].elementsChecked,
            this.elementList['cities'].elementsSearchString, 'auto', '')
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
                    city.country_id = selval.country.id;
                    city.selectedFlag = false;
                    if (this.elementList['cities'].elementsChecked.indexOf(selval.id) != -1) {
                        city.selectedFlag = true;
                    }
                    this.elementList['cities'].elements.push(city);
                    this.elementList['cities'].elementsMapper.push(city.id);
                });

                this.cities$.next(this.elementList['cities']);

            });
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
            if (this.singleCheckList.indexOf(key) != -1) {

                this.elementList[key].elementsChecked = [];
                this.elementList[key].elementsChecked.push(id);
            } else {
                this.elementList[key].elementsChecked.push(id);

            }
        } else {

            this.elementList[key].elementsChecked
                .splice(this.elementList[key].elementsChecked.indexOf(id), 1);
            delete this.paramsList[key];
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
            if (key === 'age_group') {
                selElement = {id: null, name: '', selectedFlag: false};
            }
            if (key === 'exprange') {
                selElement = {id: null, name: '', selectedFlag: false};
            }
            if (key === 'language') {
                selElement = {id: null, name: '', selectedFlag: false};
            }
            if (key === 'gender') {
                selElement = {id: null, name: '', selectedFlag: false};
            }
            if (key === 'notice_period') {
                selElement = {id: null, name: '', selectedFlag: false};
            }
            if (key === 'last_active') {
                selElement = {id: null, name: '', selectedFlag: false};
            }
            if (key === 'nationality') {
                selElement = {id: null, name: '', selectedFlag: false};
            }
            if (key === 'exprange') {
                selElement = {id: null, name: '', selectedFlag: false};
            }
            if (key === 'current_sal') {
                selElement = new SalaryRange();
            }
            if (key === 'expect_sal') {
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
            }

            selElement.id = $event.id;
            selElement.name = $event.name;
            selElement.selectedFlag = false;
            selElement.selectedFlag = true;
            this.elementList[key].elementsChecked.push(selElement.id);
            this.elementList[key].elements.push(selElement);
            this.elementList[key].elementsMapper.push(selElement.id);

            if (key == 'locations') this._loadCities();
        }

        this.onApply();
    }

    public customAdd(key = 'locations') {
        this.elementList[key].expendAddmoreFlag = (!this.elementList[key].expendAddmoreFlag);
        this.locations$.next(this.elementList['locations']);
    }

    public _getFetchCountries(minShowMoreCount, modeList = []) {

        this.loaderService.getGeneralCountries(minShowMoreCount, '', '').subscribe((res) => {

            modeList.forEach((mode) => {

                this.elementList[mode].elements = [];
                this.elementList[mode].showAddmoreFlag =
                    (this.elementList[mode].elementsChecked.length > 0 ||
                        res.length >= this.minShowMoreCount);
                this.elementList[mode].elementsMapper = [];
                res.forEach((selval) => {
                    let selElement = new Country();
                    this._buildElementBody(selElement, selval, mode);
                });
            });

            this.locations$.next(this.elementList['locations']);
            this.nationality$.next(this.elementList['nationality']);
        });
    }

    public getFetchData() {

        if (!this.elementList['locations'].elementsSearchString.locations &&
            !this.elementList['nationality'].elementsSearchString.nationality &&
            this.elementList['locations'].loadedDataFlag === false &&
            this.elementList['nationality'].loadedDataFlag === false) {

            this.elementList['locations'].loadedDataFlag = true;
            this.elementList['nationality'].loadedDataFlag = true;
            let modeList = ['locations', 'nationality'];
            this._getFetchCountries(this.minShowMoreCount, modeList);
        } else {

            if (this.elementList['locations'].loadedDataFlag === false) {
                this.elementList['locations'].loadedDataFlag = true;
                this.loaderService.getGeneralCountries(this.minShowMoreCount,
                    this.elementList['locations'].elementsSearchString, '')
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

            if (this.elementList['nationality'].loadedDataFlag == false) {
                this.elementList['nationality'].loadedDataFlag = true;
                this.loaderService.getNationality(this.minShowMoreCount,
                    this.elementList['nationality'].elementsSearchString, '')
                    .subscribe((res) => {

                    this.elementList['nationality'].elements = [];
                    this.elementList['nationality'].showAddmoreFlag =
                        (this.elementList['nationality'].elementsChecked.length > 0 ||
                            res.length >= this.minShowMoreCount);
                    this.elementList['nationality'].elementsMapper = [];

                    res.forEach((selval) => {
                        let selElement = {id: null, name: '', selectedFlag: false};
                        this._buildElementBody(selElement, selval, 'nationality');
                    });

                    this.nationality$.next(this.elementList['nationality']);
                });
            }
        }

        if (this.elementList['sectors'].loadedDataFlag === false) {

            AccountService.s3Loaded$.subscribe((resFlag) => {
                if (resFlag) {

                    // Loading sectors
                    let sector_res =
                        this.loaderService.getSectors('alpha', this.minShowMoreCount,
                            this.elementList['sectors'].elementsSearchString);
                    this.elementList['sectors'].loadedDataFlag = true;

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

        if (this.expRangeList.length > 0) {

            AccountService.s3Loaded$.subscribe((resFlag) => {
                if (resFlag) {
                    let exprg = this.loaderService.getExpRange();

                    this.elementList['exprange'].elements = [];
                    this.elementList['exprange'].showAddmoreFlag = false;
                    this.elementList['exprange'].elementsMapper = [];
                    let expRangeList = [];

                    exprg.forEach((res) => {

                        if (res['experience_to'] !== 100) {
                            expRangeList.push({
                                id: res['id'],
                                name: ' ' + res['experience_from'] + '-' + res['experience_to'] +
                                    ' ' + this.fixedTextHash['years'][this.currLan]
                            });
                        } else {
                            expRangeList.push({
                                id: res['id'],
                                name: ' ' + res['experience_from'] +
                                    '+ ' + this.fixedTextHash['years'][this.currLan]
                            });
                        }

                    });

                    expRangeList.forEach((selval) => {
                        let selElement = new Sector();
                        this._buildElementBody(selElement, selval, 'exprange');

                    });
                    this.exprange$.next(this.elementList['exprange']);
                }

            });

            if (this.elementList['fareas'].loadedDataFlag === false) {

                AccountService.s3Loaded$.subscribe((resFlag) => {
                    if (resFlag) {
                        this.elementList['fareas'].loadedDataFlag = true;

                        // Loading fareas
                        let func_res = this.loaderService
                            .getFunctionalAreas(this.minShowMoreSpecialCount,
                                this.elementList['fareas'].elementsSearchString);

                        this.elementList['fareas'].elements = [];
                        this.elementList['fareas'].showAddmoreFlag =
                            (this.elementList['fareas'].elementsChecked.length > 0 ||
                                func_res.length >= this.minShowMoreSpecialCount);
                        this.elementList['fareas'].elementsMapper = [];
                        func_res.forEach((selval) => {
                            let selElement = new FunctionalArea();
                            this._buildElementBody(selElement, selval, 'fareas');

                        });
                        this.fareas$.next(this.elementList['fareas']);
                    }
                    ;
                });

            }

            if (this.elementList['jobtypes'].loadedDataFlag === false) {

                AccountService.s3Loaded$.subscribe((resFlag) => {
                    if (resFlag) {
                        this.elementList['jobtypes'].loadedDataFlag = true;

                        // Loading jobTypes
                        let job_res =
                            this.loaderService.getJobTypes('auto',
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

            if (this.elementList['edulevels'].loadedDataFlag === false) {

                AccountService.s3Loaded$.subscribe((resFlag) => {
                    if (resFlag) {
                        this.elementList['edulevels'].loadedDataFlag = true;

                        // Loading Edulevels
                        let education_res =
                            this.loaderService.getJobEducations(this.minShowMoreSpecialCount,
                                this.elementList['edulevels'].elementsSearchString);

                        this.elementList['edulevels'].elements = [];
                        this.elementList['edulevels'].showAddmoreFlag =
                            (this.elementList['edulevels'].elementsChecked.length > 0
                                || education_res.length >=
                                this.minShowMoreSpecialCount);
                        this.elementList['edulevels'].elementsMapper = [];
                        education_res.forEach((selval) => {
                            let selElement = new Education();
                            this._buildElementBody(selElement, selval, 'edulevels');

                        });
                        this.edulevels$.next(this.elementList['edulevels']);
                    }
                });

            }

            if (this.elementList['explevels'].loadedDataFlag === false) {

                AccountService.s3Loaded$.subscribe((resFlag) => {
                    if (resFlag) {
                        this.elementList['explevels'].loadedDataFlag = true;

                        // Loading explevels
                        let explevel_res =
                            this.loaderService.getJobExperienceLevels(this.minShowMoreCount,
                                this.elementList['explevels'].elementsSearchString);

                        this.elementList['explevels'].elements = [];
                        this.elementList['explevels'].showAddmoreFlag =
                            (this.elementList['explevels'].elementsChecked.length > 0 ||
                                explevel_res.length > this.minShowMoreCount);
                        this.elementList['explevels'].elementsMapper = [];
                        explevel_res.forEach((selval) => {
                            let selElement = new Experience();
                            this._buildElementBody(selElement, selval, 'explevels');

                        });
                        this.explevels$.next(this.elementList['explevels']);
                    }
                });

            }

            if (this.elementList['age_group'].loadedDataFlag === false) {

                AccountService.s3Loaded$.subscribe((resFlag) => {
                    if (resFlag) {
                        this.elementList['age_group'].loadedDataFlag = true;

                        // Loading explevels
                        let res = this.loaderService.getAgeGroups();

                        this.elementList['age_group'].elements = [];
                        this.elementList['age_group'].showAddmoreFlag =
                            (this.elementList['age_group'].elementsChecked.length > 0 ||
                                res['length'] >= this.minShowMoreCount);
                        this.elementList['age_group'].elementsMapper = [];

                        res.forEach((selval) => {
                            let selElement = {id: null, name: '', selectedFlag: false};
                            this._buildElementBody(selElement, selval, 'age_group');

                        });
                        this.age_group$.next(this.elementList['age_group']);
                    }
                });

            }

            if (this.elementList['language'].loadedDataFlag === false) {

                AccountService.s3Loaded$.subscribe((resFlag) => {
                    if (resFlag) {
                        this.elementList['language'].loadedDataFlag = true;

                        // Loading explevels
                        let lan_res = this.loaderService.getLanguages(this.minShowMoreCount);

                        this.elementList['language'].elements = [];
                        this.elementList['language'].showAddmoreFlag =
                            (this.elementList['language'].elementsChecked.length > 0 ||
                                lan_res.length >= this.minShowMoreCount);
                        this.elementList['language'].elementsMapper = [];
                        lan_res.forEach((selval) => {
                            let selElement = {id: null, name: '', selectedFlag: false};
                            this._buildElementBody(selElement, selval, 'language');
                        });
                        this.language$.next(this.elementList['language']);
                    }
                });

            }

            if (this.elementList['gender'].loadedDataFlag === false) {
                this.elementList['gender'].loadedDataFlag = true;
                let res = (this.currLan === 'en') ?

                    [{id: '1', name: 'Male', code: 'male'}, {
                        id: '2',
                        name: 'Female',
                        code: 'female'
                    }] :
                    [{id: '1', name: 'ذكر', code: 'male'}, {id: '2', code: 'female', name: 'أنثي'}]

                ;
                this.elementList['gender'].elements = [];
                this.elementList['gender'].showAddmoreFlag =
                    (this.elementList['gender'].elementsChecked.length > 0 ||
                        res.length >= this.minShowMoreCount);
                this.elementList['gender'].elementsMapper = [];
                res.forEach((selval) => {
                    let selElement = {id: null, name: '', selectedFlag: false};
                    this._buildElementBody(selElement, selval, 'gender');
                });
                this.gender$.next(this.elementList['gender']);
            }

            if (this.elementList['notice_period'].loadedDataFlag == false) {

                AccountService.s3Loaded$.subscribe((resFlag) => {
                    if (resFlag) {
                        this.elementList['notice_period'].loadedDataFlag = true;

                        let res = [];
                        this.loaderService.getNoticePeriod().forEach((selv) => {
                            res.push({id: parseInt(selv.id), name: selv.name + ' Months'});
                        });
                        this.elementList['notice_period'].elements = [];
                        this.elementList['notice_period'].showAddmoreFlag =
                            (this.elementList['notice_period'].elementsChecked.length > 0 ||
                                res.length >= this.minShowMoreCount);
                        this.elementList['notice_period'].elementsMapper = [];
                        res.forEach((selval) => {
                            let selElement = {id: null, name: '', selectedFlag: false};
                            this._buildElementBody(selElement, selval, 'notice_period');
                        });

                        this.notice_period$.next(this.elementList['notice_period']);
                    }
                });

            }

            if (this.elementList['last_active'].loadedDataFlag == false) {

                AccountService.s3Loaded$.subscribe((resFlag) => {
                    if (resFlag) {
                        this.elementList['last_active'].loadedDataFlag = true;

                        let res = [{id: '1 week', name: '1 Week'}, {
                            id: '1 month',
                            name: '1 Month'
                        }, {id: '3 months', name: '3 Months'}, {id: '6 months', name: '6 Months'}];

                        this.elementList['last_active'].elements = [];
                        this.elementList['last_active'].showAddmoreFlag =
                            (this.elementList['last_active'].elementsChecked.length > 0 ||
                                res.length >= this.minShowMoreCount);
                        this.elementList['last_active'].elementsMapper = [];
                        res.forEach((selval) => {
                            let selElement = {id: null, name: '', selectedFlag: false};
                            this._buildElementBody(selElement, selval, 'last_active');
                        });

                        this.last_active$.next(this.elementList['last_active']);
                    }
                });

            }

            if (this.elementList['visa_status'].loadedDataFlag == false) {

                AccountService.s3Loaded$.subscribe((resFlag) => {
                    if (resFlag) {
                        this.elementList['visa_status'].loadedDataFlag = true;

                        let visa_res = this.loaderService.getVisaStatus();
                        this.elementList['visa_status'].elements = [];
                        this.elementList['visa_status'].showAddmoreFlag =
                            (this.elementList['visa_status'].elementsChecked.length > 0 ||
                                visa_res.length >= this.minShowMoreCount);
                        this.elementList['visa_status'].elementsMapper = [];
                        visa_res.forEach((selval) => {
                            let selElement = {id: null, name: '', selectedFlag: false};
                            this._buildElementBody(selElement, selval, 'visa_status');
                        });
                        this.visa_status$.next(this.elementList['visa_status']);
                    }
                });

            }

            if (this.elementList['job_type'].loadedDataFlag === false) {

                AccountService.s3Loaded$.subscribe((resFlag) => {
                    if (resFlag) {
                        this.elementList['job_type'].loadedDataFlag = true;

                        let job_res = this.loaderService.getJobTypes();

                        this.elementList['job_type'].elements = [];
                        this.elementList['job_type'].showAddmoreFlag =
                            (this.elementList['job_type'].elementsChecked.length > 0 ||
                                job_res.length >= this.minShowMoreCount);
                        this.elementList['job_type'].elementsMapper = [];

                        job_res.forEach((selval) => {
                            let selElement = {id: null, name: '', selectedFlag: false};
                            this._buildElementBody(selElement, selval, 'job_type');
                        });

                        this.job_type$.next(this.elementList['job_type']);
                    }
                });

            }

            if (this.elementList['current_sal'].loadedDataFlag === false ||
                this.elementList['expect_sal'].loadedDataFlag === false) {

                AccountService.s3Loaded$.subscribe((resFlag) => {
                    if (resFlag) {
                        let res_sal = this.getSalaryRange();

                        if (this.elementList['current_sal'].loadedDataFlag === false) {

                            // If empty do not set true
                            if (res_sal.length > 0) {
                                this.elementList['current_sal'].loadedDataFlag = true;
                            }

                            // Loading jobTypes

                            this.elementList['current_sal'].elements = [];
                            this.elementList['current_sal'].showAddmoreFlag =
                                (this.elementList['current_sal'].elementsChecked.length > 0 ||
                                    res_sal.length >= this.minShowMoreCount);
                            this.elementList['current_sal'].elementsMapper = [];
                            res_sal.forEach((selval) => {
                                let selElement = new SalaryRange();
                                this._buildElementBody(selElement, selval, 'current_sal');

                            });

                            this.current_sal$.next(this.elementList['current_sal']);
                        }

                        if (this.elementList['expect_sal'].loadedDataFlag == false) {

                            // If empty do not set true
                            if (res_sal.length > 0) {
                                this.elementList['expect_sal'].loadedDataFlag = true;
                            }

                            let res1 = this.getSalaryRange();

                            this.elementList['expect_sal'].elements = [];
                            this.elementList['expect_sal'].showAddmoreFlag =
                                (this.elementList['expect_sal'].elementsChecked.length > 0 ||
                                    res1.length >= this.minShowMoreCount);
                            this.elementList['expect_sal'].elementsMapper = [];
                            res1.forEach((selval) => {
                                let selElement = new SalaryRange();
                                this._buildElementBody(selElement, selval, 'expect_sal');

                            });

                            this.expect_sal$.next(this.elementList['expect_sal']);

                        }
                    }
                });

            }

        }
    }

    public numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    public _buildElementBody(selElement, selval, key) {

        selElement.id = selval.id;
        if (key === 'expect_sal' || key === 'current_sal') {

            if (selval.salary_to > 100000) {
                selElement.name = '10k+';

            } else {
                selElement.name = this.numberWithCommas(selval.salary_from) + '-' +
                    this.numberWithCommas(selval.salary_to);
            }

        } else if (key === 'age_group') {
            if (selval.max_age > 60) {
                selElement.name = selval.min_age + '+';
            } else {
                selElement.name = selval.min_age + '-' + selval.max_age;
            }
        } else{
            selElement.name = selval.name;
        }

        selElement.selectedFlag = false;
        if (this.elementList[key].elementsChecked.indexOf(selval.id) != -1) {
            selElement.selectedFlag = true;
        }
        this.elementList[key].elements.push(selElement);
        this.elementList[key].elementsMapper.push(selElement.id);

    }

    public getSalaryRange() {

        if (this.salaryLevels.length === 0) {
            let res = this.loaderService.getSalaryRanges();
            this.salaryLevels = res;
            return this.salaryLevels;

        } else {
            return this.salaryLevels;
        }

    }

    public onApply() {
        let params = {queryParams: this.paramsList};

        this.filters.forEach((selFilter) => {

            if (this.elementList[selFilter].elementsChecked.length > 0){
                params['queryParams'][selFilter] = this.elementList[selFilter].elementsChecked;
            }
        });

        if (this.orderBy){
            params['queryParams']['order'] = this.orderBy;
        }

        this._router.navigate([this.page], params);
    }

    public onResetUrl() {

        this.paramsList = {};
        if (this.orderBy) {
            this._router.navigate([this.page],
                {queryParams: {id: this.id, order: this.orderBy}});
        } else {
            this._router.navigate([this.page]);
        }
    }

    public onReset() {

        this.getInitialize();
        this.getLoadData();
    }

    public getLoadData() {

        // URL Params Fetch
        this.currLan = this.accountService.getCurrLang();
        this.params$ = this._activeRoute.params.subscribe((params) => {

            this.id = params['id'];

            // this.page = "/jobs/"+this.id+"/applicants";
            this.queryParams$ = this._activeRoute.queryParams.subscribe((qparams) => {

                this.paramsList = {};
                if (qparams) {
                    Object.assign(this.paramsList, qparams);
                }

                this.resetFilter = false;
                if ((qparams['order'] && this.orderBy == null) ||
                    ((!qparams['order']) && this.orderBy != null)) {
                    this.resetFilter = true;
                }

                if (qparams['order']) {
                    this.orderBy = qparams['order'];

                } else {

                    this.orderBy = null;

                }
                if (this.resetFilter) {
                    this.onResetUrl();
                }

                this.filters.forEach((selfilter) => {

                    this.elementList[selfilter].elementsChecked =
                        this._getBuildParamsUrl(qparams[this.paramsHash[selfilter]], selfilter);
                    this.elementList[selfilter].elementsSearchString = qparams;
                });

                this.getFetchData();

                // For Remove tags Feature
                this.getResetSelectTags();

            });

        });
    }

    public getResetSelectTags() {

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
    }

}
