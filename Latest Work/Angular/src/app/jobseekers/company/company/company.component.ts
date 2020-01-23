import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

// service

import { ActivatedRoute } from '@angular/router';
import { AccountService } from '../../../core/account/services/account.service';
import { LoaderService } from '../../../shared/services/loader.service';

@Component({

    selector: 'company-listing',
    templateUrl: 'company.component.html',
    styleUrls: ['./company.scss']
})

export class CompanyComponent implements OnInit, OnDestroy {

    // Flags
    public allCompaniesFlag: boolean = true;
    public mostFollowedCompaniesFlag: boolean = false;
    public companyDetailsFlag: boolean = false;
    public postMode: string = 'all';

    // Variables
    public companyId: number;
    public fromPage: string;
    public currentPage: number = 1;
    public currentPageObs: BehaviorSubject<any> = new BehaviorSubject(1);
    public isAuthorized$: BehaviorSubject<any> = new BehaviorSubject(null);
    public activeRouterObs;
    public isPublic: boolean;
    public currLan = 'en';
    public fixedTextHash = this.loaderService.getFixedText();

    constructor(public _activeRoute: ActivatedRoute,
                public loaderService: LoaderService,
                public accountService: AccountService) {

        this.accountService.setSwitchFlag(false);
    }

    public ngOnDestroy() {
        if (this.activeRouterObs) {
            this.activeRouterObs.unsubscribe();
        }
    }

    public ngOnInit() {

        this.isPublic = true;
        this.currLan = this.accountService.getCurrLang();

        this.activeRouterObs = this._activeRoute.queryParams.subscribe((params) => {
            window.scroll(0, 0);
            this.isAuthorized$.next(this.accountService.getAuth());

            // Page
            this.currentPage = (params['page']) ? params['page'] : 1;
            this.currentPageObs.next(this.currentPage);
        });

        this._activeRoute.params.subscribe((params) => {

            let id = null;
            let company_name = null;
            if (params['name_url-id']) {
                let paramList = params['name_url-id'].split('-');

                id = +paramList[paramList.length - 1];
                company_name = +paramList[paramList.length - 2];

            } else {
                id = params['id'];
                company_name = params['name_url'];
            }

            if (id) {

                if (params['name_url']) {
                    this.accountService.setPageSeo('company_desc', params['name_url']);
                }
                this.onClickCompanyDetail({id, fromPage: 'all', company_name});
            }
        });

        this._activeRoute.url.subscribe((urls) => {
            if (urls && urls.length > 0 && urls[0].path === 'top-followed-companies') {
                this.onSelectFollowedCompanies();
            }
        });
    }

    public onSelectAllCompanies() {
        this.allCompaniesFlag = true;
        this.postMode = 'all';
        this.mostFollowedCompaniesFlag = false;
        this.companyDetailsFlag = false;
    }

    public onSelectFollowedCompanies() {
        this.allCompaniesFlag = false;
        this.postMode = 'top';
        this.mostFollowedCompaniesFlag = true;
        this.companyDetailsFlag = false;
    }

    public onClickBack($event) {

        if ($event.type) {
            if ($event.type === 'allCompanies') {
                this.onSelectAllCompanies();
            } else if ($event.type === 'topFollowCompanies') {
                this.onSelectFollowedCompanies();
            } else {

                this.onSelectAllCompanies();
            }
        }
    }

    public onClickCompanyDetail($event) {

        if ($event.id) {
            this.companyId = $event.id;
            this.fromPage = $event.fromPage;
        }

        this.allCompaniesFlag = false;
        this.mostFollowedCompaniesFlag = false;
        this.companyDetailsFlag = true;
    }

}
