import { OnInit, Input, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationEnd } from '@angular/router';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

// service
import { LoaderService } from '../../../shared/services/loader.service';
import { AccountService } from '../../../core/account/services/account.service';
import { JobService } from '../../../core/services/job.service';
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
    selector: 'filters-with-candidates-count',
    templateUrl: 'filtersWithCandidatesCount.component.html',
    styleUrls: ['./filtersWithCandidatesCount.scss']
})

export class FiltersWithCandidatesCountComponent implements OnInit, OnDestroy {

    // Observables
    public queryParams$;
    public params$;
    public minShowMoreCount = 5;
    public minShowMoreSpecialCount = 25;
    public resetFilter = false;
    public showFilter = false;
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
    public loadedData: boolean = false;

    public universitiesExcep: any;
    public degreeExcep: any;

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
        exprange: 'exprange',
        school_in: 'school_in',
        field_of_study_in: 'field_of_study_in'
    };
    public expRangeList = [{ id: 1, name: '0 - 1 years' }, { id: 2, name: '2 - 3 years' }, {
        id: 3,
        name: '3 - 4 years'
    }];
    public id;

    @Input() public page: string = '/jobs/applicants';
    @Input() public jobId: number = 0;

    // Members
    public elementList = [];
    public filters = ['locations', 'cities', 'sectors', 'fareas', 'jobtypes', 'current_sal',
        'expect_sal', 'edulevels', 'explevels', 'companies', 'age_group', 'language', 'gender',
        'notice_period', 'last_active', 'visa_status', 'job_type', 'nationality', 'exprange'
        , 'school_in', 'field_of_study_in'];

    public specialCaseList = ['gender', 'last_active'];
    public singleCheckList = ['last_active'];
    public currLan = 'en';
    public fixedTextHash = this.loaderService.getFixedText();
    public filtersObj: any;

    public constructor(public loaderService: LoaderService,
        public _router: Router,
        public accountService: AccountService,
        public jobService: JobService,
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

        let res = this.filtersObj['count_applicants_by_city'];
        this.elementList['cities'].showAddmoreFlag =
            (this.elementList['cities'].elementsChecked.length > 0 ||
                res.length >= this.minShowMoreCount);

        this.elementList['cities'].elements = [];
        this.elementList['cities'].elementsMapper = [];
        res.forEach((selval) => {
            if (this.elementList['locations'].elementsChecked.includes(selval.country_id)) {
                let city = new City();
                city.id = selval.id;
                city.name = selval.name;
                city.applicants_count = selval.applicants_count;
                city.country_id = selval.country_id;
                city.selectedFlag = false;
                if (this.elementList['cities'].elementsChecked.indexOf(selval.id) != -1) {
                    city.selectedFlag = true;
                }
                this.elementList['cities'].elements.push(city);
                this.elementList['cities'].elementsMapper.push(city.id);
            }

        });

        this.cities$.next(this.elementList['cities']);
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
                selElement = { id: null, name: '', selectedFlag: false };
            }
            if (key === 'exprange') {
                selElement = { id: null, name: '', selectedFlag: false };
            }
            if (key === 'language') {
                selElement = { id: null, name: '', selectedFlag: false };
            }
            if (key === 'gender') {
                selElement = { id: null, name: '', selectedFlag: false };
            }
            if (key === 'notice_period') {
                selElement = { id: null, name: '', selectedFlag: false };
            }
            if (key === 'last_active') {
                selElement = { id: null, name: '', selectedFlag: false };
            }
            if (key === 'nationality') {
                selElement = { id: null, name: '', selectedFlag: false };
            }
            if (key === 'exprange') {
                selElement = { id: null, name: '', selectedFlag: false };
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
            selElement.applicants_count = $event.applicants_count;
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

    // Mohamed Yakout
    public getFetchFiltersWithCount(jobId: number) {
        this.loadedData = false;
        this.jobService.getJobApplicantsFilter(jobId).subscribe((res) => {
            this.filtersObj = res['filters'];


            if (this.elementList['locations'].loadedDataFlag === false) {
                this.elementList['locations'].loadedDataFlag = true;
                let res = this.filtersObj['count_applicants_by_country'];

                res.forEach((selval) => {
                    this.elementList['locations'].elements = [];
                    this.elementList['locations'].showAddmoreFlag =
                        (this.elementList['locations'].elementsChecked.length > 0 ||
                            res.length >= this.minShowMoreCount);
                    this.elementList['locations'].elementsMapper = [];
                    res.forEach((selVal) => {
                        let selElement = new Country();
                        this._buildElementBody(selElement, selVal, 'locations');
                    });
                    this.locations$.next(this.elementList['locations']);

                    // Loading Cities
                    this._loadCities();
                });

            }

            if (this.elementList['sectors'].loadedDataFlag === false) {

                // Loading sectors
                let sector_res = this.filtersObj['count_applicants_by_sector'];
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

            if (this.elementList['fareas'].loadedDataFlag === false) {
                this.elementList['fareas'].loadedDataFlag = true;
                // Loading fareas
                let func_res = this.filtersObj['count_applicants_by_functional_area'];
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

            let expRangeList = this.filtersObj['count_applicants_by_experience_range'];

            this.elementList['exprange'].elements = [];
            this.elementList['exprange'].showAddmoreFlag = false;
            this.elementList['exprange'].elementsMapper = [];
            expRangeList.forEach((selval) => {
                let selElement = new Sector();
                this._buildElementBody(selElement, selval, 'exprange');

            });
            this.exprange$.next(this.elementList['exprange']);

            if (this.elementList['edulevels'].loadedDataFlag === false) {
                this.elementList['edulevels'].loadedDataFlag = true;

                // Loading Edulevels
                let education_res = this.filtersObj['count_applicants_by_job_education'];

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

            if (this.elementList['current_sal'].loadedDataFlag === false ||
                this.elementList['expect_sal'].loadedDataFlag === false) {

                let res_sal = this.filtersObj['count_applicants_by_current_salary_range'];

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

                    let res1 = this.filtersObj['count_applicants_by_expected_salary_range'];

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

            if (this.elementList['age_group'].loadedDataFlag === false) {

                this.elementList['age_group'].loadedDataFlag = true;

                // Loading explevels
                let res = this.filtersObj['count_applicants_by_age_range'];

                this.elementList['age_group'].elements = [];
                this.elementList['age_group'].showAddmoreFlag =
                    (this.elementList['age_group'].elementsChecked.length > 0 ||
                        res['length'] >= this.minShowMoreCount);
                this.elementList['age_group'].elementsMapper = [];

                res.forEach((selval) => {
                    let selElement = { id: null, name: '', selectedFlag: false };
                    this._buildElementBody(selElement, selval, 'age_group');

                });
                this.age_group$.next(this.elementList['age_group']);

            }

            if (this.elementList['gender'].loadedDataFlag === false) {
                this.elementList['gender'].loadedDataFlag = true;
                let res = this.filtersObj['count_applicants_by_gender'];

                this.elementList['gender'].elements = [];
                this.elementList['gender'].showAddmoreFlag =
                    (this.elementList['gender'].elementsChecked.length > 0 ||
                        res.length >= this.minShowMoreCount);
                this.elementList['gender'].elementsMapper = [];
                res.forEach((selval) => {
                    let selElement = { id: null, name: '', selectedFlag: false };
                    this._buildElementBody(selElement, selval, 'gender');
                });
                this.gender$.next(this.elementList['gender']);
            }

            if (this.elementList['notice_period'].loadedDataFlag == false) {

                this.elementList['notice_period'].loadedDataFlag = true;

                let res = [];
                this.filtersObj['count_applicants_by_notice_period'].forEach((selv) => {
                    res.push({
                        id: this.getNoticePeriodId(selv.notice_period), name: selv.notice_period +
                            (selv.notice_period === 1) ? ' ' +
                            selv.notice_period + ' ' + this.fixedTextHash['month'][this.currLan] :
                            selv.notice_period + ' ' + this.fixedTextHash['months'][this.currLan],
                        applicants_count: selv.applicants_count
                    });
                });
                this.elementList['notice_period'].elements = [];
                this.elementList['notice_period'].showAddmoreFlag =
                    (this.elementList['notice_period'].elementsChecked.length > 0 ||
                        res.length >= this.minShowMoreCount);
                this.elementList['notice_period'].elementsMapper = [];
                res.forEach((selval) => {
                    let selElement = { id: null, name: '', selectedFlag: false };
                    this._buildElementBody(selElement, selval, 'notice_period');
                });

                this.notice_period$.next(this.elementList['notice_period']);

            }

            if (this.elementList['visa_status'].loadedDataFlag == false) {

                this.elementList['visa_status'].loadedDataFlag = true;

                let visa_res = this.filtersObj['count_applicants_by_visa_status'];
                this.elementList['visa_status'].elements = [];
                this.elementList['visa_status'].showAddmoreFlag =
                    (this.elementList['visa_status'].elementsChecked.length > 0 ||
                        visa_res.length >= this.minShowMoreCount);
                this.elementList['visa_status'].elementsMapper = [];
                visa_res.forEach((selval) => {
                    let selElement = { id: null, name: '', selectedFlag: false };
                    this._buildElementBody(selElement, selval, 'visa_status');
                });
                this.visa_status$.next(this.elementList['visa_status']);

            }

            if (this.elementList['job_type'].loadedDataFlag === false) {

                this.elementList['job_type'].loadedDataFlag = true;

                let job_res = this.filtersObj['count_applicants_by_job_type'];

                this.elementList['job_type'].elements = [];
                this.elementList['job_type'].showAddmoreFlag =
                    (this.elementList['job_type'].elementsChecked.length > 0 ||
                        job_res.length >= this.minShowMoreCount);
                this.elementList['job_type'].elementsMapper = [];

                job_res.forEach((selval) => {
                    let selElement = { id: null, name: '', selectedFlag: false };
                    this._buildElementBody(selElement, selval, 'job_type');
                });

                this.job_type$.next(this.elementList['job_type']);

            }

            if (this.elementList['nationality'].loadedDataFlag == false) {
                this.elementList['nationality'].loadedDataFlag = true;

                let res = this.filtersObj['count_applicants_by_country'];
                this.elementList['nationality'].elements = [];
                this.elementList['nationality'].showAddmoreFlag =
                    (this.elementList['nationality'].elementsChecked.length > 0 ||
                        res.length >= this.minShowMoreCount);
                this.elementList['nationality'].elementsMapper = [];

                res.forEach((selval) => {
                    let selElement = { id: null, name: '', selectedFlag: false };
                    this._buildElementBody(selElement, selval, 'nationality');
                });

                this.nationality$.next(this.elementList['nationality']);
            }
            if (this.elementList['school_in'].elementsChecked.length > 0) {
                let uniParams;
                uniParams = this.paramsList['school_in'];
                if (!Array.isArray(uniParams)) {
                    uniParams = [uniParams];
                }
                this.universitiesExcep = uniParams;
            } else {
                this.universitiesExcep = [];
            }

            if (this.elementList['field_of_study_in'].elementsChecked.length > 0) {
                var degreeParams;
                degreeParams = this.paramsList['field_of_study_in'];
                if (!Array.isArray(degreeParams)) {
                    degreeParams = [degreeParams];
                }
                this.degreeExcep = degreeParams;
            } else {
                this.degreeExcep = [];
            }
            this.loadedData = true;
        });
    }

    public numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    public getGender(genderId) {
        return (genderId === 1) ? this.fixedTextHash['male'][this.currLan] :
            (genderId === 2) ? this.fixedTextHash['female'][this.currLan] : genderId;
    }

    public getNoticePeriodId(period = null) {
        return (period) ? period : 0;
    }

    public _buildElementBody(selElement, selval, key) {

        selElement.id = (key === 'gender') ? selval.gender : selval.id;
        selElement.applicants_count = selval.applicants_count;
        if (key === 'exprange' || key === 'expect_sal' || key === 'current_sal' ||
            key === 'age_group') {
            selElement.name = selval.range;
        } else if (key === 'gender') {
            selElement.name = this.getGender(selval.gender);
        } else {
            selElement.name = selval.name;
        }
        // Excluding null values
        if (!selElement.name) {
            return;
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

    // public onApply() {
    //     let params = { queryParams: this.paramsList };

    //     this.filters.forEach((selFilter) => {

    //         if (this.elementList[selFilter].elementsChecked.length > 0) {
    //             params['queryParams'][selFilter] = this.elementList[selFilter].elementsChecked;
    //         }
    //     });

    //     if (this.orderBy) {
    //         params['queryParams']['order'] = this.orderBy;
    //     }
    // }

    public onApply() {
        let params = { queryParams: this.paramsList };
        //For University:START
        var univerisityParams = this.paramsList['school_in'];
        if (univerisityParams && !Array.isArray(univerisityParams)) {
            univerisityParams = [univerisityParams];
        }
        var degreeParams = this.paramsList['field_of_study_in'];
        if (degreeParams && !Array.isArray(degreeParams)) {
            degreeParams = [degreeParams];
        }
        //For University : END

        this.filters.forEach((selFilter) => {
            if (selFilter != 'school_in' && selFilter != 'field_of_study_in') {
                if (this.elementList[selFilter].elementsChecked.length > 0) {
                    params['queryParams'][selFilter] = this.elementList[selFilter].elementsChecked;
                }
            }
        });

        //For University:START
        if (univerisityParams && univerisityParams.length > 0) {
            this.paramsList['school_in'] = []
            univerisityParams.forEach(item => {
                this.paramsList['school_in'].push(item)
            });
        }
        if (degreeParams && degreeParams.length > 0) {
            this.paramsList['field_of_study_in'] = []
            degreeParams.forEach(item => {
                this.paramsList['field_of_study_in'].push(item)
            });
        }
        //For University : END

        if (this.orderBy) {
            params['queryParams']['order'] = this.orderBy;
        }
    }

    public onResetUrl() {

        this.paramsList = {};
        if (this.orderBy) {
            this._router.navigate([this.page],
                { queryParams: { id: this.id, order: this.orderBy } });
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

                if (this.jobId > 0) {
                    this.id = this.jobId;
                }
                else {
                    this.id = params['id'];
                }
                this.jobId = this.id;

                // this.getFetchData();
                this.getFetchFiltersWithCount(this.id);

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

    public onSelectUniversity(event) {
        this.toggleMultiSelectElement(event.key, event.name.trim(), event.type)
    }

    public toggleMultiSelectElement(key, value, type) {
        let params = { queryParams: this.paramsList };
        let uniParams;
        uniParams = this.paramsList[key];
        if (!Array.isArray(uniParams)) {
            uniParams = [uniParams];
        }
        if (type == 'add') {
            if (this.paramsList[key]) {
                this.paramsList[key] = [];
                if (uniParams.length > 0) {
                    uniParams.forEach(item => {
                        if (item != value) {
                            this.paramsList[key].push(item)
                        }
                    });
                }
                this.paramsList[key].push(value);
            }
            else {
                this.paramsList[key] = [];
                this.paramsList[key].push(value);
            }
        }
        else {
            if (uniParams.length > 0) {
                this.paramsList[key] = [];
                uniParams.forEach(item => {
                    if (item != value) {
                        this.paramsList[key].push(item);
                    }
                });
            }
        }
        if (key == 'school_in') {
            this.universitiesExcep = this.paramsList[key];
        }
        else {
            this.degreeExcep = this.paramsList[key];
        }
        if (this.orderBy) {
            params['queryParams']['order'] = this.orderBy;
        }
        if (params['queryParams']['page']) {
            delete params['queryParams']['page'];
        }
        // this._router.navigate([this.page], params);
    }

    public onApplyFilter() {
        this._router.events.subscribe((evt) => {
            if (evt instanceof NavigationEnd) {
                this._router.navigated = false;
                window.scrollTo(0, 0);
            }
        });
        let params = { queryParams: this.paramsList };
        this._router.navigate([this.page], params);
    }

}
