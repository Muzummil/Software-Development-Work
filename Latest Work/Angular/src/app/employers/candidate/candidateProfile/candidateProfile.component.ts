import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// Services
import { AccountService } from '../../../core/account/services/account.service';

@Component({

    selector: 'candidate-emp-profile',
    templateUrl: 'candidateProfile.component.html',
    styleUrls: ['./candidateProfile.scss']
})

export class CandidateProfileComponent implements OnInit, OnDestroy {

    public companyId: number = null;
    public candidateId: number = null;
    public jobId: number = null;

    public appliedFlag: boolean = true;
    public queryParamsObs;
    public paramsObs;

    constructor(public accountService: AccountService, public _activeRoute: ActivatedRoute) {

        if (this.companyId == null) {
            this.companyId = this.accountService.getCompanyId();
        }
        this.accountService.setSwitchFlag(false);

    }

    public ngOnDestroy() {
        this.queryParamsObs.unsubscribe();
        this.paramsObs.unsubscribe();
    }

    public ngOnInit(): void {
        this.accountService.setCustomSeo();
        this.paramsObs = this._activeRoute.params.subscribe((selParams) => {
            window.scrollTo(0, 0);
            this.candidateId = selParams['id'];
            this.queryParamsObs = this._activeRoute.queryParams.subscribe((res) => {

                if (res['job_id']) {
                    this.jobId = res['job_id'];
                }
            });

        });

    }

}
