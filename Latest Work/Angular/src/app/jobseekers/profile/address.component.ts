import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {
    Component,
    Input,
    OnInit,
    Output,
    EventEmitter,
    ChangeDetectionStrategy, OnDestroy
} from '@angular/core';

// Services
import { ProfileService } from '../../core/services/profile.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { City } from '../../shared/models/City';
import { Country } from '../../shared/models/Country';
import { AccountService } from '../../core/account/services/account.service';
import { LoaderService } from '../../shared/services/loader.service';

@Component({
    selector: 'address-block',
    templateUrl: 'address.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class AddressComponent implements OnInit, OnDestroy {
    @Input() public jobSeekerAddress: BehaviorSubject<any>;
    @Input()  public commonData: BehaviorSubject<any>;
    @Output()  public onUpdateProfileStatus = new EventEmitter();
    // Forms
    public address_form: FormGroup;

    // Flags
    public addressLoader$: BehaviorSubject<any> = new BehaviorSubject(true);
    public status2 = 'read';
    public jobseekerAdd = [];
    public activeForm = false;
    public firstFlag = true;
    public postFlag = false;

    // Members
    public countryList = [];
    public cityList = [];
    public countryId: number;
    public currentCountryId: number;
    public cityId: number;
    public city: City;
    public addressLine1: string;
    public addressLine2: string;
    public postCode: number;
    public profileCacheDirty = false;
    public currLan = 'en';
    public fixedTextHash = this.loaderService.getFixedText();

    constructor(public fb: FormBuilder,
                public _profileService: ProfileService,
                public loaderService: LoaderService,
                public accountService: AccountService) {

        this.address_form = this.fb.group({
            address_line1: ['', [Validators.required, Validators.maxLength(30)]],
            address_line2: ['', [Validators.maxLength(30)]],
            zip: ['', [Validators.required, Validators.maxLength(8)]],
            current_city_id: ['', Validators.required],
            current_country_id: ['', Validators.required]
        });

        this.address_form.controls['current_country_id'].valueChanges.subscribe((countryId) => {
            this.countryId = countryId;
            if (!this.firstFlag) {
                this.cityId = null;
            }
            this.firstFlag = false;
        });

    }

    public ngOnDestroy() {

        if (this.profileCacheDirty) {
            AccountService.profileCacheDirty = true;
        }

    }

    public saveAddressDetails() {
        this.postFlag = true;
        if (this.address_form.valid) {
            this.addressLoader$.next(true);

            this._profileService.updateAddressDetails(this.address_form.value)
                .subscribe(
                    (res) => {
                        let addressBlock = [];
                        this.addressLoader$.next(false);
                        this.firstFlag = true;
                        this.postFlag = false;
                        this.profileCacheDirty = true;
                        addressBlock['address_line1'] =
                            res['jobseeker_profile']['address']['address_line1'];
                        addressBlock['address_line2'] =
                            res['jobseeker_profile']['address']['address_line2'];
                        addressBlock['postal_code'] =
                            res['jobseeker_profile']['address']['postal_code'];
                        addressBlock['city'] = new City();
                        addressBlock['city'].id =
                            res['jobseeker_profile']['address']['city']['id'];
                        addressBlock['city'].name =
                            res['jobseeker_profile']['address']['city']['name'];
                        addressBlock['city'].text =
                            res['jobseeker_profile']['address']['city']['name'];
                        addressBlock['country'] = new Country();
                        addressBlock['country'].id =
                            res['jobseeker_profile']['address']['country']['id'];
                        addressBlock['country'].name =
                            res['jobseeker_profile']['address']['country']['name'];

                        this.jobSeekerAddress.next(addressBlock);
                        this.onUpdateProfileStatus.emit({update: true});
                        this.setFields(res['jobseeker_profile']['address']);
                        this.onReadAddress();
                        let returnTyp = [];

                        returnTyp['success'] = res;
                        return returnTyp;
                    },
                    (error) => {
                        if (error.status === 404) {
                            let returnTyp = [];
                            returnTyp['errror'] = error.status;
                        }
                        if (error.status === 401) {
                            let returnTyp = [];
                            returnTyp['errror'] = error.status;
                            this._profileService.getLogOutUser();

                        }

                    });
        }
    }

    public onSelectCity($event) {
        this.cityId = $event.id;
    }

    public getValidateObject(selObject = {}) {
       return (selObject) ? selObject : {};
    }

    public setFields(jobSeekerAddress) {
        jobSeekerAddress['country'] = this.getValidateObject(jobSeekerAddress['country']);
        jobSeekerAddress['city'] = this.getValidateObject(jobSeekerAddress['city']);
        this.countryId = jobSeekerAddress['country']['id'];
        this.currentCountryId = jobSeekerAddress['country']['id'];
        this.city = jobSeekerAddress['city'];
        this.city.text = jobSeekerAddress['city']['name'];
        this.city.name = jobSeekerAddress['city']['name'];
        this.city.id = jobSeekerAddress['city']['id'];
        this.cityId = null;

        if (this.city['id']) {
            this.cityId = jobSeekerAddress['city']['id'];
        }
        this.addressLine1 = jobSeekerAddress.address_line1;
        this.addressLine2 = jobSeekerAddress.address_line2;

        this.postCode = jobSeekerAddress.postal_code;
    }

    public ngOnInit() {
        window.scroll(0, 0);
        this.addressLoader$.next(true);

        this.commonData.subscribe((res) => {
            if (res) {
                this.countryList = res['countries'];
            }
        });

        this.jobSeekerAddress.subscribe((jobSeekerAddress) => {
            if (jobSeekerAddress) {
                this.addressLoader$.next(false);
                this.setFields(jobSeekerAddress);
            }
        });
        this.currLan = this.accountService.getCurrLang();
    }

    public onReadAddress() {
        this.addressLoader$.next(false);
        this.firstFlag = true;
        this.status2 = 'read';
        this.activeForm = false;
    }

    public onEditAddress() {
        this.status2 = 'edit';
        this.activeForm = true;
    }
}
