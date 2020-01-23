import { Component, Input, OnInit } from '@angular/core';
import { AccountService } from '../../../core/account/services/account.service';
import { LoaderService } from '../../../shared/services/loader.service';

@Component({

    selector: 'emp-profile-topmenu',
    templateUrl: 'topMenu.component.html'
})

export class TopMenuComponent implements OnInit {

    @Input() activeFlag = 'profile';
    public currLan = 'en';
    public fixedTextHash = this.loaderService.getFixedText();

    constructor(public accountService: AccountService,
                public loaderService: LoaderService) {
    }

    public ngOnInit() {
        this.currLan = this.accountService.getCurrLang();
    }
}
