import { OnInit, Component, OnDestroy, AfterViewInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

// services
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigService } from '../../../shared/config.service';
import { AccountService } from '../../../core/account/services/account.service';
import { Location } from '@angular/common';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { LoaderService } from '../../../shared/services/loader.service';

require('localrepo/scrolltab/scrolltab.js');

declare var jQuery;

@Component({

    selector: 'job-listing',
    templateUrl: 'job.component.html',
    styleUrls: ['./job.scss']
})

export class JobComponent implements OnInit, OnDestroy, AfterViewInit {

    // Flags
    public allJobsFlag: boolean = true;
    public suggestJobsFlag: boolean = false;
    public myJobsFlag: boolean = false;
    public savedSearchFlag: boolean = false;
    public savedJobsFlag: boolean = false;
    public interviewsFlag: boolean = false;
    public jobDetailsFlag: boolean = false;

    public isPublic$: BehaviorSubject<any> = new BehaviorSubject(null);
    public fixedTextHash = this.loaderService.getFixedText();
    // Variables
    public jobId: number;
    public fromPage: string;
    public locations = [];
    public currLan = 'en';

    // Observable
    public parameterObz;

    constructor(public route: ActivatedRoute, public _title: Title,
                public accountService: AccountService,
                public loaderService: LoaderService, public _router: Router,
                public _location: Location) {

        this._title.setTitle(ConfigService.titles['jobs']);
        this.accountService.setSwitchFlag(false);
        this._router.events.subscribe((params) => {
            this.isPublic$.next(!this.accountService.getAuth());
        });

    }
    public onReset() {

        this.allJobsFlag = false;
        this.interviewsFlag = false;
        this.suggestJobsFlag = false;
        this.myJobsFlag = false;
        this.savedSearchFlag = false;
        this.savedJobsFlag = false;
        this.jobDetailsFlag = false;
    }

    public onClickAllJobs() {

        this.allJobsFlag = true;
        this.suggestJobsFlag = false;
        this.myJobsFlag = false;
        this.savedSearchFlag = false;
        this.savedJobsFlag = false;
        this.jobDetailsFlag = false;
        this.interviewsFlag = false;
    }

    public onClickSuggestJobs() {
        this.allJobsFlag = false;
        this.suggestJobsFlag = true;
        this.myJobsFlag = false;
        this.savedSearchFlag = false;
        this.savedJobsFlag = false;
        this.jobDetailsFlag = false;
        this.interviewsFlag = false;
    }

    public onClickMyJobs() {

        this.allJobsFlag = false;
        this.suggestJobsFlag = false;
        this.myJobsFlag = true;
        this.savedSearchFlag = false;
        this.savedJobsFlag = false;
        this.jobDetailsFlag = false;
        this.interviewsFlag = false;
    }

    public onClickSavedSearch() {

        this.allJobsFlag = false;
        this.suggestJobsFlag = false;
        this.myJobsFlag = false;
        this.savedSearchFlag = true;
        this.savedJobsFlag = false;
        this.jobDetailsFlag = false;
        this.interviewsFlag = false;
    }

    public onClickSavedJobs() {

        this.allJobsFlag = false;
        this.suggestJobsFlag = false;
        this.myJobsFlag = false;
        this.savedSearchFlag = false;
        this.savedJobsFlag = true;
        this.jobDetailsFlag = false;
        this.interviewsFlag = false;
    }

    public onClickInterviews() {

        this.allJobsFlag = false;
        this.suggestJobsFlag = false;
        this.myJobsFlag = false;
        this.savedSearchFlag = false;
        this.savedJobsFlag = false;
        this.jobDetailsFlag = false;
        this.interviewsFlag = true;
    }

    public onClickjobDetail($event) {

        if ($event.id) {
            this.jobId = $event.id;
            this.fromPage = $event.fromPage;
        }

        this.allJobsFlag = false;
        this.suggestJobsFlag = false;
        this.myJobsFlag = false;
        this.savedSearchFlag = false;
        this.savedJobsFlag = false;
        this.jobDetailsFlag = true;
    }

    public onClickjobDetails(id: number) {

        this.fromPage = '';
        this.jobId = id;
        this.allJobsFlag = false;
        this.suggestJobsFlag = false;
        this.myJobsFlag = false;
        this.savedSearchFlag = false;
        this.savedJobsFlag = false;
        this.jobDetailsFlag = true;
        this.interviewsFlag = false;
    }

    public onClickBack($event) {

        if ($event.type) {
            if ($event.type === 'savedJobs') {
                this.onClickSavedJobs();
            } else if ($event.type === 'allJobs') {
                this.onClickAllJobs();
            } else if ($event.type === 'suggestedJobs') {
                this.onClickSuggestJobs();
            } else if ($event.type === 'interviews') {
                this.onClickInterviews();
            } else {

                this.onClickAllJobs();
            }

        }
    }

    public ngAfterViewInit() {

        jQuery(document).scroll(function (e) {
            let curScroll = jQuery(window).scrollTop();
            let docHeight = jQuery(document).height();
            let winHeight = jQuery(window).height();
            if (curScroll >= (docHeight - winHeight) * 0) {
                jQuery('#filter').fadeIn().show();
            } else {
                jQuery('#filter').fadeOut().hide();
            }
        });

        jQuery(document).ready(function () {
            jQuery('#tabs2').scrollTabs();
        });
    }

    public ngOnDestroy() {
        if (this.parameterObz) {
            this.parameterObz.unsubscribe();

        }
    }

    public ngOnInit() {

        this.currLan = this.accountService.getCurrLang();
        this.parameterObz = this.route.params;
        this.parameterObz.subscribe((params) => {
            window.scroll(0, 0);
            this.onReset();
            let mode = params['mode'];
            let id = null;
            if (params['jobTitle-id']) {
                let paramList = params['jobTitle-id'].split('-');

                id = +paramList[paramList.length - 1];

            } else {
                id = params['id'];
            }

            if (mode === 'suggested-jobs') {
                this.onClickSuggestJobs();
            } else if (mode === 'all' || mode === 'search') {
                this.locations = params['locations'];
                this.onClickAllJobs();
            } else if (mode === 'saved-searches') {
                this.onClickSavedSearch();
            } else if (mode === 'saved-jobs') {
                this.onClickSavedJobs();
            } else if (mode === 'my-jobs') {
                this.onClickMyJobs();
            } else if (mode === 'interviews') {
                this.onClickInterviews();
            } else if (id) {
                this.onClickjobDetails(id);
            } else {
                this.onClickAllJobs();
            }
        });

    }
}
