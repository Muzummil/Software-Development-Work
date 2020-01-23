import { Directive, Component, OnInit, ElementRef, Inject, AfterViewChecked } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

// services
import { AccountService } from '../../core/account/services/account.service';
import { StatsService } from '../../core/services/stats.service';
import { LoaderService } from '../../shared/services/loader.service';

@Component({
    selector: 'most-viewed-jobs-employer',
    templateUrl: 'mostViewedJobs.component.html',
    styleUrls: ['./mostViewedJobs.scss']
})

export class MostViewedJobsComponent implements OnInit {

    public companyId: number = null;
    public currentPage: number = 1;

    // Observables
    public topViewedJobs$: BehaviorSubject<any> = new BehaviorSubject(null);
    public showSpinner$: BehaviorSubject<any> = new BehaviorSubject(false);
    public totalRecords$: BehaviorSubject<any> = new BehaviorSubject(0);

    public activeRouterObs;
    public currLan = 'en';
    public fixedTextHash = this.loaderService.getFixedText();

    constructor(public accountService: AccountService,
                public loaderService: LoaderService,
                public _statsService: StatsService,
                public _activeRoute: ActivatedRoute) {

        if (this.companyId == null) {
            this.companyId = this.accountService.getCompanyId();

        }
        this.accountService.setSwitchFlag(false);

    }

    public ngOnInit() {
        this.currLan = this.accountService.getCurrLang();
        // URL Params Fetch
        this.activeRouterObs = this._activeRoute.queryParams.subscribe((params) => {
            window.scroll(0, 0);
            this.showSpinner$.next(true);

            this.currentPage = (params['page']) ? params['page'] : 1;
            this._statsService.getTopViewedJobs(this.currentPage).subscribe((res) => {
                this.topViewedJobs$.next(res);
                this.showSpinner$.next(false);

            }, (error) => {
                this.accountService.getErrorCheck(error);
            });

        });
    }
}
