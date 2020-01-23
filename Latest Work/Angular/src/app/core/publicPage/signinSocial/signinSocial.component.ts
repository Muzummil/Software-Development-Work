import { Component, OnInit } from '@angular/core';

// Services
import { AccountService } from '../../account/services/account.service';

@Component({

    selector: 'signin-social',
    templateUrl: 'signinSocial.component.html',
    styleUrls: ['./signinSocial.scss']
})


export class SigninSocialComponent implements OnInit {

    constructor(public accountService: AccountService) {

    }

    public ngOnInit() {
        window.scroll(0, 0);
        this.accountService.setSwitchFlag(false);
    }
}
