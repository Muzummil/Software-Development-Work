import { Component, Input, OnInit, DoCheck, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Location } from '@angular/common';

import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountService } from '../../core/account/services/account.service';
import { LoaderService } from '../../shared/services/loader.service';
import { ConfigService } from '../../shared/config.service';
declare let ga: Function;

@Component({
    selector: 'base-top-header',
    templateUrl: 'baseHeaderBar.component.html',
    styleUrls: ['./baseHeaderBar.scss']
})

export class BaseHeaderBarComponent implements OnInit, DoCheck, OnDestroy {

    @Input() public navbarToggle = false;

    public cachedProfile$: BehaviorSubject<any> = new BehaviorSubject(null);
    public profileHeader$: BehaviorSubject<any> = new BehaviorSubject(null);
    public form1: FormGroup;
    public search_string: string;
    public isAuthorized$: BehaviorSubject<any> = new BehaviorSubject(null);
    public activeRouterObs;
    public sub;
    public isPublic$: BehaviorSubject<any> = new BehaviorSubject(null);
    public isHome$: BehaviorSubject<any> = new BehaviorSubject(null);
    public publicRoutes = ConfigService.publicRoutes;
    public currLan = 'en';
    public fixedTextHash = this.loaderService.getFixedText();
    public isInterviewPage: boolean = false;
    public hasSignUpChanel: boolean = (ConfigService.SIGNUP_CHANNEL === 'true');
    public showTranslation: boolean = (ConfigService.SHOW_TRANSLATION === 'true');

    constructor(public _router: Router,
                public loaderService: LoaderService,
                public _activeRoute: ActivatedRoute,
                public fb: FormBuilder,
                public accountService: AccountService,
                public _location: Location) {

        let elements1 = {
            search_string: ['']
        };
        this.form1 = fb.group(elements1);

        this.form1.controls['search_string'].valueChanges.subscribe((val) => {
            this.search_string = val;
        });

        this.sub = this._router.events.subscribe((params) => {

            this.isPublic$.next(!this.accountService.getAuth());
            this.isInterviewPage = this.accountService.checkInterview(this._location.path()
                .split(/[?#]/)[0]);
            if (this.publicRoutes.indexOf(this._location.path().split(/[?#]/)[0]) != -1) {
                this.isHome$.next(true);
            } else {
                this.isHome$.next(false);
            }

            this.isAuthorized$.next(this.accountService.getAuth());
        });

    }

    public ngOnInit(): any {
        this.getCheckPublic();
        if (this.publicRoutes.indexOf(this._location.path().split(/[?#]/)[0]) != -1) {
            this.isHome$.next(true);
        } else {
            this.isHome$.next(false);
        }

        this.currLan = this.accountService.getCurrLang();
    }

    public getCheckPublic() {
        let isPublic = !this.accountService.getAuth();
        this.isPublic$.next(isPublic);
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

    public goBack() {
        this.accountService.backClick();
    }

    public ngOnDestroy() {
        this.sub.unsubscribe();
    }

    public logout() {
        this.accountService.getLogOutUser();

    }

    public ngDoCheck() {
        this.profileHeader$.next(this.accountService.getProfileHeader());
    }

    public onSearch() {
        let pagination_url = {};
        this.activeRouterObs = this._activeRoute.queryParams.subscribe((params) => {
            for (let key in params) {
                if (params.hasOwnProperty(key)) {
                    pagination_url[key] = params[key];
                }
            }

            this.getCheckPublic();
            if (this.publicRoutes.indexOf(this._location.path()) != -1) {
                this.isHome$.next(true);
            } else {
                this.isHome$.next(false);
            }
        });
        pagination_url['title'] = this.search_string;
        this._router.navigate([this.accountService.getPath() + '/jobs'],
            {queryParams: pagination_url});
    }

}
