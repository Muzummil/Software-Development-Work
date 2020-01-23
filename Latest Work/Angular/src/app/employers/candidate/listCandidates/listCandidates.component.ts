import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router, ActivatedRoute } from '@angular/router';

// services
import { AccountService } from '../../../core/account/services/account.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { CompanyService } from '../../../core/services/company.service';
import { AlgoliaService } from '../../../shared/services/algolia.service';

@Component({
    selector: 'list-candidates-employer',
    templateUrl: 'listCandidates.component.html',
    styleUrls: ['./listCandidates.scss']
})

export class ListCandidatesComponent implements OnInit, OnDestroy {

    public loadedData: boolean = false;
    public activeRouterObs;
    public currentPage: number = 1;
    public search_string: string = '';
    public search_mode: number = 1;
    public paramsList = {};
    public orderBy = 'last_sign_in';
    public hits;
    public results;
    public helper;
    public firstLoad = true;
    public emptyFilter: boolean = true;
    public screenwidth = 0;
    public maxWindowSizeMobile = 767;
    public maxWindowSizetablet = 1024;

    // Observables
    public totalRecords$: BehaviorSubject<any> = new BehaviorSubject(0);
    public hits$: BehaviorSubject<any> = new BehaviorSubject([]);
    public showSpinner$: BehaviorSubject<any> = new BehaviorSubject(false);
    public search_tags$ = new BehaviorSubject(null);
    public showFilter: boolean = false;
    public restricted_names: boolean = false;

    // Form
    public candidateNameForm: FormGroup;
    public candidateForm: FormGroup;
    public currLan = 'en';
    public fixedTextHash = this.loaderService.getFixedText();
    public postHashEq = {last_active: 'q[act_lteq]', job_title: 'q[pos_cont]'};

    // post hash map
    public postHash = {
        locations: 'q[loc_co_in]',
        cities: 'q[loc_ci_in]',
        sectors: 'q[se_in]',
        fareas: 'q[fa_in]',
        current_sal: 'q[cur_sal_in]',
        expect_sal: 'q[exp_sal_in]',
        edulevels: 'q[je_in]',
        explevels: 'q[yoe_in]',
        exprange: 'q[exp_in]',
        age_group: 'q[age_in]',
        language: 'q[la_in]',
        gender: 'q[ge_in]',
        marital_status: 'q[ms_in]',
        notice_period: 'q[not_in]',
        visa_status: 'q[vi_in]',
        job_type: 'q[jt_in]',
        jobtypes: 'q[jt_in]',
        nationality: 'q[nat_in]'
    };

    constructor(public accountService: AccountService,
                public _fb: FormBuilder,
                public loaderService: LoaderService,
                public _companyService: CompanyService,
                public _activeRoute: ActivatedRoute,
                public algoliaService: AlgoliaService,
                public _router: Router) {

        // search_mode:['1']
        this.candidateNameForm = this._fb.group({
            search_string: ['']
        });
        this.accountService.setSwitchFlag(false);
        this.algoliaService.setS3Json();

        this.candidateForm = this._fb.group({
            locations: [''],
            cities: [''],
            job_title: [''],
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
            marital_status: [''],
            notice_period: [''],
            last_active: [''],
            visa_status: [''],
            job_type: [''],
        });

        this.helper = this.algoliaService.getHelper();

        this.helper.on('result', (results) => {
            this.firstLoad = false;
            if (!this.emptyFilter) {
                this.getBuildResult(results);
                if (this.hits.length === 0 && this.currentPage > 1) {
                    this.paramsList['page'] = 1;
                    this._router.navigate([this.accountService.getCurrLangUrl()
                        + this.accountService.getPath() + '/candidate/list'],
                        {queryParams: this.paramsList});
                }
            } else {
                this.getBuildResult(results, true);
            }

        });

    }

    public getCandidateUrl(selProfile) {
        if (selProfile && !this.restricted_names) {
            return this.accountService.getCurrLangUrl() + this.accountService.getPath()
                + '/candidate/' + selProfile.id + '/profile';
        }
        return {};
    }

