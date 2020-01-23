import { Component, Input, OnInit } from '@angular/core';

// services
import { AccountService } from '../../core/account/services/account.service';
import { LoaderService } from '../../shared/services/loader.service';

@Component({
    selector: 'emp-profile-topmenu',
    templateUrl: 'topMenu.component.html'
})

export class TopMenuComponent implements OnInit {

    @Input() activeFlag = 'profile';
    public showFlag: boolean = null;
    public currLan = 'en';
    public fixedTextHash = this.loaderService.getFixedText();

    constructor(public accountService: AccountService, public loaderService: LoaderService) {

        this.accountService.getActiveEmployerPermissionList().subscribe((res) => {
            if (res.indexOf('search_jobseekers') !== -1) {
                this.showFlag = true;
            } else {
                this.showFlag = false;
            }
        });
    }

    public ngOnInit(): any {
        this.currLan = this.accountService.getCurrLang();
    }

}