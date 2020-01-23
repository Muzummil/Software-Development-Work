import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

// Services
import { AccountService } from '../../../core/account/services/account.service';
import { LoaderService } from '../../../shared/services/loader.service';

@Component({
    selector: 'complete-profile-progress-bar',
    templateUrl: 'progressBar.component.html',
    styleUrls: ['./progressBar.component.scss']

})

export class ProgressBarComponent {

    @Input() public step = 1;
    public jobseekerType = '';
    public queryParamsObs;
    public currLan = 'en';
    public isGotData:boolean=false;

    public firstText;
    public fixedTextHash = this.loaderService.getFixedText();

    constructor(public accountService: AccountService,
        public _activeRoute: ActivatedRoute,
        public loaderService: LoaderService,
        public _router: Router) {
        AccountService.cachedProfile$.subscribe((selProfile) => {
            if (selProfile) {
                this.jobseekerType = selProfile.jobseeker_type;
                this.firstText = this.jobseekerType+'_first';
                this.isGotData = true;
            }
        });
        this.currLan = this.accountService.getCurrLang();


    }

}
