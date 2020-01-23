import { Component, OnInit, Input } from '@angular/core';
import { AccountService } from '../../../core/account/services/account.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { Location } from '@angular/common';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router } from '@angular/router';

@Component({
    selector: 'job-menu',
    templateUrl: 'jobMenu.component.html',
    styleUrls: ['./jobMenu.scss']
})

export class JobMenuComponent implements OnInit {

    @Input() activeFlag = 'all';

    public isPublic$: BehaviorSubject<any> = new BehaviorSubject(null);
    public currLan = 'en';
    public fixedTextHash = this.loaderService.getFixedText();

    constructor(public accountService: AccountService,
                public  loaderService: LoaderService,
                public _location: Location,
                public _router: Router) {

        this.isPublic$.next(this.getCheckPublic());
    }

    public ngOnInit() {
        this.currLan = this.accountService.getCurrLang();
    }

    public getCheckPublic() {

        let isPublic = !this.accountService.getAuth();
        return isPublic;
    }

}
