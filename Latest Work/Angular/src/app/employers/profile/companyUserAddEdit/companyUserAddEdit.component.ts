import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router, ActivatedRoute } from '@angular/router';

// Services
import { AccountService } from '../../../core/account/services/account.service';
import { CompanyService } from '../../../core/services/company.service';

// Validations
import { BasicValidators, TypeValidators } from '../../../shared/validators/basicValidators';
import { PasswordValidator } from '../../../shared/validators/passwordValidator';
import { LoaderService } from '../../../shared/services/loader.service';

declare var jQuery: any;

@Component({
    selector: 'company-users',
    templateUrl: 'companyUserAddEdit.component.html',
    styleUrls: ['./companyUserAddEdit.scss']
})

export class CompanyUserAddEditComponent implements OnInit, OnDestroy {

    public isActive$: BehaviorSubject<any> = new BehaviorSubject(null);
    public paramsObs;
    public userId: number = null;
    public selId: number = null;
    public textPrint = 'Add New User';

    // Forms
    public userForm: FormGroup;
    public errorMessage = 'Sorry your invitation could not be sent';
    public currLan = 'en';
    public fixedTextHash = this.loaderService.getFixedText();

    public permissionCategory = {
        company_info: false, candidate_search: false, brand_related: false
    };

    public permissionParams = {
        edit_company: false,
        invite_connection: false,
        create_job: false,
        edit_job_application_status: false,
        destroy_job: false,
        search_jobseekers: false,
        create_blog: false,
        manage_blog: false
    };

    // Flag
    public loadDataFlag: boolean = false;
    public readmodeFields: boolean = false;
    public readmodeEmail: boolean = false;
    public postFlag: boolean = false;
    public successFlag: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public errorFlag: BehaviorSubject<boolean> = new BehaviorSubject(false);

    constructor(public accountService: AccountService,
                public _fb: FormBuilder,
                public _companyService: CompanyService,
                public loaderService: LoaderService,
                public _activeRoute: ActivatedRoute,
                public _router: Router) {

    }

    public onSetPermission(mode, val) {

        this.permissionParams[mode] = val;
    }

    public onSaveAccount() {

        let perArry = [];

        this.postFlag = true;

        if (this.userForm.valid) {
            let role = (this.userForm.value['role'] === 'false') ? 'company_user' : 'company_admin';

            for (let key in this.permissionParams) {
                if (this.permissionParams.hasOwnProperty(key)) {

                    if (role === 'company_admin' || this.permissionParams[key]) {
                        perArry.push(key);
                    }

                }
            }

            let params = {
                user:
                    {
                        first_name: this.userForm.value['first_name'],
                        last_name: this.userForm.value['last_name'],
                        email: this.userForm.value['email'],
                        role,
                        active: this.isActive$.getValue()
                    },
                permissions: perArry
            };

            if (this.userForm.value['password']) {
                params['user']['password'] = this.userForm.value['password'];
                params['user']['confirm_password'] = this.userForm.value['confirm_password'];
            }

            // Add
            if (this.userId == null) {

                this._companyService.addCompanyUserDetails(params).subscribe((res) => {

                    this.successFlag.next(true);
                    Observable.timer(1000).subscribe((val) => {
                        this.successFlag.next(false);
                        this.onBack();
                    });

                }, (error) => {

                    // let errorJson = error['error'];
                    // if (errorJson['email']) {
                    //     this.errorMessage = errorJson['email'];
                    // }
                    this.errorMessage = this.fixedTextHash['this_email_taken_error'][this.currLan];
                    this.errorFlag.next(true);
                    Observable.timer(2000).subscribe((val) => {
                        this.errorFlag.next(false);
                    });
                });
            } else if (this.userId != null) {

                this._companyService.updateCompanyUserDetails(this.userId, params)
                    .subscribe((res) => {

                    this.successFlag.next(true);
                    Observable.timer(1000).subscribe((val) => {
                        this.successFlag.next(false);
                        this.onBack();
                    });

                }, (error) => {

                    let errorJson = error['error'];
                    if (errorJson['email']){
                        this.errorMessage = errorJson['email'];
                    }
                    this.errorFlag.next(true);
                    Observable.timer(2000).subscribe((val) => {
                        this.errorFlag.next(false);
                    });

                });
            }

        }
    }

