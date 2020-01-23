import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BasicValidators } from '../../../shared/validators/basicValidators';
import { AccountService } from '../../account/services/account.service';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { LoaderService } from '../../../shared/services/loader.service';

@Component({
    selector: 'resend-confirmation',
    templateUrl: 'resendConfirmation.component.html',
    styleUrls: ['./resendConfirmation.scss']
})

export class ResendConfirmationComponent implements OnInit {

    public confirmForm: FormGroup;
    public pristineFlag$: BehaviorSubject<any> = new BehaviorSubject(true);
    public errorMessage = null;
    public successMessage = null;
    public postDoneFlag = false;
    public fixedTextHash = this.loaderService.getFixedText();
    public currLan;

    constructor(public accountService: AccountService,
                public loaderService: LoaderService,
                public _fb: FormBuilder,
                public router: Router) {

        this.accountService.setPageSeo('resend_confirmation');
    }

    public ngOnInit() {
        window.scroll(0, 0);
        this.currLan = this.accountService.getCurrLang();
        this.accountService.setSwitchFlag(false);
        this.confirmForm = this._fb.group({
            email: ['', BasicValidators.email]
        });

    }

    public setTrim() {
        this.errorMessage = null;
        this.successMessage = null;
        this.confirmForm.controls['email']
            .setValue(this.confirmForm.controls['email'].value.trim().toLowerCase());
    }

    public submitEmail() {
        this.pristineFlag$.next(false);

        if (this.confirmForm.valid) {
            let postData = {
                user: {
                    email: this.confirmForm.value['email'].trim()
                }
            };
            this.postDoneFlag = true;
            this.accountService.sendConfirmationEmail(postData).subscribe((res) => {
                this.successMessage = this.fixedTextHash['email_sent_to_account'][this.currLan];
                this.errorMessage = null;
                this.pristineFlag$.next(true);
                Observable.timer(2000).subscribe((val) => {
                    this.router.navigate([this.accountService.getCurrLangUrl() +
                    '/login']);
                });
            }, (error) => {
                this.postDoneFlag = false;
                this.errorMessage = this.fixedTextHash['email_not_registered'][this.currLan];
                this.successMessage = null;
                this.pristineFlag$.next(true);
            });
        }
    }
}
