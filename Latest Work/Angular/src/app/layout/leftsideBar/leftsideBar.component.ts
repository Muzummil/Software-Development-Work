import { Component, Output, EventEmitter, ElementRef, Inject, OnInit } from '@angular/core';
import { AccountService } from '../../core/account/services/account.service';
import { Location } from '@angular/common';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { LoaderService } from '../../shared/services/loader.service';
import { ConfigService } from '../../shared/config.service';

declare var jQuery: any;

@Component({
    selector: 'leftside-bar',
    templateUrl: 'leftsideBar.component.html',
    styleUrls: ['./leftsideBar.scss']
})

export class LeftsideBarComponent implements OnInit {

    public navbarToggle = false;
    public isAuthorized$: BehaviorSubject<any> = new BehaviorSubject(null);
    public activeMenu: string;
    public search_string: string;
    public showMobileSearch = false;
    public activeRouterObs;
    public isPublic: boolean;
    public form1: FormGroup;
    public sub;
    public path = 'jobseeker';
    public isInterviewPage: boolean = false;
    public currentpage = '';
    elementRef: ElementRef;
    public currLan = 'en';
    public fixedTextHash = this.loaderService.getFixedText();
    public showFoldering: boolean = (ConfigService.SHOW_FOLDERING === 'true');

    public hasCareerFair:boolean = false;
    @Output() change = new EventEmitter();

    constructor(@Inject(ElementRef) elementRef: ElementRef,
                public fb: FormBuilder,
                public _router: Router,
                public accountService: AccountService,
                public loaderService: LoaderService,
                @Inject(SlimLoadingBarService) public _slimLoadingBarService: SlimLoadingBarService,
                public _activeRoute: ActivatedRoute,
                public _location: Location) {
        this.elementRef = elementRef;
        let elements1 = {
            search_string: ['']
        };
        this.form1 = fb.group(elements1);

        this.form1.controls['search_string'].valueChanges.subscribe((val) => {
            this.search_string = val;
        });

        this.sub = this._router.events.subscribe((params) => {

            this.isInterviewPage =
                this.accountService.checkInterview(this._location.path().split(/[?#]/)[0]);

            let url = this._router.url;
            let urlList = url.split('/');
            this.currentpage = urlList[(urlList.length - 1)];
            this.isAuthorized$.next(this.accountService.getAuth());
            this.getCheckPublic();
        });
    }

    public getLoaderBar(currentPage = '') {
        if (this.currentpage != currentPage) {
            this._slimLoadingBarService.start(() => {
            });
        }
    }

    public getAuth() {

        if (!this.accountService.getAuth()) {
            this._router.navigate([this.accountService.getCurrLangUrl()]);
        }
    }

    public toggleNavbar(e: any, activeMenu: string = 'profile') {

        if (this.navbarToggle) {
            this.navbarToggle = false;
        } else {
            this.navbarToggle = true;
        }

        this.change.emit({navbarToggle: this.navbarToggle});
        this.activeMenu = activeMenu;

    }

    public getCandidatePath() {
        return '/candidate';
    }

    public ngOnInit() {
        if(ConfigService.HAS_CAREERFAIR == "true"){
            this.hasCareerFair = true;
        }
        this.currLan = this.accountService.getCurrLang();
    }

    public getCheckPublic() {
        let isPublic = !this.accountService.getAuth();
    }

    public logout() {
        this.accountService.getLogOutUser();
    }

    public ngOnDestroy() {
        this.sub.unsubscribe();
    }

    public onSearch() {
        let pagination_url = {};

        this.activeRouterObs = this._activeRoute.queryParams.subscribe(params => {
            for (var key in params) {
                if (params.hasOwnProperty(key)) {
                    pagination_url[key] = params[key];
                }
            }

        });
        pagination_url['title'] = this.search_string;

        this._router.navigate([this.accountService.getCurrLangUrl() +
        this.accountService.getPath() + '/jobs'], {queryParams: pagination_url});
    }

}
