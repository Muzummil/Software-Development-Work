import {
    Component,
    Input,
    OnInit,
    EventEmitter,
    Output,
    ChangeDetectionStrategy, OnDestroy
} from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

// Services
import { ProfileService } from '../../core/services/profile.service';

import { Country } from '../../shared/models/Country';
import { City } from '../../shared/models/City';
import { AccountService } from '../../core/account/services/account.service';
import { LoaderService } from '../../shared/services/loader.service';

let moment = require('moment');
declare var jQuery;

@Component({
    selector: 'sel-education',
    templateUrl: 'selEducation.component.html',
    styleUrls: ['./selEducation.scss'],
    
})

export class SelEducationComponent implements OnInit, OnDestroy {

    public city_Obj: City = new City();

    public toYear = moment().format('YYYY');
    public maxDate = moment()._d;
    public startDate;
    public endDate;
    public edu_end_date_error: boolean = false;
    public pristineEducation: boolean = true;
    public postInProcess: boolean = false;

    // flags
    public eduSpinnerFlag: boolean = false;

    // members
    public country_Obj: Country = new Country();
    public firstCountryId: number;
    public country_Obj$: BehaviorSubject<any> = new BehaviorSubject(null);

    public profileCacheDirty = false;
    public currLan = 'en';
    public fixedTextHash = this.loaderService.getFixedText();

    public ShowEndDate: boolean = true;
    public minEndDate = moment();

    // Output
    @Output() cancelEDU = new EventEmitter();
    @Output() saveEDU = new EventEmitter();
    @Output() onUpdateProfileStatus = new EventEmitter();
    @Input() education;
    @Input() educationList;
    @Input() field_studyList;
    @Input() countryList;
    @Input() cityList;
    @Input() edu_index;
    @Input() display_mode;

    constructor(public _profileService: ProfileService,
        public accountService: AccountService,
        public loaderService: LoaderService) {
    }

    public ngOnDestroy() {
        if (this.profileCacheDirty) {
            AccountService.profileCacheDirty = true;
        }
    }

    public ngOnInit(): any {

        this.city_Obj.id = this.education.city.id;
        this.city_Obj.name = this.education.city.name;
        this.city_Obj.text = this.education.city.name;
        this.country_Obj.id = this.education.country.id;
        this.country_Obj.name = this.education.country.name;
        this.country_Obj$.next(this.country_Obj);
        this.firstCountryId = this.country_Obj.id;

        this.startDate = this.education.edu_form.value.edu_start_date;
        this.endDate = this.education.edu_form.value.edu_end_date;
        this.education.edu_form.controls['edu_country_id'].valueChanges.subscribe((val) => {
            this.onSelectCountry(val);
        });

        this.currLan = this.accountService.getCurrLang();
    }

    public selectStartDate(obj) {
        this.startDate = obj.value;
    }

    public selectEndDate(obj) {
        this.endDate = obj.value;
    }

    public onSelectCountry(val) {
        this.country_Obj.id = val;
        this.country_Obj$.next(this.country_Obj);
        this.city_Obj = new City();
    }

    public onPost(index: number) {

        this.postInProcess = true;
        let postList = {
            id: this.education.edu_form.value.edu_id,
            job_education_id: this.education.edu_form.value.edu_q_id,
            city_id: this.education.edu_form.value.edu_city_id,
            country_id: this.education.edu_form.value.edu_country_id,
            grade: this.education.edu_form.value.edu_grade,
            school: this.education.edu_form.value.edu_name,
            field_of_study: this.education.edu_form.value.edu_field_study,
            from: this.education.edu_form.value.edu_start_date,
            to: this.education.edu_form.value.edu_end_date
        };

        if (this.education.edu_form.value.edu_id === -1) {
            this._profileService.postEducation(postList)
                .subscribe((res) => {
                    this.profileCacheDirty = true;
                    this.postInProcess = false;
                    this.saveEDU.emit({ id: index, result: res });
                    this.onUpdateProfileStatus.emit({ update: true });
                },
                    (error) => {
                        if (error.status === 401) {
                            this._profileService.getLogOutUser();
                        }

                    });

        } else {
            this._profileService.updateEducation(postList)
                .subscribe((res) => {
                    this.profileCacheDirty = true;
                    this.postInProcess = false;
                    this.saveEDU.emit({ id: index, result: res });
                    this.onUpdateProfileStatus.emit({ update: true });
                },
                    (error) => {
                        if (error.status === 401) {
                            this._profileService.getLogOutUser();
                        }

                    });

        }
    }

    public onToggleCurrentlyStuding() {
        this.education.edu_still_studing = (this.education.edu_still_studing) ? false : true;
        if (this.education.company_form) {
            this.education.company_form.controls['edu_end_date'].setValue(null);
        }
    }

    public onSaveEdu(id: number = null) {
        this.eduSpinnerFlag = true;
        this.pristineEducation = false;

        if (this.education.edu_form.valid) {

            if (!this.education.edu_form.value.edu_still_studing) {
                // if your not working here make sure data is entered
                if (this.education.edu_form.value.edu_end_date != null) {
                    this.edu_end_date_error = false;

                    if (!this.postInProcess) {
                        this.onPost(id);
                    }
                } else {
                    this.edu_end_date_error = true;
                }
            } else {
                // if you are still working then
                this.education.edu_form.value.edu_end_date = null;
                if (!this.postInProcess) {
                    this.onPost(id);
                }
            }
        }
    }

    public onSelectCity($event) {

        if ($event.id) {
            this.city_Obj.id = $event.id;
            this.city_Obj.name = $event.name;
            this.city_Obj.text = $event.name;

        }
    }

    public onCancelEDU(id: number = null) {

        this.cancelEDU.emit({ id });
    }

    //To Set End Date Value
    public setEndDate(event) {
        this.endDate = this.education.edu_form.controls['edu_end_date'].value;
        this.ShowEndDate = false;
        this.minEndDate = moment(event.selDate, "D MMM, YYYY")._d;
        setTimeout(() => { this.ShowEndDate = true, jQuery("input[name=edu_name]").click() }, 100);

        var from = new Date(this.education.edu_form.value.edu_start_date);
        var to = new Date(this.education.edu_form.value.edu_end_date);

        if (from > to) {
            this.education.edu_form.value.edu_end_date = null;
            this.education.edu_form.controls['edu_end_date'].setValue(null);
            this.endDate = null;
        }
    }

}
