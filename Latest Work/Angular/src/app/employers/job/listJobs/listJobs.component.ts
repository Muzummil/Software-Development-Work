import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router, ActivatedRoute } from '@angular/router';

// Services
import { AccountService } from '../../../core/account/services/account.service';
import { CompanyService } from '../../../core/services/company.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { ConfigService } from 'app/shared/config.service';

var moment = require('moment');

declare var jQuery: any;
declare var moment: any;

@Component({
    selector: 'employer-jobs-search',
    templateUrl: 'listJobs.component.html',
    styleUrls: ['./listJobs.scss']
})

export class ListJobsComponent implements OnInit, OnDestroy {

    public totalRecords$: BehaviorSubject<any> = new BehaviorSubject(0);
    public activeRouterObs;
    public currentPage: number = 1;
    public sectorId: number = -1;
    public fareaId: number = -1;
    public jobTypeId: number = -1;
    public jobsStausId: number = -1;
    public titleString: string = "";
    public paramsObs;

    public sectorListObs: BehaviorSubject<any> = new BehaviorSubject(null);
    public fareaListObs: BehaviorSubject<any> = new BehaviorSubject(null);
    public jobTypeListObs: BehaviorSubject<any> = new BehaviorSubject(null);
    public jobListObs: BehaviorSubject<any> = new BehaviorSubject(null);
    public totalJobsObs: BehaviorSubject<any> = new BehaviorSubject(0);


    public sectorList = [];
    public fareaList = [];
    public jobStatusList = [];
    public jobTypeList = [];
    public params = [];
    public currLan = 'en';
    public fixedTextHash = this.loaderService.getFixedText();
    public jobStatusListObs: BehaviorSubject<any> = new BehaviorSubject(this.jobStatusList);
    public hasInternalHiring:boolean = false;

    constructor(public accountService: AccountService, public fb: FormBuilder,
                public _companyService: CompanyService,
                public loaderService: LoaderService,
                public _activeRoute: ActivatedRoute,
                public _router: Router) {

        this.accountService.setSwitchFlag(false);
    }

    public ngOnDestroy() {
        this.paramsObs.unsubscribe();
    }

    public searchFilter() {

        let params = {};
        if (this.sectorId !== -1) {
            params['sector'] = this.sectorId;
        }
        if (this.fareaId !== -1) {
            params['farea'] = this.fareaId;

        }
        if (this.jobTypeId !== -1) {
            params['jobtypes'] = this.jobTypeId;
        }
        if (this.titleString !== "") {
            params['title'] = this.titleString;
        }
        if (this.jobsStausId !== -1) {
            params['jobstatus'] = this.jobsStausId;
        }

        this._router.navigate(
            [this.accountService.getCurrLangUrl() +
            this.accountService.getPath() + '/jobs'], {queryParams: params});
    }

    public setSearchString(val) {
        this.titleString = val;
    }

    public getIfExpired(endDate) {

        return moment(new Date()).isAfter(Date.parse(endDate));

    }

    public onLoadJobs(params = []) {

        this.jobListObs.next(null);
        this._companyService.getCompanyJobsWithFilter(this.accountService.getCompanyId(),
            params, this.currentPage).subscribe((res) => {
            this.jobListObs.next(res[0]);
            this.totalJobsObs.next(res[1]['total_count']);

            if (res[0].length == 0 && this.currentPage > 1) {
                this.currentPage--;
                this._router.navigate(['jobs'], {queryParams: {page: this.currentPage}});
            }

        });
    }

    public deleteJob(jobId: number, jobIndex: number) {

        this._companyService.getDeleteJob(this.accountService.getCompanyId(),
            jobId, this.currentPage).subscribe(res => {

            this.onLoadJobs(this.params);

            jQuery('.close_delete').modal('hide');
        });
    }

    public ngOnInit() {
        if(ConfigService.SHOW_INTERNAL_HIRING == "true"){
            this.hasInternalHiring = true;
        }
        this.accountService.setCustomSeo();
        this.currLan = this.accountService.getCurrLang();
        this.jobStatusList = [
        //     {
        //     id: null,
        //     name: this.fixedTextHash['select_status'][this.currLan]
        // },
            {id: 'draft', name: this.fixedTextHash['draft'][this.currLan]},
            {id: 'expired', name: this.fixedTextHash['expired'][this.currLan]},
            {id: 'active', name: this.fixedTextHash['active'][this.currLan]},
            {id: 'deleted', name: this.fixedTextHash['deleted'][this.currLan]}];
        this.jobStatusListObs.next(this.jobStatusList);
        this.paramsObs = this._activeRoute.queryParams.subscribe((selParams) => {
            window.scroll(0, 0);

            let params = [];
            if (selParams['sector']) {
                this.sectorId = selParams['sector'];
                params.push({name: 'sector', id: selParams['sector']});
            }
            if (selParams['farea']) {
                this.fareaId = selParams['farea'];
                params.push({name: 'farea', id: selParams['farea']});
            }
            if (selParams['jobtypes']) {
                this.jobTypeId = selParams['jobtypes'];
                params.push({name: 'jobtypes', id: selParams['jobtypes']});
            }
            if (selParams['jobstatus']) {
                this.jobsStausId = selParams['jobstatus'];
                params.push({name: 'jobstatus', id: selParams['jobstatus']});
            }
            if (selParams['title']) {
                this.titleString = selParams['title'];
                params.push({name: 'title', value: selParams['title']});
            }
            this.currentPage = (selParams['page']) ? selParams['page'] : 1;
            this.params = params;


            AccountService.s3Loaded$.subscribe((resFlag) => {

                if (resFlag) {

                    if (this.sectorList.length == 0) {
                        if (resFlag) {
                            // this.sectorList.push({
                            //     id: null,
                            //     name: this.fixedTextHash['select_sector'][this.currLan]
                            // });
                            let sector_res = this.loaderService.getSectors();
                            sector_res.forEach((selSector) => {
                                this.sectorList.push({
                                    id: selSector['id'],
                                    name: selSector['name']
                                });
                            });
                            this.sectorListObs.next(this.sectorList);
                        }
                    }

                    if (this.fareaList.length === 0) {
                        let func_res = this.loaderService.getFunctionalArea();
                        // this.fareaList.push({
                        //     id: null,
                        //     name: this.fixedTextHash['select_functional_area'][this.currLan]
                        // });
                        func_res.forEach((selFarea) => {
                            this.fareaList.push({id: selFarea['id'], name: selFarea['name']});
                        });
                        this.fareaListObs.next(this.fareaList);
                    }

                    if (this.jobTypeList.length === 0) {
                        let job_res = this.loaderService.getJobTypes();
                        // this.jobTypeList.push({
                        //     id: null,
                        //     name: this.fixedTextHash['select_job_area'][this.currLan]
                        // });
                        job_res.forEach((seljobType) => {
                            this.jobTypeList.push({id: seljobType['id'], name: seljobType['name']});
                        });
                        this.jobTypeListObs.next(this.jobTypeList);

                    }
                }

            });

            this.onLoadJobs(params);

        });
    }


}
