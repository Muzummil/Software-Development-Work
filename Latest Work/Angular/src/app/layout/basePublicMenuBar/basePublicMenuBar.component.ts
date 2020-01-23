import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountService } from '../../core/account/services/account.service';
import { LoaderService } from '../../shared/services/loader.service';
import { ConfigService } from '../../shared/config.service';

@Component({
    selector: 'base-public-top-menu',
    templateUrl: 'basePublicMenuBar.component.html',
    styleUrls: ['./basePublicMenuBar.scss']
})

export class BasePublicMenuBarComponent implements OnInit {

    public currLan = 'en';
    public fixedTextHash = this.loaderService.getFixedText();
    public hasSignUpChanel: boolean = (ConfigService.SIGNUP_CHANNEL === 'true');
    public hasCareerFair:boolean = false;
    constructor(public _router: Router,
                public loaderService: LoaderService,
                public _activeRoute: ActivatedRoute,
                public accountService: AccountService) {

    }

    public ngOnInit(): any {
        if(ConfigService.HAS_CAREERFAIR == "true"){
            this.hasCareerFair = true;
        }
        this.currLan = this.accountService.getCurrLang();
    }

    public searchFilter(titleSearch) {

        let params = {};
        if (titleSearch !== '') {
            params['title'] = titleSearch;

            this._router.navigate(
                [this.accountService.getCurrLangUrl() +
                this.accountService.getPath() + '/jobs'], {queryParams: params});
        }
    }

}
