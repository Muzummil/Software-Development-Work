import { OnInit, Input, Component } from '@angular/core';

import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from '../../core/account/services/account.service';
import { ConfigService } from '../../shared/config.service';

// Directives
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router } from '@angular/router';
import { LoaderService } from '../services/loader.service';

@Component({

    selector: 'pagination-new',
    templateUrl: 'paginationNew.component.html',
    styleUrls: ['./paginationNew.scss']
})

export class PaginationNewComponent implements OnInit {
    // pager object
    pager: any = {};

    page_params: any = {};

    // Input
    // @Input() currentPage:number = 1;
    @Input() totalRecords: BehaviorSubject<any>;
    @Input() url: string;
    @Input() perPage = 10;
    @Input() hideLast = false;
    @Input() scrollTop = true;

    public currLan = 'en';
    public fixedTextHash = this.loaderService.getFixedText();

    public constructor(public _router: Router,
                       public _activeRoute: ActivatedRoute,
                       public loaderService: LoaderService,
                       public accountService: AccountService,
                       fb: FormBuilder) {
        this.currLan = this.accountService.getCurrLang();

    }

    public loadPage() {

        this._activeRoute.queryParams.subscribe((params) => {

            this.page_params = {};
            if (params) {
                Object.assign(this.page_params, params);
            }

            if (this.page_params['page'] && this.page_params['page'] !== 'undefined') {
                this.page_params['page'] = parseInt(this.page_params['page']);
            } else {
                this.page_params['page'] = 1;
            }

            this.pager = this.getPager(this.totalRecords.getValue(), this.page_params['page']);

            let prePage = this.getBuildUrl(this.page_params['page'] - 1);
            let nextPage = this.getBuildUrl(this.page_params['page'] + 1);

            this.accountService.setPaginationSeo(prePage, nextPage);

            if (this.scrollTop) {
                window.scroll(0, 0);
            }
        });
    }

    public getBuildUrl(pageNo = null) {
        let params = {};
        let paramsUrl = '';
        if (this.page_params) {
            Object.assign(params, this.page_params);
        }

        params['page'] = pageNo;

        for (let key in params) {
            if (params.hasOwnProperty(key)) {
                if (paramsUrl === '') {
                    paramsUrl += '?' + key + '=' + params[key];
                } else {
                    paramsUrl += '&' + key + '=' + params[key];
                }
            }
        }

        if (pageNo <= 0 || pageNo > (Math.ceil(this.totalRecords.value / this.perPage) - 1)) {
            return '';
        } else {
            return ConfigService.getDomain() + this.url + paramsUrl;
        }

    }

    public setPage(page: number = 1) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }
        this.page_params['page'] = page;

        this._router.navigate([this.url], {queryParams: this.page_params});
    }

    public getPager(totalItems: number, currentPage: number = 1, pageSize: number = this.perPage) {
        // calculate total pages
        let totalPages = Math.ceil(totalItems / pageSize);

        let startPage, endPage;
        if (totalPages <= this.perPage) {
            // less than 10 total pages so show all
            startPage = 1;
            endPage = totalPages;
        } else {
            // more than 10 total pages so calculate start and end pages
            if (currentPage <= 6) {
                startPage = 1;
                endPage = this.perPage;
            } else if (currentPage + 4 >= totalPages) {
                startPage = totalPages - 9;
                endPage = totalPages;
            } else {
                startPage = currentPage - 5;
                endPage = currentPage + 4;
            }
        }

        // calculate start and end item indexes
        let startIndex = (currentPage - 1) * pageSize;
        let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

        // create an array of pages to ng-repeat in the pager control
        let pages = [];
        for (let i = startPage; i < endPage + 1; ++i) {
            pages.push(i);
        }
        // return object with all pager properties required by the view
        return {
            totalItems,
            currentPage,
            pageSize,
            totalPages,
            startPage,
            endPage,
            startIndex,
            endIndex,
            pages
        };
    }



    public ngOnInit() {
        this.totalRecords.subscribe((total_records) => {
            if (total_records && this.url && this.url.length > 0) {
                this.loadPage();
            }
        });
    }
}
