import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// Services
import { AccountService } from '../../../core/account/services/account.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { ProfileService } from '../../../core/services/profile.service';
import { BehaviorSubject } from 'rxjs';
import { Location } from '@angular/common';

@Component({

    selector: 'candidate-emp-history',
    templateUrl: 'candidateHistoryComponent.html',
    styleUrls: ['./candidateHistory.scss']
})

export class CandidateHistoryComponent implements OnInit, OnDestroy {

    public fixedTextHash = this.loaderService.getFixedText();
    public userId: number = null;
    public queryParamsObs;
    public paramsObs;
    public currLan = 'en';
    public page = 1;
    public historyObj = null;
    public loadingFlag = false;
    public urlPath;
    public totalRecords$: BehaviorSubject<any> = new BehaviorSubject(0);

    constructor(public accountService: AccountService,
                public loaderService: LoaderService,
                public profileService: ProfileService,
                public location: Location,
                public activeRoute: ActivatedRoute) {

        this.accountService.setSwitchFlag(false);
        this.currLan = this.accountService.getCurrLang();
    }

    public ngOnDestroy() {
        this.queryParamsObs.unsubscribe();
        this.paramsObs.unsubscribe();
    }

    public goBack() {
        window.history.back();
    }

    public getValidateLength(list) {
        return ( list.length > 0 );
    }

    public ngOnInit(): void {
        this.accountService.setCustomSeo();
        if (this.location.path().indexOf('?') === -1) {
            this.urlPath = this.location.path();
        } else {
            this.urlPath = this.location.path().slice(0, this.location.path().indexOf('?'));
        }
        this.paramsObs = this.activeRoute.params.subscribe((selParams) => {
            window.scrollTo(0, 0);
            this.userId = selParams['id'];
            this.queryParamsObs = this.activeRoute.queryParams.subscribe((res) => {
                this.page = (res['page']) ? res['page'] : 1;
                this.loadingFlag = true;
                this.profileService.getHistory(this.userId, this.page)
                    .subscribe((historyRes) => {
                        this.historyObj = historyRes;
                        this.totalRecords$.next(historyRes['meta']['total_count']);
                        this.loadingFlag = false;
                    });
            });

        });

    }
}
