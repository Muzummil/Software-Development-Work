import { Component, OnInit, EventEmitter, Output, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

// directives
import { Router, ActivatedRoute } from '@angular/router';

// Services

import { CompanyService } from '../../../core/services/company.service';
import { AccountService } from '../../../core/account/services/account.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { ConfigService } from '../../../shared/config.service';

@Component({
    selector: 'all-company-listing',
    providers: [Location, {provide: LocationStrategy, useClass: PathLocationStrategy}],
    templateUrl: 'allCompanies.component.html'
})

export class AllCompaniesComponent implements OnInit, OnDestroy {

    @Output() companyDetailsClick = new EventEmitter();

    // Forms
    public form1: FormGroup;

    // Observable
    public isPublic: boolean = false;
    public allCompanies$: BehaviorSubject<any> = new BehaviorSubject(null);
    public searchList$: BehaviorSubject<any> = new BehaviorSubject(null);
    public totalRecords$: BehaviorSubject<any> = new BehaviorSubject(10);
    public loadingFlagsArray$: BehaviorSubject<any> = new BehaviorSubject(false);
    public order: string = '';
    public activeRouterObs;
    public activeparams;

    // Flags
    public loadingFlagsArray = [];
    public queryParams = {};
    public showfilter: boolean = false;
    public allCompanies = [];
    public postData = [];
    public screenwidth = 0;
    public windowSizeDivider = ConfigService.windowSizeDivider;

    public dynamicSeo = false;
    public dynamicSeoAry = [];
    public seoDescSector = 'Search for Companies in [sector] in the GCC countries,the wider' +
        'MiddleEast, North Africa and East Asia with a particular focus on Jobs in Dubai, UAE';
    public seoDescCountry = 'Search for Companies recruiting in' +
        '[country] –Apply to 1000s of Jobs posted directly by top employers and recruitment' +
        'agencies in [country]';
    public seoDesc = '';
    public urlPath;

    // members
    @Input() public currentPageObs: BehaviorSubject<any> = new BehaviorSubject(1);
    public currentPage: number = 1;
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
        companies: 'companies'
    };

    public paramsList = ['locations', 'cities', 'sectors', 'fareas', 'jobtypes', 'salarylevels',
        'edulevels', 'explevels', 'companies'];
    public currLan = 'en';
    public fixedTextHash = this.loaderService.getFixedText();

    constructor(public _companyservice: CompanyService, public fb: FormBuilder,
                public _router: Router,
                public accountService: AccountService,
                public loaderService: LoaderService,
                public _activeRoute: ActivatedRoute, public location: Location) {
        this.location = location;
        this.accountService.setSwitchFlag(false);

    }

    public ngOnInit() {
        this.loadData();
        this.currLan = this.accountService.getCurrLang();
    }

    public getToggleFilter() {
        this.showfilter = (this.showfilter) ? false : true;
    }

    public onFollowCompany(index: number) {

        this.loadingFlagsArray['companyLoader'] = false;
        this.loadingFlagsArray$.next(false);

        this._companyservice.getFollowCompany(this.allCompanies[index]['id']).subscribe((res) => {
                this.loadingFlagsArray['companyLoader'] = false;
                this.loadingFlagsArray$.next(false);
                this.allCompanies[index]['followingFlag'] = true;
                this.allCompanies[index]['follower']++;
                this.allCompanies$.next(this.allCompanies);
            },
            (error) => {
                this.accountService.getErrorCheck(error);
            });

    }

    public onUnFollowCompany(index: number) {

        this.loadingFlagsArray['companyLoader'] = false;
        this.loadingFlagsArray$.next(false);

        this._companyservice.getUnfollowCompany(this.allCompanies[index]['id']).subscribe((res) => {
                this.loadingFlagsArray['companyLoader'] = false;
                this.loadingFlagsArray$.next(false);
                this.allCompanies[index]['followingFlag'] = false;
                this.allCompanies[index]['follower']--;
                this.allCompanies$.next(this.allCompanies);
            },
            (error) => {
                this.accountService.getErrorCheck(error);
            });
    }

    public previous() {
        this._router.navigate([this.accountService.getCurrLangUrl() + 'companies', {locations: 1}]);
    }

    public _getBuildParamsUrl(params) {
        let ary = [];
        if (params != null && params) {
            ary = params.toString().split(',').map(Number);
        }
        return ary;
    }

    public loadData() {
        this.screenwidth = window.innerWidth;
        this.allCompanies$.next(null);
        this.urlPath = this.accountService.getCurrLangUrl() + this.accountService.getPath() +
            '/companies';
        this.activeRouterObs = this._activeRoute.queryParams.subscribe((params) => {
            this.activeparams = this._activeRoute.params.subscribe((params2) => {

                this.queryParams = {};
                if (params) {
                    Object.assign(this.queryParams, params);
                }

                if (params2['country_name']) {

                    this.loaderService.getStaticCountries().forEach((val) => {
                        if (this.accountService.getSpaceToDashLowerCase(val.name) ===
                            params2['country_name']) {
                            this.queryParams['locations'] = val.id;
                            this.dynamicSeo = true;
                            this.dynamicSeoAry = ['Companies with Job Vacancies in ' + val.name];
                            this.seoDesc = this.seoDescCountry.replace('[country]', val.name);
                            this.seoDesc = this.seoDesc.replace('[country]', val.name);

                        }
                    });
                } else if (params2['sector_name']) {
                    this.loaderService.getStaticSectors().forEach((val) => {
                        if (this.accountService.getSpaceToDashLowerCase(val.name) ===
                            params2['sector_name']) {
                            this.queryParams['sectors'] = val.id;
                            this.dynamicSeo = true;
                            this.dynamicSeoAry = ['Companies recruiting in ' + val.name +
                            ' in Dubai, UAE & Gulf '];
                            this.seoDesc = this.seoDescSector.replace('[sector]', val.name);
                        }
                    });
                }

                if (this.location.path().indexOf('?') === -1) {
                    this.urlPath = this.location.path();
                } else {
                    this.urlPath = this.location.path().slice(0, this.location.path().indexOf('?'));
                }

                this.order = this.location.path().indexOf('top-followed-companies') !== -1 ?
                    'followers' : null;
                this.currentPage = (this.queryParams['page']) ? this.queryParams['page'] : 1;
                this.paramsList.forEach((selparams) => {
                    this.postData[selparams] =
                        this._getBuildParamsUrl(this.queryParams[this.paramsHash[selparams]]);
                });
                this.searchList$.next('filter');
                this.isPublic = !this.accountService.getAuth();
            });

        });

        this.loadingFlagsArray['companyLoader'] = true;
        this.loadingFlagsArray$.next(true);

        let elements1 = {
            search_string: ['', Validators.required]
        };
        this.form1 = this.fb.group(elements1);
        this.form1.controls['search_string'].valueChanges.subscribe((val) => {
            this.searchList$.next(val);
        });

        Observable.merge(
            this.searchList$
        )
            .switchMap((dataVal) => {

                // if dynamic SEO
                if (this.dynamicSeo) {
                    let canonicalUrl = false;

                    /**
                     *  Adding Page numbers to the title meta tags
                     */
                    // this.dynamicSeoAry.push('page no '+this.currentPage);
                    this.accountService
                        .setPageDynamicSeo(this.dynamicSeoAry, canonicalUrl, this.seoDesc);
                } else {
                    let canonicalUrl = false;
                    this.accountService
                        .setPageSeo('company_list', 'page no ' +
                            this.currentPage, '', '', canonicalUrl);
                }

                this.loadingFlagsArray$.next(true);
                this.allCompanies$.next(null);
                return this._companyservice
                    .getAllCompanyList(this.order, this.postData, this.currentPage);
            })
            .subscribe((res) => {

                    this.loadingFlagsArray$.next(false);
                    this.allCompanies = res['companies'];
                    this.totalRecords$.next(res['meta']['total_count']);
                    this.allCompanies$.next(this.allCompanies);
                },
                (error) => {
                    this.accountService.getErrorCheck(error);
                });

    }

    public ngOnDestroy() {
        this.activeRouterObs.unsubscribe();
        this.activeparams.unsubscribe();
    }
}