    public getUpdateTags(jobseekerIndex, tags) {
        this.hits$.value[jobseekerIndex]['hash_tags'] = tags;
    }

    public ngOnDestroy() {
        this.activeRouterObs.unsubscribe();
        this.firstLoad = true;
    }

    public ngOnInit() {
        this.accountService.setCustomSeo();
        this.currLan = this.accountService.getCurrLang();
        this.loadedData = true;
        let search_tags = {};
        search_tags['locations'] = {};
        this.screenwidth = window.innerWidth;
        this.getBuildRequest();
        this.restricted_names = this.accountService.restricted_user_names
            .indexOf(this.accountService.getUsername()) !== -1;
    }

    public getBuildRequest() {
        // URL Params Fetch
        this.activeRouterObs = this._activeRoute.queryParams.subscribe((params) => {
            window.scroll(0, 0);
            let postQuery = '';
            this.paramsList = {};
            if (params) {

                Object.assign(this.paramsList, params);
            }
            this.showSpinner$.next(true);

            this.currentPage = (params['page']) ? params['page'] : 1;
            this.orderBy = (params['order_by']) ? params['order_by'] : 'last_sign_in';
            this.search_string = (params['search_string']) ? params['search_string'] : '';
            this.search_mode = (params['search_mode']) ? params['search_mode'] : 1;

            this.search_tags$.next(this.paramsList);

            for (let key in this.candidateNameForm.value) {
                if (params.hasOwnProperty(key)) {
                    this.candidateNameForm.controls[key].setValue(params[key]);
                } else {
                    this.candidateNameForm.controls[key].setValue('');

                }
            }

            let pList = {};
            for (let key in this.paramsList) {
                if (params.hasOwnProperty(key)) {
                    let paramSplit = params[key].toString().split(',');
                    pList[key] = [];
                    paramSplit.forEach((selVal) => {
                        pList[key].push(selVal);
                        if (this.postHash[key]) {
                            postQuery += '&' + this.postHash[key] + '[]=' + selVal;
                        }
                        if (this.postHashEq[key]) {
                            postQuery += '&' + this.postHashEq[key] + '=' + selVal;
                        }

                    });

                }
            }
            AccountService.s3Loaded$.subscribe((resFlag) => {
                if (resFlag) {
                    this.setCheckFilter(pList);
                    this.algoliaService.setbuildSearch(pList, this.currentPage);
                }
            });

        });
    }

    public setCheckFilter(pList = {}) {
        this.emptyFilter = this.isEmpty(pList);
    }

    public isEmpty(obj) {
        for (let prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                return false;
            }
        }
        return JSON.stringify(obj) === JSON.stringify({});
    }

    public onBack() {
        this._router.navigate([this.accountService.getCurrLangUrl()
        + this.accountService.getPath() + '/candidate'], {queryParams: {}});
    }

    public getBuildResult(results, clear = false) {
        this.hits = results.hits;
        this.results = results;
        this.hits$.next((clear === false) ? results.hits : []);
        this.totalRecords$.next((clear === false) ? results.nbHits : 0);
        this.showSpinner$.next(false);
    }

    public searchOnEnter(e) {
        if (e.keyCode === 13) {
            this.searchCandidate();
        }
    }

    public searchCandidate() {

        if (this.candidateNameForm.valid &&  !this.firstLoad) {

            let params = this.paramsList;

            // Resetting the page.
            delete params['page'];
            for (let key in this.candidateNameForm.value) {
                if (this.candidateNameForm.value.hasOwnProperty(key)
                    && this.candidateNameForm.value[key]) {
                    params[key] = this.candidateNameForm.value[key];
                } else {
                    delete params[key];
                }
            }
            this._router.navigate([this.accountService.getCurrLangUrl()
                + this.accountService.getPath() + '/candidate/list'],
                {queryParams: params});
        }
    }

}
