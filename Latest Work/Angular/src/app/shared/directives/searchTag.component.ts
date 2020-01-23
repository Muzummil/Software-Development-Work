import { OnInit, Input, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// Directives
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router } from '@angular/router';
import { LoaderService } from '../services/loader.service';
import { AccountService } from '../../core/account/services/account.service';

@Component({

    selector: 'search-tag-module',
    styleUrls: ['./searchTag.scss'],
    templateUrl: './searchTag.component.html'
})

export class SearchTagComponent implements OnInit {

// Observables
    public queryParams$;
    public activeRouterObs;
    public filterList$: BehaviorSubject<any> = new BehaviorSubject(null);

// hash keys
    public paramsHash = {
        locations: 'locations',
        cities: 'cities',
        sectors: 'sectors',
        fareas: 'fareas',
        jobtypes: 'jobtypes',
        salarylevels: 'salarylevels',
        edulevels: 'edulevels',
        explevels: 'explevels',
        companies: 'companies',
        nationality: 'nationality',
        job_type: 'job_type',
        visa_status: 'visa_status',
        language: 'language',
        age_group: 'age_group',
        expect_sal: 'expect_sal',
        current_sal: 'current_sal',
        gender: 'gender',
        marital_status: 'marital_status',
        notice_period: 'notice_period',
        last_active: 'last_active',
        exprange: 'exprange'
    };

    public paramsList = ['locations', 'cities', 'sectors', 'fareas', 'jobtypes', 'salarylevels', 'edulevels',
        'explevels', 'companies', 'nationality', 'job_type', 'visa_status', 'language', 'age_group', 'expect_sal',
        'current_sal', 'gender', 'marital_status', 'notice_period', 'last_active', 'exprange'];
    public filterList = {
        locations: [],
        cities: [],
        sectors: [],
        fareas: [],
        jobtypes: [],
        salarylevels: [],
        edulevels: [],
        explevels: [],
        companies: [],
        nationality: [],
        job_type: [],
        visa_status: [],
        language: [],
        age_group: [],
        expect_sal: [],
        current_sal: [],
        gender: [],
        marital_status: [],
        notice_period: [],
        last_active: [],
        exprange: []
    };

    public pagination_url = {};
    public pages = [];

//Input
    @Input() url: string = '/jobs';
    @Input() currentPage: number = 1;
    @Input() totalPages: number = 0;
    @Input() titleObs: BehaviorSubject<any>;
    @Input() loctitleObs: BehaviorSubject<any>;
    @Input() search_tagsObs: BehaviorSubject<any>;

    public constructor(public _router: Router,
                       public _activeRoute: ActivatedRoute,
                       public loaderService: LoaderService) {
    }

    public _rebuildPageURL(type) {
        let arryList = [];
        this.filterList[this.paramsHash[type]].forEach((selFilter) => {
            arryList.push(selFilter.id);
        });
        if (arryList.length == 0) {
            delete this.pagination_url[this.paramsHash[type]];
        } else {
            this.pagination_url[this.paramsHash[type]] = arryList;

        }
    }

    public onClickTag(index: number, type: string) {

        if (type == 'loctitle') {
            this.titleObs.next('');
            delete this.pagination_url['loctitle'];

        } else if (type == 'title') {
            this.titleObs.next('');
            delete this.pagination_url['title'];

        } else {

            if (type == 'locations') {
                let citesToRemove = [];
                let newCityList = [];
                this.filterList[this.paramsHash['cities']].forEach((selFilter, city_index) => {

                    if (selFilter.country.id != this.filterList[this.paramsHash[type]][index].id) {
                        newCityList.push(selFilter);
                    }
                });

                this.filterList[this.paramsHash['cities']] = newCityList;
                this.filterList$.next(this.filterList);
                this._rebuildPageURL('cities');
            }

            this.filterList[this.paramsHash[type]].splice(index, 1);
            this.filterList$.next(this.filterList);
            this._rebuildPageURL(type);

        }

        this.restPageNo();
        this._router.navigate([this.url], {queryParams: this.pagination_url});

    }

    public restPageNo() {

        if (this.pagination_url['page']) {
            this.pagination_url['page'] = 1;
        }
    }

    public ngOnDestroy() {
        this.queryParams$.unsubscribe();
    }

    public restFilter(selparams) {

        this.filterList[selparams] = [];
        this.filterList$.next(this.filterList);
    }

