import { Component, OnInit, Input } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { File } from '../../../shared/models/File';
import { AccountService } from '../../../core/account/services/account.service';
import { LoaderService } from '../../../shared/services/loader.service';

declare var jQuery: any;

@Component({

    selector: 'company-edit-mobile',
    templateUrl: 'companyEditMobile.component.html',
    styleUrls: ['./companyEditMobile.scss']

})

export class CompanyEditMobileComponent implements OnInit {

    @Input() companyObs: BehaviorSubject<any> = new BehaviorSubject(null);
    @Input() companyTeamObs: BehaviorSubject<any> = new BehaviorSubject(null);
    @Input() companyCultureObs: BehaviorSubject<any> = new BehaviorSubject(null);
    @Input() commonDataObs: BehaviorSubject<any> = new BehaviorSubject(null);
    @Input() sectorObs: BehaviorSubject<any> = new BehaviorSubject(null);
    @Input() companyTypesObs: BehaviorSubject<any> = new BehaviorSubject(null);
    @Input() companySizesObs: BehaviorSubject<any> = new BehaviorSubject(null);
    @Input() classificationsListObs: BehaviorSubject<any> = new BehaviorSubject(null);
    @Input() typeListObs: BehaviorSubject<any> = new BehaviorSubject(null);
    @Input() sizesListObs: BehaviorSubject<any> = new BehaviorSubject(null);
    @Input() logoUpdatedObs: BehaviorSubject<any> = new BehaviorSubject(false);
    @Input() coverUpdatedObs: BehaviorSubject<any> = new BehaviorSubject(false);
    @Input() file_profile: File;
    @Input() file_cover: File;

    @Input() companyId: number = null;

    public viewType = null;
    public currLan = 'en';
    public fixedTextHash = this.loaderService.getFixedText();

    constructor(public accountService: AccountService, public loaderService: LoaderService) {

    }

    public ngOnInit(): void {
        this.currLan = this.accountService.getCurrLang();
    }

    public onClickBack($event) {

        if ($event.operation === 'back') {
            this.viewType = null;
            window.scroll(0, 0);
        }
    }


}
