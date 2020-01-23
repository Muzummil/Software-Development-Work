import { Component, Input } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

// Services
import { AccountService } from '../../../core/account/services/account.service';

declare var jQuery: any;

@Component({

    selector: 'offer-letter',
    templateUrl: 'offerletter.component.html',
    styleUrls: ['./offerLetter.scss']

})

export class OfferLetterComponent {

    @Input() jobTitle;
    @Input() description;
    @Input() candidateDetailsObs: BehaviorSubject<any>;

    public employerObj: BehaviorSubject<any> = new BehaviorSubject(null);
    public todayDate;

    constructor(public accountService: AccountService) {

        this.accountService.getEmployerDetails(this.accountService.getEmployerId())
            .subscribe((res) => {
                this.employerObj.next(res);
            }
            , (error) => {
                this.accountService.getErrorCheck(error);
            });

    }
}
