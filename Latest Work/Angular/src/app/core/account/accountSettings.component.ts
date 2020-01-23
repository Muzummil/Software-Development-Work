import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ActivatedRoute } from '@angular/router';

// Services
import { AccountService } from './services/account.service';
import { LoaderService } from '../../shared/services/loader.service';

// Validators
import { PasswordValidator } from '../../shared/validators/passwordValidator';

declare var jQuery;

@Component({

    selector: 'account-settings',
    templateUrl: 'accountSettings.component.html',
    styleUrls: ['./accountSettings.scss']
})

export class AccountSettingsComponent implements OnInit {

    // Observer
    public account$: BehaviorSubject<any> = new BehaviorSubject(null);
    public postsuccessFlag$: BehaviorSubject<any> = new BehaviorSubject(false);
    public deactivatedFlag$: BehaviorSubject<any> = new BehaviorSubject(null);
    public newletterSub$: BehaviorSubject<any> = new BehaviorSubject(false);
    public errorMessage = ' Sorry details could not be Updated.';

    // Variables
    public account: any;
    public suggestedJobNotificationId: number = 0;
    public blogPostNotificationId: number = 0;
    public pollNotificationId: number = 0;
    public candidateNotificationId: number = 0;
    public userType: string = '';

    // Forms
    public form1: FormGroup;

    // Flags
    public activateFlag: boolean;
    public subscribeNewsLetter: boolean;
    public postFlag: boolean = false;
    public loadingFlag1: boolean = false;
    public failedPostFlag: boolean = false;
    public currLan = 'en';
    public fixedTextHash = this.loaderService.getFixedText();

    constructor(public accountService: AccountService,
                public loaderService: LoaderService,
                public fb: FormBuilder,
                public route: ActivatedRoute,
                public _title: Title) {

        this.accountService.setSwitchFlag(false);
    }

    public ngOnInit() {
        this.accountService.setCustomSeo();
        let group = {};
        // group["username"] = [this.accountService.getUsername(), Validators.required];
        group['current_password'] = ['', Validators.required];
        group['new_password'] = ['', [Validators.required, PasswordValidator.complexPass]];
        group['new_password2'] = ['', [Validators.required, PasswordValidator.passwordMissmatch]];
        window.scroll(0, 0);
        this.currLan = this.accountService.getCurrLang();

        this.form1 = this.fb.group(group);

        this.activateFlag = true;
        this.subscribeNewsLetter = false;

        this.accountService.getNotification()
            .subscribe((res) => {
                    this.account = res;
                    this.account$.next(this.account);

                    this.suggestedJobNotificationId = this.account['job'];
                    this.blogPostNotificationId = this.account['blog'];
                    this.pollNotificationId = this.account['poll_question'];
                    this.candidateNotificationId = this.account['candidate'];
                    this.newletterSub$.next(this.account['newsletter']);
                },
                (error) => {
                    this.accountService.getErrorCheck(error);
                });

        this.userType = this.accountService.getUserType();
    }

    public onSubmitAccountSettings() {

        this.postFlag = true;
        if (this.form1.valid) {
            this.loadingFlag1 = true;

            this.accountService.getUpdateCredentials(this.form1.value)
                .subscribe((res) => {
                        this.loadingFlag1 = false;
                        this.postsuccessFlag$.next(true);
                        Observable.timer(2000).subscribe((val) => {
                            this.postsuccessFlag$.next(null);
                            this.postFlag = false;
                            this.form1.controls['new_password2'].reset();
                            this.form1.reset();
                        });

                    },
                    (error) => {
                        this.loadingFlag1 = false;
                        this.failedPostFlag = true;
                        error = error['error'];
                        if (error['current_password']) {
                            this.errorMessage = ' Current password is Invalid.';
                        } else if (error['password']) {
                            this.errorMessage = ' Your password is too Short.';
                        } else if (error['current_password']) {
                            this.errorMessage = ' Your current password is Wrong.';
                        } else {
                            this.errorMessage = ' Sorry details could not be Updated.';
                        }

                        Observable.timer(2000).subscribe((val) => {
                            this.failedPostFlag = false;
                        });
                        this.accountService.getErrorCheck(error);
                    });

        }
    }

}
