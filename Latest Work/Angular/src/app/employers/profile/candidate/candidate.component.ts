import { Component, OnInit, OnDestroy, AfterViewChecked } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// services
import { AccountService } from '../../../core/account/services/account.service';

@Component({

    selector: 'candidate-emp-profile',
    templateUrl: 'candidate.component.html',
    styleUrls: ['./candidate.scss']
})

export class CandidateComponent implements OnInit, OnDestroy {

    public companyId: number = null;
    public candidateId: number = null;

    public queryParamsObs;

    constructor(public accountService: AccountService, public _activeRoute: ActivatedRoute) {

        if (this.companyId == null) {
            this.companyId = this.accountService.getCompanyId();
        }
    }

    public ngOnDestroy() {
        this.queryParamsObs.unsubscribe();
    }

    public ngOnInit(): void {
        this.accountService.setCustomSeo();
        this.queryParamsObs = this._activeRoute.queryParams.subscribe((res) => {
            window.scroll(0, 0);
            this.candidateId = res['id'];
        });

    }
}
