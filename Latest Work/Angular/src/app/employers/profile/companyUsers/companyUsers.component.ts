import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router, ActivatedRoute } from '@angular/router';

// Services
import { AccountService } from '../../../core/account/services/account.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { CompanyService } from '../../../core/services/company.service';

declare var jQuery: any;

@Component({
    selector: 'company-users',
    templateUrl: 'companyUsers.component.html',
    styleUrls: ['./companyUsers.scss']
})

export class CompanyUsersComponent implements OnInit, OnDestroy {

    public companyUsersObs: BehaviorSubject<any> = new BehaviorSubject(null);
    public totalRecords$: BehaviorSubject<any> = new BehaviorSubject(0);
    public activeRouterObs;
    public currentPage: number = 1;
    public userList;
    public errorMessage = 'Sorry User Cannot be Deleted';
    public errorFlag = false;
    public currLan = 'en';
    public fixedTextHash = this.loaderService.getFixedText();

    constructor(public accountService: AccountService,
                public loaderService: LoaderService,
                public fb: FormBuilder,
                public _companyService: CompanyService,
                public _activeRoute: ActivatedRoute,
                public _router: Router) {

    }

    public loadUsers(currentPage) {
        this._companyService.getCompanyUsers(this.accountService.getCompanyId(),
            this.currentPage).subscribe((res) => {
            this.userList = res;
            this.companyUsersObs.next(this.userList);
            this.totalRecords$.next(res['meta']['total_count']);
        });
    }

    public ngOnInit() {
        this.accountService.setCustomSeo();
        this.currLan = this.accountService.getCurrLang();
        // URL Params Fetch
        this.activeRouterObs = this._activeRoute.queryParams.subscribe((params) => {
            window.scroll(0, 0);
            this.companyUsersObs.next(null);
            this.currentPage = (params['page']) ? params['page'] : 1;
            this.loadUsers(this.currentPage);
        });

    }

    public ngOnDestroy() {
        this.activeRouterObs.unsubscribe();
    }

    public deleteUser(userId: number, userIndex: number) {

        this._companyService.getDeleteCompanyUser(userId).subscribe((res) => {

            this.userList['users'].splice(userIndex, 1);

            this.companyUsersObs.next(this.userList);
            this.totalRecords$.next(res['meta']['total_count']);
            jQuery('.close_delete').modal('hide');

            if (this.userList['users'].length == 0 && this.currentPage > 1) {
                this.currentPage--;
                this._router.navigate([this.accountService.getCurrLangUrl() +
                this.accountService.getPath() + 'profile/users'],
                    {queryParams: {page: this.currentPage}});
            }

        }, (error) => {

            this.errorFlag = true;
            Observable.timer(2000).subscribe((val) => {
                this.errorFlag = false;
            });

        });
    }


}
