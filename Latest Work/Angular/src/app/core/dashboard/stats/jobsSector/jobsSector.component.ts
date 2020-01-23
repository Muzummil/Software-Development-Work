import { Component, Input, OnInit } from '@angular/core';
import { StatsService } from '../../../../core/services/stats.service';
import { AccountService } from '../../../account/services/account.service';
import { LoaderService } from '../../../../shared/services/loader.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'jobs-sector',
    templateUrl: 'jobsSector.component.html',
    styleUrls: ['./jobsSector.scss'],
    providers: [StatsService, AccountService]
})

export class JobsSectorComponent implements OnInit {

    public ads;
    public adsLoading;
    isLoading = true;
    public stat;
    isLoadingS = true;
    public jobsBySector$: BehaviorSubject<any> = new BehaviorSubject(null);
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

        this.loadJobSectorStats();
        this.loadAds();
        this.currLan = this.accountService.getCurrLang();
    }

    public loadAds() {
        this.adsLoading = true;
    }

    public goBack() {
        window.history.back();
    }

    public loadJobSectorStats() {
        if (this.cached == false) {
            this._statsService.getJobsSectorStats()
                .subscribe(
                    stats => {
                        this.isLoadingS = false;
                        this.jobsBySector$.next(stats['job_applications_by_sector']);
                    },
                    error => {
                        this.accountService.getErrorCheck(error);
                    });
        } else {
            this.jobsStatsObs.subscribe(res => {
                this.isLoadingS = false;
            });

        }
    }

}
