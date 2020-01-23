import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router, ActivatedRoute } from '@angular/router';

// Services
import { AccountService } from '../../../core/account/services/account.service';
import { CompanyService } from '../../../core/services/company.service';
import { LoaderService } from '../../../shared/services/loader.service';

let moment = require('moment');

declare var jQuery: any;
@Component({

    selector: 'company-user-report',
    templateUrl: 'companyUserReport.component.html',
    styleUrls: ['./companyUserReport.scss']

})

export class CompanyUserReportComponent implements OnInit {

    public companyUsersObs: BehaviorSubject<any> = new BehaviorSubject(null);
    public totalUsersRecords$: BehaviorSubject<any> = new BehaviorSubject(null);

    public jobsObs: BehaviorSubject<any> = new BehaviorSubject(null);
    public totalJobs: BehaviorSubject<any> = new BehaviorSubject(0);

    public blogsObs: BehaviorSubject<any> = new BehaviorSubject(null);
    public totalBlogs: BehaviorSubject<any> = new BehaviorSubject(0);
    public currLan = 'en';
    public fixedTextHash = this.loaderService.getFixedText();

    public permissionHash = {
        edit_company: 'Can Edit Company',
        invite_connection: 'Can Invite Friends',
        create_job: 'Can Create Jobs',
        edit_job_application_status: 'Can Edit Job Application Status',
        destroy_job: 'Can Destroy Jobs',
        search_jobseekers: 'Can Search for Jobseekers',
        create_blog: 'Can Create Blogs',
        manage_blog: 'Can Manage Blogs'
    };

    public currentPage: number = 1;
    public selUserId: number;
    public id: number;
    public view = 'jobs';
    public pageNo = 1;
    public selUser;
    public userList = [];

    public jobPageNo = 1;
    public blogPageNo = 1;

    public loadedBlogFlag = false;
    public loadedJobsFlag = false;

    constructor(public accountService: AccountService,
                public fb: FormBuilder,
                public _companyService: CompanyService,
                public loaderService: LoaderService,
                public _activeRoute: ActivatedRoute,
                public _router: Router) {
    }

    public ngOnInit() {
        this.accountService.setCustomSeo();
        this.currLan = this.accountService.getCurrLang();
        this._activeRoute.queryParams.subscribe((params) => {

            window.scroll(0, 0);
            this.view = (params['view']) ? params['view'] : 'jobs';
            this.pageNo = (params['page']) ? params['page'] : 1;

            if (this.accountService.getCompanyUser()) {
                this._router.navigate([this.accountService.getCurrLangUrl()
                + this.accountService.getPath() + '/profile']);
            }

            if (this.userList.length === 0) {
                this._companyService.getCompanyUsers(this.accountService.getCompanyId(),
                    this.currentPage, true).subscribe((res) => {

                    if (!params['id'] || this.id !== params['id']) {

                        this.loadedBlogFlag = false;
                        this.loadedJobsFlag = false;
                        this.id = +params['id'];
                        this.selUserId = (this.id) ? this.id : res['users'][0].employer_id;
                        this.setActiveUser(this.selUserId);

                    }

                    this.onbuildReport();
                    res['users'].forEach((seluser) => {
                        this.userList.push({
                            id: seluser.employer_id,
                            name: (seluser.last_name) ?
                                seluser.first_name + ' ' + seluser.last_name : seluser.first_name
                        });
                    });
                    this.companyUsersObs.next(this.userList);

                    this.totalUsersRecords$.next(res['meta']['total_count']);
                });
            } else {

                if (this.id !== params['id']) {

                    this.loadedBlogFlag = false;
                    this.loadedJobsFlag = false;
                    this.id = +params['id'];
                    this.selUserId = this.id;
                    this.setActiveUser(this.selUserId);

                }

                this.onbuildReport();
            }

        });

    }

    public setActiveUser(selUserId: number) {

        this._companyService.getCompanyUserDetails(selUserId).subscribe((selUser) => {
            this.selUser = selUser['user'];
        });
    }

    public onChangeUser() {
        this._router.navigate([this.accountService.getCurrLangUrl()
        + this.accountService.getPath() + '/profile/user_report'],
            {queryParams: {id: this.selUserId}});
    }

    public onBack() {
        this._router.navigate([this.accountService.getCurrLangUrl()
        + this.accountService.getPath() + '/profile/users']);
    }

    public onbuildReport() {

        if (this.view === 'jobs') {
            if (this.jobPageNo !== this.pageNo) {
                this.jobPageNo = this.pageNo;
                this.loadedJobsFlag = false;
            }
        }

        if (this.view === 'blogs') {
            if (this.blogPageNo !== this.pageNo) {
                this.blogPageNo = this.pageNo;
                this.loadedBlogFlag = false;
            }
        }

        if (this.loadedJobsFlag === false) {
            this._companyService.getCompanyEmployerJobs(this.selUserId, this.jobPageNo)
                .subscribe((jobs) => {

                    this.loadedJobsFlag = true;
                    this.jobsObs.next(jobs);
                    this.totalJobs.next(jobs['meta']['total_count']);

                });
        }

        if (this.loadedBlogFlag === false) {
            this._companyService.getCompanyEmployerBlogs(this.selUserId, this.blogPageNo)
                .subscribe((blogs) => {

                    this.loadedBlogFlag = true;
                    this.blogsObs.next(blogs);
                    this.totalBlogs.next(blogs['meta']['total_count']);

                });
        }

    }

    public getIfExpired(endDate) {
        return moment(new Date()).isAfter(Date.parse(endDate));

    }


}
