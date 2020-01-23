import { FormBuilder, FormGroup } from '@angular/forms';
import {
    Component,
    Input,
    OnInit,
    EventEmitter,
    Output,
    ChangeDetectionStrategy, OnDestroy
} from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';

// Directives
import { ProfileService } from '../../core/services/profile.service';

// models
import { RolesAndResponsible } from './models/JobSeekerWork';
import { Company } from '../../shared/models/Company';
import { City } from '../../shared/models/City';
import { Country } from '../../shared/models/Country';
import { LoaderService } from '../../shared/services/loader.service';
import { AccountService } from '../../core/account/services/account.service';

let moment = require('moment');
declare var jQuery;

@Component({

    selector: 'company-work-exp',
    templateUrl: 'company.component.html',
    styleUrls: ['./company.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,

})

export class CompanyComponent implements OnInit, OnDestroy {
    // Inputs
    @Input() countryList;
    @Input() cityList;
    @Input() sectorList;
    @Input() work_experience;
    @Input() wrk_exp_index;
    @Input() display_mode = '';

    @Output() onUpdateProfileStatus = new EventEmitter();
    // Output
    @Output() cancelWE = new EventEmitter();
    @Output() saveWE = new EventEmitter();

    // Subscription
    public companiesSubscription: Subscription;
    public postWorkExperienceSubscription: Subscription;
    public updateWorkExperienceSubscription: Subscription;
    private ngUnsubscribe: Subject<void> = new Subject<void>();
    public currLan = 'en';
    public fixedTextHash = this.loaderService.getFixedText();

    // members
    backupRR: any;
    city_Obj: City = new City();
    company_Obj: Company = new Company();
    country_Obj: Country = new Country();
    country_Obj$: BehaviorSubject<any> = new BehaviorSubject(null);
    formPostObj$: BehaviorSubject<any> = new BehaviorSubject(false);
    public spinnerLoader$: BehaviorSubject<any> = new BehaviorSubject(false);
    public toYear = moment().format('YYYY');
    public maxDate = moment()._d;

    public minEndDate = moment();

    public startDate;
    public endDate;
    public conpanyList = [];
    public profileCacheDirty = false;
    public postInProcess = false;

    // flags
    company_end_date_req = false;
    firstCountryId: number;
    rollsAddedFlag = false;
    ShowEndDate: boolean = true;


    constructor(public fb: FormBuilder,
        public _profileService: ProfileService,
        public loaderService: LoaderService,
        public accountService: AccountService) {

    }

    public ngOnDestroy() {
        this.companiesSubscription.unsubscribe();
        if (this.postWorkExperienceSubscription) {
            this.postWorkExperienceSubscription.unsubscribe();
        }

        if (this.updateWorkExperienceSubscription) {
            this.updateWorkExperienceSubscription.unsubscribe();
        }
        this.resetCache();

        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    public resetCache() {
        if (this.profileCacheDirty) {
            AccountService.profileCacheDirty = true;
        }
    }

    public selectStartDate(obj) {
        this.startDate = obj.value;
    }

    public selectEndDate(obj) {
        this.endDate = obj.value;

    }

    public onToggleCurrentlyWorking() {
        this.work_experience.company_still_working =
            (this.work_experience.company_still_working) ? false : true;
        this.work_experience.company_form.controls['company_end_date'].setValue(null);
    }

    public ngOnInit(): any {
        this.companiesSubscription = this.loaderService.getCompanies().subscribe((comRes) => {
            comRes.forEach((res) => {
                this.conpanyList.push({ id: res['id'], name: res['name'] });
            });
        });
        this.backupRR = this.work_experience.company_roles_and_resp.slice();
        this.city_Obj.id = this.work_experience.company_form.value.company_city_id;
        this.city_Obj.name = this.work_experience.company_form.value.company_city_name;
        this.city_Obj.text = this.work_experience.company_form.value.company_city_name;
        this.company_Obj.id = this.work_experience.company_form.value.company_id;
        this.company_Obj.name = this.work_experience.company_form.value.company_name;
        this.company_Obj.text = this.work_experience.company_form.value.company_name;
        this.country_Obj.id = this.work_experience.company_form.value.company_country;
        this.firstCountryId = this.country_Obj.id;
        this.country_Obj$.next(this.country_Obj);
        this.startDate = this.work_experience.company_form.value.company_start_date;
        this.endDate = this.work_experience.company_form.value.company_end_date;
        this.work_experience.company_form.controls['company_country'].valueChanges
            .subscribe((val) => {
                this.onSelectCountry(val);
            });
        this.currLan = this.accountService.getCurrLang();
    }

    public onSelectCountry(val) {
        this.country_Obj.id = val;
        this.country_Obj$.next(this.country_Obj);
        this.city_Obj = new City();
    }

    public onSelectCity($event) {
        if ($event.id) {
            this.city_Obj.id = $event.id;
            this.city_Obj.name = $event.name;
        }
    }

    public onCancelWE(id: number = null) {
        this.work_experience.company_roles_and_resp = this.backupRR;
        this.cancelWE.emit({ id });
    }

    public onPost(index: number) {
        this.postInProcess = true;
        let rrList = Array();
        this.work_experience.company_roles_and_resp.forEach((selrr) => {
            rrList.push(selrr.name);
        });

        this.work_experience.company_form.value.company_end_date =
            (this.work_experience.company_form.value.company_still_working) ? null :
                this.work_experience.company_form.value.company_end_date;
        let postList = {
            id: this.work_experience.company_form.value.work_id,
            sector_id: this.work_experience.company_form.value.company_sector_id,
            country_id: this.work_experience.company_form.value.company_country,
            company_name: this.work_experience.company_form.value.company_name,
            company_id: this.work_experience.company_form.value.company_id,
            city_id: this.work_experience.company_form.value.company_city_id,
            position: this.work_experience.company_form.value.company_title,
            description: rrList,
            from: this.work_experience.company_form.value.company_start_date,
            to: this.work_experience.company_form.value.company_end_date,
            document: ''
        };

        if (this.work_experience.company_form.value.work_id === -1) {
            this.postWorkExperienceSubscription = this.postWorkExperienceSubscription =
                this._profileService.postWorkExperience(postList).subscribe((res) => {
                    this.postInProcess = false;
                    this.onUpdateProfileStatus.emit({ update: true });
                    this.profileCacheDirty = true;
                    this.saveWE.emit({ id: -1, result: res });
                    this.formPostObj$.next(false);
                    this.spinnerLoader$.next(false);

                },
                    (error) => {
                        if (error.status === 401) {
                            this._profileService.getLogOutUser();
                        }

                    });

        } else {
            this.updateWorkExperienceSubscription =
                this._profileService.updateWorkExperience(postList).subscribe((res) => {
                    this.postInProcess = false;
                    this.onUpdateProfileStatus.emit({ update: true });
                    this.profileCacheDirty = true;
                    this.saveWE.emit({ id: index, result: res });
                    this.formPostObj$.next(false);
                    this.spinnerLoader$.next(false);
                },
                    (error) => {
                        if (error.status === 401) {
                            this._profileService.getLogOutUser();
                        }

                    });
        }
    }

    public onSaveWE(index: number) {
        if (this.work_experience.company_form.valid) {
            if (!this.work_experience.company_form.value.company_still_working) {
                // if your not working here make sure data is entered
                if (this.work_experience.company_form.value.company_end_date == null) {
                    this.company_end_date_req = true;
                } else {
                    this.spinnerLoader$.next(true);
                    if (!this.postInProcess) {
                        this.onPost(index);
                    }
                }
            } else {
                // if you are still working then
                this.work_experience.company_form.value.company_end_date = null;
                this.spinnerLoader$.next(true);
                if (!this.postInProcess) {
                    this.onPost(index);
                }
            }
        }
    }

    public onRemoveRR(index: number) {
        this.work_experience.company_roles_and_resp.splice(index, 1);
    }

    public onAddRR() {
        if (this.work_experience.temp_roles_resp !== '' &&
            this.work_experience.temp_roles_resp.length >= 5) {
            this.work_experience.temp_roles_resp_valid = true;
            this.work_experience.company_roles_and_resp
                .push(new RolesAndResponsible(this.work_experience.temp_roles_resp));
            this.work_experience.temp_roles_resp = '';
            this.rollsAddedFlag = true;
        } else {
            this.work_experience.temp_roles_resp_valid = false;
        }
    }

    //To Set End Date Value
    public setEndDate(event) {
        this.endDate = this.work_experience.company_form.controls['company_end_date'].value;
        this.ShowEndDate = false;
        this.minEndDate = moment(event.selDate, "D MMM, YYYY")._d;
        setTimeout(() => { this.ShowEndDate = true, jQuery("input[name=formCompany_company_title]").click() }, 100);

        var from = new Date(this.work_experience.company_form.value.company_start_date);
        var to = new Date(this.work_experience.company_form.value.company_end_date);

        if (from > to) {
            this.work_experience.company_form.value.company_end_date = null;
            this.work_experience.company_form.controls['company_end_date'].setValue(null);
            this.endDate = null;
        }
    }

}
