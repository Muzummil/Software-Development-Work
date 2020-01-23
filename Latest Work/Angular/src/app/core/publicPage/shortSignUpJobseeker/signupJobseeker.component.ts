import { Component } from '@angular/core';
import { AccountService } from '../../account/services/account.service';
import { Router } from '@angular/router';
import { ConfigService } from '../../../shared/config.service';
import { LoaderService } from 'app/shared/services/loader.service';

@Component({

    selector: 'signup-jobseeker',
    templateUrl: 'signupJobseeker.component.html',
    styleUrls: ['./signJobseeker.scss']
})

export class SignupJobseekerComponent {
    public currLan = 'en';
    public fixedTextHash = this.loaderService.getFixedText();
    public titleIndex = 'jobseeker';
    public showCoopProgram: boolean = false;
    constructor(public accountService: AccountService, public router: Router,
        public loaderService: LoaderService) {
        this.currLan = this.accountService.getCurrLang();
        window.scroll(0, 0);
        this.accountService.setSwitchFlag(false);
        if (ConfigService.SIGNUP_CHANNEL === 'false') {
            this.router.navigate(['/signup-jobseeker']);
        }
        if(ConfigService.SHOW_EXP_HIRED == "true"){
            this.titleIndex = 'exp_hires';
        }
        if(ConfigService.SHOW_COOP_PROGRAM == 'true'){
            this.showCoopProgram = true;
        }

    }
    navigate(url) {
        let Router = this.router;
        if(this.currLan=='ar'){
            url = 'ar' + url;
        }
        Router.navigateByUrl(url);
        setTimeout(function () {
            Router.navigateByUrl(url);
        }, 50);
    }
}
