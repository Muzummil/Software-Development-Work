import { OnInit, Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../../account/services/account.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { Router, ActivatedRoute } from '@angular/router';
// directives
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from '../../../shared/config.service';

@Component({
    selector: 'login',
    templateUrl: 'login.component.html',
    styleUrls: ['./login.scss']
})

export class LoginComponent implements OnInit, OnDestroy {

    public form1: FormGroup;
    public queryParamsObs;
    public showSuccessActivated: boolean = false;
    public showErrorActivated: boolean = false;
    public errorFlag: boolean = false;
    public linkedinSpinner = false;
    public postinProgress = false;
    public facebookSpinner = false;
    public googleSpinner = false;
    public twitterSpinner = false;
    public errorMode = 1;
    public pristineFlag$: BehaviorSubject<any> = new BehaviorSubject(true);
    public currLan = 'en';
    public fixedTextHash = this.loaderService.getFixedText();
    public customReturnUrl: string;

    constructor(public accountService: AccountService,
                public _activeRoute: ActivatedRoute,
                public fb: FormBuilder,
                public _router: Router,
                public loaderService: LoaderService) {
        let elements1 = {
            username: ['', Validators.required],
            rememberme: [true],
            user_password: ['', Validators.required]
        };
        this.form1 = fb.group(elements1);

        this.accountService.setPageSeo('login');

    }

    public loginLinkedIn() {
        this.linkedinSpinner = true;
        window.location.href = ConfigService.getAPI() + 'users/auth/linkedin';
    }

    public loginFacebook() {
        this.facebookSpinner = true;
        window.location.href = ConfigService.getAPI() + 'users/auth/facebook';
    }

    public loginGoogle() {
        this.googleSpinner = true;
        window.location.href = ConfigService.getAPI() + 'users/auth/google_oauth2';
    }

    public loginTwitterIn() {
        this.twitterSpinner = true;
        window.location.href = ConfigService.getAPI() + 'users/auth/twitter_login';
    }

    public ngOnDestroy() {
        if (this.queryParamsObs) {
            this.queryParamsObs.unsubscribe();
        }
    }

    public ngOnInit(): void {
        this.accountService.setSwitchFlag(false);
        this.customReturnUrl = this._activeRoute.snapshot.queryParams['returnUrl'] || null;

        this.queryParamsObs = this._activeRoute.queryParams.subscribe((qparams) => {
            window.scroll(0, 0);
            if (qparams['confirmation'] == 'true') {

                this.showSuccessActivated = true;
                Observable.timer(4000).subscribe((val) => {
                    this.showSuccessActivated = false;
                });
            }

            if (qparams['confirmation'] == 'false') {

                this.showErrorActivated = true;
                Observable.timer(4000).subscribe((val) => {
                    this.showErrorActivated = false;
                });
            }

        });

        if (this.accountService.getAuth()) {
            if (this.accountService.getCheckEmployer()) {
                this._router.navigateByUrl(this.accountService.getCurrLangUrl() +
                    'employer/jobs');
            } else {
                this._router.navigateByUrl(this.accountService.getCurrLangUrl() +
                    ConfigService.jobseekerPath + '/profile');
            }
        }

        this.currLan = this.accountService.getCurrLang();
    }

    public loginUser() {
        this.pristineFlag$.next(false);
        if (this.form1.valid && !this.postinProgress) {
            this.postinProgress = true;
            this.accountService.getLoginUser(this.form1.value, this.customReturnUrl)
                .subscribe((res) => {
                this.errorFlag = false;
                this.postinProgress = false;
            }, (error) => {
                this.errorFlag = true;
                this.postinProgress = false;

                let errorJson = error['error'];
                if (errorJson['errors'][0] == 'deactivated') {
                    this.errorMode = 2;
                } else if (errorJson['errors'][0] == 'invalid_email') {
                    this.errorMode = 3;
                } else if (errorJson['errors'][0] == 'invalid_password') {
                    this.errorMode = 4;
                } else if (errorJson['errors'][0] == 'unconfirmed') {
                    this.errorMode = 5;
                } else {
                    this.errorMode = 1;
                }
            });
        }
    }
}
