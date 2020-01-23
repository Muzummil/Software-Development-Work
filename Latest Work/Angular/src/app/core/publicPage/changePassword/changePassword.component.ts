import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// @ts-ignore
import { AccountService } from '../../account/services/account.service';
import { Observable } from 'rxjs/Observable';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { LoaderService } from '../../../shared/services/loader.service';

declare var jQuery: any;

@Component({

    selector: 'change-password',
    templateUrl: 'changePassword.component.html',
    styleUrls: ['./changePassword.scss']
})

export class ChangePasswordComponent implements OnInit {

    public changePasswordForm: FormGroup;
    public pristineFlag$: BehaviorSubject<any> = new BehaviorSubject(true);
    public errorMessage = null;
    public forgoturl = false;
    public successMessage = null;
    public postDoneFlag = false;
    public passwordToken: string = null;
    public email: string = null;
    public currLan = 'en';
    public fixedTextHash = this.loaderService.getFixedText();

    constructor(public accountService: AccountService,
                public loaderService: LoaderService,
                public _fb: FormBuilder,
                public router: Router, public _activeRoute: ActivatedRoute) {

        this.accountService.setPageSeo('change_password');
    }

    public ngOnInit() {
        window.scroll(0, 0);
        this.currLan = this.accountService.getCurrLang();
        this.accountService.setSwitchFlag(false);
        this.changePasswordForm = this._fb.group({
            password: ['', Validators.required],
            password_confirmation: ['', Validators.required]
        });

        this._activeRoute.queryParams.subscribe((params) => {
            this.passwordToken = params['reset_password_token'];
            this.email = params['email'];
        });

        this.accountService.setSwitchFlag(false);
    }

    public changePassword() {
        this.pristineFlag$.next(false);

        if (this.changePasswordForm.valid) {
            let postData = {
                user: {
                    password: this.changePasswordForm.value['password'],
                    password_confirmation: this.changePasswordForm.value['password_confirmation'],
                    reset_password_token: this.passwordToken,
                    email: this.email
                }
            };

            this.postDoneFlag = true;
            this.accountService.changePassword(postData).subscribe((res) => {
                this.successMessage =
                    this.fixedTextHash['password_change_success_message'][this.currLan];
                this.errorMessage = null;
                this.forgoturl = false;
                this.pristineFlag$.next(true);
                Observable.timer(2000).subscribe((val) => {
                    this.router.navigate(['/login']);
                });

            }, (error) => {

                this.postDoneFlag = false;

                let errorJson = error['error'];

                if (errorJson['errors']['password']) {
                    this.errorMessage = this.fixedTextHash['password_too_shot'][this.currLan];
                } else if (errorJson['errors']['password_confirmation']) {
                    this.errorMessage = this.fixedTextHash['password_not_match'][this.currLan];
                } else if (errorJson['errors']['email']) {
                    this.errorMessage = this.fixedTextHash['email_not_registered'][this.currLan];
                } else if (errorJson['errors']['reset_password_token']) {
                    this.errorMessage = this.fixedTextHash['reset_password_expired'][this.currLan];
                    this.forgoturl = true;
                } else {
                    this.errorMessage = this.fixedTextHash['try_again_error'][this.currLan];

                }

                this.successMessage = null;
                this.pristineFlag$.next(true);
            });
        }
    }
}
