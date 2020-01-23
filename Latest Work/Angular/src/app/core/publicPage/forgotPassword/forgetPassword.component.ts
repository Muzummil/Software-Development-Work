import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BasicValidators } from '../../../shared/validators/basicValidators';
import { AccountService } from '../../account/services/account.service';
import { LoaderService } from '../../../shared/services/loader.service';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

declare var jQuery: any;

@Component({

    selector: 'forgot-password',
    templateUrl: 'forgetPassword.component.html',
    styleUrls: ['./forgotPassword.scss']
})

export class ForgetPasswordComponent implements OnInit {

    public forgetForm: FormGroup;
    public pristineFlag$: BehaviorSubject<any> = new BehaviorSubject(true);
    public errorMessage = null;
    public successMessage = null;
    public postDoneFlag = false;
    public currLan = 'en';
    public fixedTextHash = this.loaderService.getFixedText();

    constructor(public accountService: AccountService,
                public loaderService: LoaderService,
                public _fb: FormBuilder,
                public router: Router) {

        this.accountService.setPageSeo('forgot_password');
    }

    public ngOnInit() {
        window.scroll(0, 0);
        this.accountService.setSwitchFlag(false);
        this.forgetForm = this._fb.group({
            email: ['', BasicValidators.email]
        });

        this.currLan = this.accountService.getCurrLang();
    }

    public setTrim() {
        this.errorMessage = null;
        this.successMessage = null;
        this.forgetForm.controls['email'].setValue(this.forgetForm.controls['email'].value.trim().toLowerCase());
    }

    public submitEmail() {
        this.pristineFlag$.next(false);

        if (this.forgetForm.valid) {
            let postData = {
                user: {
                    email: this.forgetForm.value['email'].trim()
                }
            };
            this.postDoneFlag = true;
            this.accountService.sendForgetPasswordEmail(postData).subscribe((res) => {
                this.successMessage = 'An Email has been sent to you to reset your password.';
                this.errorMessage = null;
                this.pristineFlag$.next(true);
                Observable.timer(2000).subscribe((val) => {
                    this.router.navigate(['/login']);
                });
            }, (error) => {
                this.postDoneFlag = false;
                this.errorMessage = 'Sorry, this email ID is not registered with us.';
                this.successMessage = null;
                this.pristineFlag$.next(true);
            });
        }
    }
}
