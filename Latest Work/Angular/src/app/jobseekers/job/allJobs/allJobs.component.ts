import { Component, OnInit, EventEmitter, Output, Input, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

let moment = require('moment');

// Service
import { JobseekerJobService } from './../services/jobseekerJob.service';
import { AccountService } from '../../../core/account/services/account.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { ConfigService } from '../../../shared/config.service';

declare var jQuery;

@Component({
    selector: 'all-jobs',
    templateUrl: 'allJobs.component.html',
    styleUrls: ['./allJobs.scss']
})

export class AllJobsComponent implements OnInit, OnDestroy {

    @Output() jobDetailsClick = new EventEmitter();
    @Input() locations = [];

    public jobList$ = new BehaviorSubject([]);

    public matchingJobs$ = new BehaviorSubject(null);
    public searchTags$ = new BehaviorSubject(null);
    public screenwidth = 0;
    public windowSizeDivider = ConfigService.windowSizeDivider;
    public searchList$ = new BehaviorSubject(null);
    public orderName$: BehaviorSubject<any> = new BehaviorSubject('');
    public totalRecords$: BehaviorSubject<any> = new BehaviorSubject(0);
    public currentPage: number = 1;
    public isPublic$: BehaviorSubject<any> = new BehaviorSubject(null);
    public isAuthorized$: BehaviorSubject<any> = new BehaviorSubject(null);
    public activeRouterObs;
    public eventsObs;
    public activeparams;
    public urlPath;
    public urlParams = {};
    public showAnimate = {};

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

    public paramsList = [
        'locations', 'cities', 'sectors', 'fareas', 'jobtypes',
        'salarylevels', 'edulevels', 'explevels', 'companies'
    ];

    // Members
    public searchTags = [];
    public postData = [];

    public form1: FormGroup;

    // Flags
    public showHelpFlag: boolean = false;
    public showfilter: boolean = false;
    public showSpinner$: BehaviorSubject<any> = new BehaviorSubject(true);

    public queryParams = {};
    public filterList = null;
    public searchString = '';
    public loctitle = '';
    public title$: BehaviorSubject<any> = new BehaviorSubject('');
    public loctitle$: BehaviorSubject<any> = new BehaviorSubject('');
    public orderString = '';
    public hashOrder = {matching_percentage: 'matching_percentage', created_at: 'created_at'};

    public seoDescCountry = '';
    public seoDescSector = '';
    public seoDesc = '';
    public dynamicSeo = false;
    public dynamicSeoAry = [];
    public currLan = 'en';
    public fixedTextHash = this.loaderService.getFixedText();
    public hashOrderName = {
        matching_percentage: this.fixedTextHash['matching_percentage'][this.currLan],
        created_at: this.fixedTextHash['date_posted'][this.currLan]
    };

    constructor(public _jobservice: JobseekerJobService,
                public accountService: AccountService,
                public loaderService: LoaderService,
                public _activeRoute: ActivatedRoute,
                public fb: FormBuilder,
                public _router: Router,
                public _location: Location) {

        this.accountService.setSwitchFlag(false);

        this.eventsObs = this._router.events.subscribe((params) => {
            let isPublic = this.getCheckPublic();
            this.isPublic$.next(isPublic);

        });
    }
    public onSearch() {
        let paginationUrl = {};

        this.activeRouterObs = this._activeRoute.queryParams.subscribe((params) => {
            for (let key in params) {
                if (params.hasOwnProperty(key)) {
                    paginationUrl[key] = params[key];
                }
            }
            paginationUrl['title'] = this.searchString;

        });

        this.currentPage = 1;
        paginationUrl['page'] = 1;
        this._router.navigate([this.accountService.getCurrLangUrl() +
        this.accountService.getPath() + '/jobs'], {queryParams: paginationUrl});
    }

    public onSelectOrder(mode = null, name = 'None') {
        let paginationUrl = {};

        this.activeRouterObs = this._activeRoute.queryParams.subscribe((params) => {

            for (let key in params) {
                if (params.hasOwnProperty(key)) {
                    paginationUrl[key] = params[key];
                }
            }
            paginationUrl['order'] = mode;
            this._router.navigate([this.accountService.getCurrLangUrl() +
            this.accountService.getPath() + '/jobs'], {queryParams: paginationUrl});
        });
        this.activeRouterObs.unsubscribe();
    }

    public ngOnInit() {
        this.currLan = this.accountService.getCurrLang();
        this.seoDescCountry = this.fixedTextHash['seo_desc_country'][this.currLan];
        this.seoDescSector = this.fixedTextHash['seo_desc_sector'][this.currLan];
        this.loadData();
    }

    public getCheckPublic() {
        let isPublic = !this.accountService.getAuth();

        return isPublic;
    }

    public getToggleFilter() {
        this.showfilter = (this.showfilter) ? false : true;
    }

    public getToggleHelp() {
        this.showHelpFlag = (this.showHelpFlag) ? false : true;
    }

    public _getBuildParamsUrl(params) {

        let ary = [];
        if (params != null && params) {
            ary = params.toString().split(',').map(Number);
        }
        return ary;
    }

    public ngOnDestroy() {

        if (this.activeRouterObs) {
            this.activeRouterObs.unsubscribe();
        }
        if (this.activeparams) {
            this.activeparams.unsubscribe();
        }
        if (this.eventsObs) {
            this.eventsObs.unsubscribe();
        }
    }

    public loadData() {

        this.screenwidth = window.innerWidth;
        this.urlPath = this.accountService.getCurrLangUrl() +
            this.accountService.getPath() + '/jobs';
        let elements1 = {
            search_string: ['', Validators.required]
        };
        this.form1 = this.fb.group(elements1);

        // URL Params Fetch
        this.activeRouterObs = this._activeRoute.queryParams.subscribe((params) => {
            this.queryParams = {};
            if (params) {
                Object.assign(this.queryParams, params);
            }

            this.activeparams = this._activeRoute.params.subscribe((params2) => {
                /**
                 * Redirect old url for search by country to new url
                 */
                if (params2['locations']) {
                    let redirectUrl = this.accountService.getCurrLangUrl() +
                        this.accountService.getPath() + '/' +
                        this.accountService.getSpaceToDashLowerCase(params2['country_name']) +
                        '/jobs';
                    this._router.navigate([redirectUrl]);
                }

                /**
                 * Redirect old url for search by sector to new url
                 */
                if (params2['sector_name'] && params2['jobTitle-id']) {
                    let redirectUrl = this.accountService.getCurrLangUrl() +
                        this.accountService.getPath() + '/jobs/sector/' +
                        this.accountService.gethLowerCase(params2['jobTitle-id']);
                    this._router.navigate([redirectUrl]);
                }

                if (params2['country']) {

                    this.loaderService.getStaticCountries().forEach((val) => {
                        if (this.accountService.getSpaceToDashLowerCase(val.name)
                            === params2['country']) {
                            this.dynamicSeo = true;
                            this.dynamicSeoAry = ['Jobs in ' + val.name];
                            this.queryParams['locations'] = val.id;
                            this.seoDesc = this.seoDescCountry.replace('[country_name]',
                                val.name);
                            this.seoDesc = this.seoDesc.replace('[country_name]',
                                val.name);
                        }
                    });

                    if (params2['city_name'] && this.queryParams['locations']) {
                        this.loaderService.getCitiesListAll().forEach((val) => {
                            if (this.accountService.getSpaceToDashLowerCase(val.name)
                                === params2['city_name']) {

                                this.dynamicSeo = true;
                                this.queryParams['cities'] = val.id;
                                this.dynamicSeoAry = ['Jobs in ' + params2['country'], val.name];
                            }
                        });

                        // if country and city
                        this.getBuildRoute(params2, this.queryParams);

                    } else {
                        // if only country
                        this.getBuildRoute(params2, this.queryParams);

                    }

                } else if (params2['sector_name']) {
                    this.loaderService.getStaticSectors().forEach((val) => {
                        if (this.accountService.getSpaceToDashLowerCase(val.name)
                            === params2['sector_name']) {
                            this.queryParams['sectors'] = val.id;
                            this.dynamicSeo = true;
                            this.dynamicSeoAry = [val.name + ' jobs in Dubai, UAE and the Gulf'];
                            this.seoDesc = this.seoDescSector.replace('[sector]', val.name);
                            this.seoDesc = this.seoDesc.replace('[sector]', val.name);
                        }
                    });
                    this.getBuildRoute(params2, this.queryParams);
                } else {
                    //  general
                    this.getBuildRoute(params2, this.queryParams);
                }
            });

            this.orderName$.next(this.fixedTextHash['date_posted'][this.currLan]);
        });

        this.form1.controls['search_string'].valueChanges.subscribe((val) => {
            this.searchString = val;
        });

        Observable.merge(
            this.searchList$
        )
            .switchMap((dataVal) => {

                // if dynamic SEO
                if (this.dynamicSeo) {
                    let canonicalUrl = false;

                    this.accountService.setPageDynamicSeo(this.dynamicSeoAry,
                        canonicalUrl, this.seoDesc);
                } else {

                    let canonicalUrl = false;
                    this.accountService.setPageSeo('jobs', 'page no ' +
                        this.currentPage, '', '', canonicalUrl);
                }

                this.filterList = dataVal;
                if (this.filterList != null && this.filterList.filter) {
                    return this._jobservice.getAllJobList(this.searchString, this.loctitle,
                        this.orderString, this.filterList.filter, this.filterList.page || 1);
                }
                return this._jobservice.getAllJobList(this.searchString, this.loctitle,
                    this.orderString, null, 1);
            })
            .subscribe((res) => {

                    this.showSpinner$.next(false);
                    res['jobs'].forEach((selJob, selJobCnt) => {
                        res['jobs'][selJobCnt].createdDate = moment(Date.parse(selJob.createdDate))
                            .format('D MMM, YYYY');
                    });

                    if (res['jobs'].length === 0 && this.currentPage > 1) {
                        this.onSearch();
                    }

                    this.jobList$.next(res['jobs']);
                    this.matchingJobs$.next(res['matching_jobs']);

                    this.totalRecords$.next(res['meta']['total_count']);

                    if (res['search_tags'] != null) {
                        this.searchTags = res['search_tags'];

                        this.searchTags$.next(this.searchTags);
                    }
                },
                (error) => {
                    this.accountService.getErrorCheck(error);
                });

    }

    public getBuildRoute(params2, queryParams: {}) {
        this.showAnimate = {};

        this.urlParams = queryParams;

        if (this._location.path().indexOf('?') === -1) {
            this.urlPath = this._location.path();
        } else {
            this.urlPath = this._location.path().slice(0, this._location.path().indexOf('?'));
        }

        this.isAuthorized$.next(this.accountService.getAuth());
        this.showSpinner$.next(true);
        this.searchString = queryParams['title'];
        this.title$.next(this.searchString);
        this.loctitle = queryParams['loctitle'];
        this.loctitle$.next(this.loctitle);
        this.currentPage = (queryParams['page']) ? queryParams['page'] : 1;

        this.orderString = (this.hashOrder[queryParams['order']]) ?
            this.hashOrder[queryParams['order']] : '';
        let orderName = (this.hashOrderName[queryParams['order']]) ?
            this.hashOrderName[queryParams['order']] :
            this.fixedTextHash['date_posted'][this.currLan];

        this.orderName$.next(orderName);

        this.paramsList.forEach((selparams) => {

            if (queryParams[this.paramsHash[selparams]]) {
                this.postData[selparams] =
                    this._getBuildParamsUrl(queryParams[this.paramsHash[selparams]]);
            } else {
                this.postData[selparams] =
                    this._getBuildParamsUrl(params2[this.paramsHash[selparams]]);
            }
        });

        this.searchList$.next({filter: this.postData, page: this.currentPage});
    }

    public showAnimation(classname, jobId = 1, jobcount = 0) {
        this._jobservice.getAllJobList();
        this._jobservice.getJobseekerProbabilitySuccess(jobId).subscribe((val) => {

            if (val['response']['probability']) {
                this.showAnimate[jobcount]['spinner'] = false;

                let c4 = jQuery(classname);
                c4.circleProgress({
                    startAngle: -Math.PI / 6 * 3,
                    value: (val['response']['probability'] / 100),
                    thickness: 4,
                    lineCap: 'round',
                    fill: {
                        gradient: [ConfigService.SPINNER_COLOR_ONE, ConfigService.SPINNER_COLOR_TWO]
                    }
                }).on('circle-animation-progress', function (event, progress, stepValue) {
                    jQuery(this).find('strong').html((100 * stepValue).toFixed(1) +
                        '<i>%</i>');
                });

                setTimeout(function () {
                    c4.circleProgress('value', 0.7);
                }, 1000);
                setTimeout(function () {
                    c4.circleProgress('value', 1.0);
                }, 1100);
                setTimeout(function () {
                    c4.circleProgress('value', val['response']['probability'] / 100);
                }, 2100);

            }
        });
    }
}
