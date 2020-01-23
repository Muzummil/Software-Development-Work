import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

// services
import { AccountService } from '../../core/account/services/account.service';
import { LoaderService } from '../../shared/services/loader.service';
import { StatsService } from '../../core/services/stats.service';

@Component({
    selector: 'most-viewed-profiles-employer',
    templateUrl: 'mostViewedProfiles.component.html',
    styleUrls: ['./mostViewedProfile.scss']
})

export class MostViewedProflesComponent implements OnInit {

    public companyId: number = null;
    public currentPage: number = 1;
    public activeRouterObs;
    public currLan = 'en';
    public fixedTextHash = this.loaderService.getFixedText();

    // Observable
    public topViewedProfiles$: BehaviorSubject<any> = new BehaviorSubject(null);

    public showSpinner$: BehaviorSubject<any> = new BehaviorSubject(false);
    public totalRecords$: BehaviorSubject<any> = new BehaviorSubject(0);

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
            this._statsService.getTopViewedProfiles(this.currentPage).subscribe((res) => {
                    this.topViewedProfiles$.next(res);
                    this.showSpinner$.next(false);
                }
                , (error) => {
                    this.accountService.getErrorCheck(error);
                });

        });

    }
}