    public onBack() {
        this._router.navigate([this.accountService.getCurrLangUrl() +
        this.accountService.getPath() + '/profile/users']);
    }

    public companyInfoPermissions() {

        if (this.permissionCategory['company_info']) {
            this.permissionCategory['company_info'] = false;
            this.permissionParams['edit_company'] = false;
            this.permissionParams['invite_connection'] = false;
        } else {
            this.permissionCategory['company_info'] = true;
            this.permissionParams['edit_company'] = true;
            this.permissionParams['invite_connection'] = true;
        }
    }

    public brandRelatedPermissions() {
        if (this.permissionCategory['brand_related']) {
            this.permissionCategory['brand_related'] = false;
            this.permissionParams['create_blog'] = false;
            this.permissionParams['manage_blog'] = false;
        } else {

            this.permissionCategory['brand_related'] = true;
            this.permissionParams['create_blog'] = true;
            this.permissionParams['manage_blog'] = true;
        }
    }

    public candidateSearchPermissions() {
        if (this.permissionCategory['candidate_search']) {

            this.permissionCategory['candidate_search'] = false;
            this.permissionParams['create_job'] = false;
            this.permissionParams['edit_job_application_status'] = false;
            this.permissionParams['destroy_job'] = false;
            this.permissionParams['search_jobseekers'] = false;
        } else {

            this.permissionCategory['candidate_search'] = true;
            this.permissionParams['create_job'] = true;
            this.permissionParams['edit_job_application_status'] = true;
            this.permissionParams['destroy_job'] = true;
            this.permissionParams['search_jobseekers'] = true;
        }
    }

    public ngOnInit() {
        this.accountService.setCustomSeo();
        this.currLan = this.accountService.getCurrLang();
        this.textPrint = this.fixedTextHash['add_new_user'][this.currLan];
        this.paramsObs = this._activeRoute.params.subscribe((params) => {
            window.scroll(0, 0);
            let id = +params['id'];
            if (id) {
                this.readmodeEmail = true;
                this.userId = id;
                this.textPrint = this.fixedTextHash['edit_user'][this.currLan];
                this._companyService.getCompanyUserDetails(id).subscribe((res) => {
                    if (res['user']['id'] === this.accountService.getUserId()) {
                        this.readmodeFields = true;
                    } else {
                        this.readmodeFields = false;
                    }
                    this.selId = res['user']['id'];
                    let roleType = (res['user']['role'] == 'company_admin') ? 'true' : 'false';
                    this.userForm = this._fb.group({
                        first_name: [res['user']['first_name'], [Validators.required]],
                        last_name: [res['user']['last_name'], [Validators.required]],
                        email: [res['user']['email'], BasicValidators.email],
                        password: ['', [PasswordValidator.complexPass]],
                        confirm_password: ['', [PasswordValidator.passwordConfirm]],
                        role: [roleType, Validators.required],
                        active: [res['user']['active'], Validators.required]
                    });

                    this.isActive$.next(res['user']['active']);
                    this.loadDataFlag = true;

                    // Loading the Permissions
                    for (let key in this.permissionParams) {
                        if (this.permissionParams.hasOwnProperty(key)) {

                            if (res['user']['permissions'].indexOf(key) !== -1) {
                                this.permissionParams[key] = true;
                            }

                        }
                    }
                });
            } else {
                this.readmodeEmail = false;

                let roleType = 'false';
                this.loadDataFlag = true;
                this.userForm = this._fb.group({
                    first_name: ['', [Validators.required]],
                    last_name: ['', [Validators.required]],
                    email: ['', BasicValidators.email],
                    role: [roleType, Validators.required],
                    password: ['', [Validators.required, PasswordValidator.complexPass]],
                    confirm_password: ['', [Validators.required, PasswordValidator.passwordConfirm]]
                });

            }
        });
    }

    public ngOnDestroy() {

        this.paramsObs.unsubscribe();
    }



}
