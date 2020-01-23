import { OnInit, Component } from '@angular/core';
// Service
import { AccountService } from '../../../core/account/services/account.service';
import { LoaderService } from '../../../shared/services/loader.service';

var moment = require('moment-timezone');

declare var Intl: any;

@Component({

    selector: 'my-interviews',
    templateUrl: 'myJobsInterviews.component.html',
    styleUrls: ['./myJobsInterview.scss']

})


export class MyJobsInterviewsComponent implements OnInit {

    public currLan = 'en';
    public fixedTextHash = this.loaderService.getFixedText();
    public all_interview_details = null;
    public loadingFlag = true;
    public browserTimeZone = '';

    constructor(public accountService: AccountService, public loaderService: LoaderService) {
        this.browserTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    }

    public ngOnInit() {
        this.currLan = this.accountService.getCurrLang();
        this.accountService.getAllInterviewDetails().subscribe((res) => {
            this.all_interview_details = res['interviews'];
            this.loadingFlag = false;

        });
    }

    public timeCorrection(appointmentTime, timezone) {
        let appointmentSplit = appointmentTime.split('T');
        let appointmentTimeSplit = appointmentSplit[1].split('.');
        return moment.tz(appointmentSplit[0] + ' ' + appointmentTimeSplit[0], timezone);
    }

}
