/*
 * Angular 2 decorators and services
 */
import {
    Component,
    OnInit,
    ViewEncapsulation
} from '@angular/core';

import { Location } from '@angular/common';
import { AccountService } from './core/account/services/account.service';
import { MetaService } from 'ng2-meta';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ConfigService } from './shared/config.service';

declare let ga: Function;

/*
 * App Component
 * Top Level Component
 */
@Component({
    selector: 'app-eng',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './app.eng.ar.component.html'

})
export class AppEngComponent implements OnInit {
    public navbarToggle = false;
    public isPublic: boolean = true;
    public isAuthorized$: BehaviorSubject<any> = new BehaviorSubject(null);
    public router;
    public sub;
    public isHome$: BehaviorSubject<any> = new BehaviorSubject(null);
    public isInterview$: BehaviorSubject<any> = new BehaviorSubject(null);
    public publicRoutes = ConfigService.publicRoutes;

    constructor(
        public accountService: AccountService,
        public _location: Location) {
        // this.accountService.setSwitchPage();
        this.accountService.setS3Json();
        window['prerenderReady'] = false;
    }

    public ngOnInit(): any {
        this.router = this.accountService.getRouterObs();
        this.router.events.subscribe((res) => {

            this.isAuthorized$.next(this.accountService.getAuth());
            this.isPublic = this.accountService.getIsPublic();

            this.isInterview$.next(this.accountService.
            checkInterview(this._location.path().split(/[?#]/)[0]));
            if (this.publicRoutes.indexOf(this._location.path().split(/[?#]/)[0]) !== -1) {
                this.isHome$.next(true);
            } else {
                this.isHome$.next(false);
            }
        });

        this.setchangeOrientation();

    }

    public setchangeOrientation() {
        this.accountService.setchangeOrientation('en');
    }



    public onMenuToggle($event: any) {
        this.navbarToggle = $event.navbarToggle;
    }

}
