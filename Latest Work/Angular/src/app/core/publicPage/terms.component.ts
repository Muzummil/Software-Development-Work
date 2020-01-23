import {Component} from '@angular/core';
import {AccountService} from '../account/services/account.service';


declare var jQuery:any;
@Component({

    selector: "terms",
    templateUrl: "terms.component.html"
})


export class TermsComponent {

    constructor(public accountService:AccountService) {
        this.accountService.setSwitchFlag(false);
        this.accountService.setPageSeo('terms_conditions');
        window.scrollTo(0,0);
    }
}
