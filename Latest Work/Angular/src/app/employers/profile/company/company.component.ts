import { Component, OnInit } from '@angular/core';

// Services
import { AccountService } from '../../../core/account/services/account.service';

@Component({

    selector: 'company-section',
    templateUrl: 'company.component.html',
    styleUrls: ['./company.scss']
})

export class CompanyComponent implements OnInit {

    public companyId: number = null;

    constructor(public accountService: AccountService) {
        if (this.companyId == null) {
            this.companyId = this.accountService.getCompanyId();

        }
    }

    public ngOnInit(): void {
        window.scroll(0, 0);
    }

}
