import { Component, Input, OnInit } from '@angular/core';
import { StatsService } from '../../../../core/services/stats.service';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { AccountService } from '../../../account/services/account.service';
import { LoaderService } from '../../../../shared/services/loader.service';

@Component({

    selector: 'jobs-country',
    templateUrl: 'jobsCountry.component.html',
    styleUrls: ['./jobsCountry.scss'],
    providers: [StatsService]
})

export class JobsCountryComponent implements OnInit {

    public statNumeric;
    public ads;
    public adsLoading;
    isLoading = true;
    public numericStatLoading: boolean = true;
    public stat;
    postsLoading;
    isLoadingC = true;
    public jobsByCountry$: BehaviorSubject<any> = new BehaviorSubject(null);
    public currLan = 'en';
    public fixedTextHash = this.loaderService.getFixedText();

    @Input() cached: boolean = false;
    @Input() jobsStatsObs: Observable<any> = Observable.of(null);

    constructor(public _statsService: StatsService,
                public accountService: AccountService,
                public loaderService: LoaderService) {
        this.accountService.setSwitchFlag(false);
    }

    public ngOnInit(): any {

        this.loadJobCountryStats();
        this.loadAds();
        this.currLan = this.accountService.getCurrLang();
    }

    public loadAds() {
        this.adsLoading = true;
    }

    public goBack() {
        window.history.back();
    }

    public loadJobCountryStats() {

        if (this.cached == false) {
            this._statsService.getJobsCountryStats()
                .subscribe(
                    (stats) => {
                        this.isLoadingC = false;
                        this.jobsByCountry$.next(stats['job_applications_by_country']);
                    },
                    (error) => {
                        this.accountService.getErrorCheck(error);
                    });

        } else {
            this.jobsStatsObs.subscribe((res) => {
                this.isLoadingC = false;
            });
        }
    }

}
