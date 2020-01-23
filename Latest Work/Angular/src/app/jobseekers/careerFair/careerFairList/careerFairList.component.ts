import { OnInit, Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../../../core/account/services/account.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { Router, ActivatedRoute } from '@angular/router';
// directives
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { CareerFairService } from '../../../core/services/careerFair.service';
import { ConfigService } from '../../../shared/config.service';

declare var jQuery: any;
@Component({
    selector: 'career-fair',
    templateUrl: 'careerFairList.component.html',
    styleUrls: ['./careerFairList.scss']
})

export class CareerFairListComponent implements OnInit, OnDestroy {

    public form1: FormGroup;
    public queryParamsObs;
    public errorFlag: boolean = false;
    public pristineFlag$: BehaviorSubject<any> = new BehaviorSubject(true);
    public currLan = 'en';
    public fixedTextHash = this.loaderService.getFixedText();
    public careerFairList = [];
    public totalRecords$: BehaviorSubject<any> = new BehaviorSubject(0);
    public showSpinner = false;

    constructor(public accountService: AccountService,
                public _activeRoute: ActivatedRoute,
                public careerFair: CareerFairService,
                public fb: FormBuilder,
                public _router: Router,
                public loaderService: LoaderService) {

        this.accountService.setPageSeo('careerFair');

    }

    public ngOnDestroy() {
        if (this.queryParamsObs) {
            this.queryParamsObs.unsubscribe();
        }
    }

    public ngOnInit(): void {
        this.showSpinner = true;
        this.currLan = this.accountService.getCurrLang();
        this._activeRoute.queryParams.subscribe((params) => {
            this.careerFair.getAllActiveCareerFairs(params['page']).subscribe((res) =>{
                this.careerFairList = res['career_fairs'];
                this.showSpinner = false;
                this.totalRecords$.next(res['meta']['total_count']);
            });

        });

    }

    public getPageUrl() {
        return ConfigService.PAGE_URL;
    }

}