    ngOnInit() {

        this.search_tagsObs.subscribe((res) => {

            this.paramsList.forEach((selparams) => {
                if (res[this.paramsHash[selparams]] && res[this.paramsHash[selparams]].length > 0) {

                    AccountService.s3Loaded$.subscribe((resFlag) => {
                        if (resFlag) {
                            if (selparams === 'locations') {
                                this.loaderService.getGeneralCountries('auto', res, '')
                                    .subscribe((res2) => {
                                    this.filterList.locations = res2;
                                    this.filterList$.next(this.filterList);
                                });
                            }

                            if (selparams === 'nationality')
                                this.loaderService.getNationality('auto', res, '')
                                    .subscribe((res2) => {
                                    this.filterList.nationality = res2;
                                    this.filterList$.next(this.filterList);

                                });

                            if (selparams === 'cities')
                                this.loaderService.getCitiesList([], res, 10, '')
                                    .subscribe((res2) => {

                                    this.filterList.cities = res2;
                                    this.filterList$.next(this.filterList);

                                });

                            if (selparams === 'sectors') {
                                let res2 = this.loaderService.getSectorTags('auto', res);
                                this.filterList.sectors = res2;
                                this.filterList$.next(this.filterList);

                            }

                            if (selparams === 'gender') {

                                let genderSelList = [];
                                let postgenderList = res['gender'].toString().split(',');

                                let genderList = [{id: 1, name: 'Male', code: 'male'}, {
                                    id: 2,
                                    name: 'Female',
                                    code: 'female'
                                }];
                                genderList.forEach((selGender) => {

                                    if (postgenderList.indexOf(selGender['id'].toString()) != -1) {
                                        genderSelList.push(selGender);
                                    }

                                });
                                this.filterList.gender = genderSelList;
                                this.filterList$.next(this.filterList);
                            }

                            if (selparams === 'marital_status') {

                                let marital_statusSelList = [];
                                let postmarital_statusList =
                                    res['marital_status'].toString().split(',');

                                let marital_statusList = this.loaderService.getMaritalStatus2();
                                marital_statusList.forEach((selMarital_status) => {

                                    if (postmarital_statusList
                                        .indexOf(selMarital_status['id'].toString()) != -1) {
                                        marital_statusSelList.push(selMarital_status);
                                    }

                                });
                                this.filterList.marital_status = marital_statusSelList;
                                this.filterList$.next(this.filterList);
                            }

                            if (selparams === 'exprange') {

                                let exprangeSelList = [];
                                let exprangeList = [];
                                let postexprangeList = res['exprange'].toString().split(',');

                                let exprg = this.loaderService.getExpRange();
                                exprg.forEach((res) => {

                                    if (res['experience_to'] != 100) {
                                        exprangeList.push({
                                            id: res['id'],
                                            name: ' ' + res['experience_from'] + ' - ' +
                                                res['experience_to'] + ' years'
                                        });
                                    } else {
                                        exprangeList.push({
                                            id: res['id'],
                                            name: ' ' + res['experience_from'] + '+ years'
                                        });
                                    }
                                });

                                exprangeList.forEach((selRange) => {

                                    if (postexprangeList.indexOf(selRange['id'].toString()) != -1) {
                                        exprangeSelList.push(selRange);
                                    }
                                });

                                this.filterList.exprange = exprangeSelList;
                                this.filterList$.next(this.filterList);

                            }

                            if (selparams == 'notice_period') {

                                let noticePeriodSelList = [];
                                let postNoticePeriodList = res['notice_period'].toString()
                                    .split(',');

                                let noticePeriodList = this.loaderService.getNoticePeriod();
                                noticePeriodList.forEach((selNoticePeriod) => {

                                    if (postNoticePeriodList.indexOf(selNoticePeriod['id']) != -1) {
                                        selNoticePeriod['name'] = selNoticePeriod['name'];
                                        noticePeriodSelList.push(selNoticePeriod);
                                    }

                                });
                                this.filterList.notice_period = noticePeriodSelList;
                                this.filterList$.next(this.filterList);
                            }

                            if (selparams == 'last_active') {

                                let noticeLastActiveSelList = [];
                                let postLastActiveList = res['last_active'].toString().split(',');

                                let noticeLastActiveList = this.loaderService.getLastActive();
                                noticeLastActiveList.forEach((selLastActice) => {
                                    if (postLastActiveList.indexOf(selLastActice['id']) != -1) {
                                        noticeLastActiveSelList.push(selLastActice);
                                    }

                                });
                                this.filterList.last_active = noticeLastActiveSelList;
                                this.filterList$.next(this.filterList);
                            }

                            if (selparams === 'expect_sal' || selparams === 'current_sal') {
                                let res2 = this.loaderService.getSalaryRanges(res);

                                if (selparams == 'expect_sal') {
                                    this.filterList.expect_sal =
                                        this._buildSalaryList(res, res2, 'expect_sal');
                                }
                                if (selparams == 'current_sal') {
                                    this.filterList.current_sal =
                                        this._buildSalaryList(res, res2, 'current_sal');
                                }
                                this.filterList$.next(this.filterList);

                            }

                            if (selparams === 'language') {
                                let lan_res = this.loaderService.getLanguages('auto', res);
                                this.filterList.language = lan_res;
                                this.filterList$.next(this.filterList);
                            }

                            if (selparams === 'age_group') {
                                let age_group_res = this.loaderService
                                    .getGeneralAgeGroups('auto', res);

                                let ageList = [];
                                age_group_res.forEach((selval) => {
                                    if (selval.max_age > 60) {
                                        ageList.push({id: selval.id, name: selval.min_age + '+'});
                                    } else {
                                        ageList.push({
                                            id: selval.id,
                                            name: selval.min_age + '-' + selval.max_age
                                        });
                                    }
                                });

                                this.filterList.age_group = ageList;
                                this.filterList$.next(this.filterList);
                            }

                            if (selparams === 'visa_status') {
                                this.filterList.visa_status = this.loaderService
                                    .getVisaStatus('auto', res);
                                this.filterList$.next(this.filterList);
                            }

                            if (selparams === 'job_type') {
                                this.filterList.job_type = this.loaderService
                                    .getJobTypes('auto', res, true);
                                this.filterList$.next(this.filterList);
                            }

                            if (selparams === 'fareas') {

                                let func_res = this.loaderService
                                    .getFunctionalAreas('auto', res);
                                this.filterList.fareas = func_res;
                                this.filterList$.next(this.filterList);
                            }

                            if (selparams === 'jobtypes') {
                                this.filterList.jobtypes = this.loaderService
                                    .getJobTypes('auto', res, true);
                                this.filterList$.next(this.filterList);
                            }

                            if (selparams === 'salarylevels') {

                                let res2 = this.loaderService.getSalaryRanges(res);
                                this.filterList.salarylevels = res2;
                                this.filterList$.next(this.filterList);

                            }

                            if (selparams === 'edulevels') {
                                this.filterList.edulevels = this.loaderService
                                    .getJobEducations('auto', res);
                                this.filterList$.next(this.filterList);

                            }

                            if (selparams === 'explevels') {
                                this.filterList.explevels = this.loaderService
                                    .getJobExperienceLevels('auto', res);
                                this.filterList$.next(this.filterList);
                            }

                            if (selparams ==='companies')
                                this.loaderService.getCompanies('auto', res)
                                    .subscribe((res2) => {
                                    this.filterList.companies = res2;
                                    this.filterList$.next(this.filterList);

                                });
                        }
                    });

                } else {
                    this.restFilter(selparams);
                }

            });

        });
        this.buildPages();
    }

    public numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    public _buildSalaryList(res, res2, key) {

        let salIdList = res[key].toString().split(',');

        let Sal = [];
        res2.forEach((selSal) => {
            if (salIdList.indexOf(selSal.id.toString()) != -1) {

                if (selSal.salary_to > 10000) {
                    Sal.push({id: selSal.id, name: this.numberWithCommas(10000) + '+'});
                } else {
                    Sal.push({
                        id: selSal.id,
                        name: this.numberWithCommas(selSal.salary_from) + '-' +
                            this.numberWithCommas(selSal.salary_to)
                    });

                }

            }
        });

        return Sal;

    }

    public buildPages() {
        this.queryParams$ = this._activeRoute.queryParams.subscribe((params) => {
            this.pagination_url = {};
            for (let key in params) {
                if (params.hasOwnProperty(key)) {
                    this.pagination_url[key] = params[key];
                }

            }

        });
    }
}
