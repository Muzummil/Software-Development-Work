import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account/services/account.service';

@Component({

    selector: 'policy',
    templateUrl: 'policy.component.html'
})

export class PolicyComponent  implements OnInit{

    constructor(public accountService: AccountService) {
        this.accountService.setSwitchFlag(false);
        this.accountService.setPageSeo('privacy_policy');
    }

    public ngOnInit() {
        window.scrollTo(0, 0);

    }
}
