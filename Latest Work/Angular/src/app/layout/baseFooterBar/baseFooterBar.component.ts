import { Component, AfterViewChecked, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AccountService } from '../../core/account/services/account.service';
import { LoaderService } from '../../shared/services/loader.service';
import { ConfigService } from '../../shared/config.service';

@Component({
    selector: 'base-footer-bar',
    templateUrl: 'baseFooterBar.component.html',
    styleUrls: ['./baseFooterBar.scss']
})
export class BaseFooterBarComponent implements AfterViewChecked, OnInit, OnDestroy {
    public loadData$: BehaviorSubject<any> = new BehaviorSubject(false);
    public isHome$: BehaviorSubject<any> = new BehaviorSubject(null);
    public isAuthorized$: BehaviorSubject<any> = new BehaviorSubject(false);
    public sub;
    public publicRoutes = ConfigService.publicRoutes;
    public currLan = 'en';
    public fixedTextHash = this.loaderService.getFixedText();
    public isInterviewPage: boolean = false;

    constructor(public accountService: AccountService,
                public _location: Location,
                public _router: Router,
                public loaderService: LoaderService) {

        this.sub = this._router.events.subscribe((params) => {
            this.isInterviewPage = this.accountService
                .checkInterview(this._location.path().split(/[?#]/)[0]);
            if (this.publicRoutes.indexOf(this._location.path()) != -1) {
                this.isHome$.next(true);
            } else {
                this.isHome$.next(false);
            }
            this.isAuthorized$.next(this.accountService.getAuth());
        });
    }

    public ngOnDestroy() {
        this.sub.unsubscribe();
    }

    public ngAfterViewChecked() {
        let loading = document.getElementsByClassName('load-data-js');
        if (loading && loading.length > 0) {
            this.loadData$.next(true);
        }
    }

    public ngOnInit(): void {
        this.currLan = this.accountService.getCurrLang();
    }
}
