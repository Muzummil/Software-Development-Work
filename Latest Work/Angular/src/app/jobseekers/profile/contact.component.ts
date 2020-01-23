import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {Component, Input, OnInit, EventEmitter, Output, ChangeDetectionStrategy} from '@angular/core';

//Directives

//Validations
import {BasicValidators} from '../../shared/validators/basicValidators';

//Services
import {ProfileService} from '../../core/services/profile.service';
import {AccountService} from '../../core/account/services/account.service';
import {LoaderService} from '../../shared/services/loader.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {JobSeekerContact} from './models/JobSeekerContact';

declare var jQuery: any;

@Component({
    selector: 'contact-us',
    templateUrl: 'contact.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush

})

export class ContactComponent  implements OnInit{
    @Input() jobSeekerContact : BehaviorSubject<any>;
    @Output() onUpdateProfileStatus = new EventEmitter();
    //Forms
    contact_form: FormGroup;

    //Flags
    public contactusLoader$ = new BehaviorSubject(true);
    public status1 = 'read';
    public activeForm = false;
    public profileCacheDirty = false;

    //Members
    public phoneCodeList = [];
    public phoneNo: string;
    public mobileNo: string;
    public postFlag: boolean = false;
    public currLan = 'en';
    public fixedTextHash = this.loaderService.getFixedText();

    constructor(
        public fb: FormBuilder,
        public _profileService: ProfileService,
        public loaderService : LoaderService,
        public  accountService : AccountService) {
    }

    public getProcessedPhoneNo($event) {

        this.postFlag = true;
        if ($event.match == 'phone_no'){
            this.contact_form.controls['phone_no']['_value'] =  $event.phone_no;
            this.phoneNo = $event.phone_no;
        }
        else
        {
            this.contact_form.controls['mobile_no']['_value'] =  $event.phone_no;
            this.mobileNo = $event.phone_no;
        }
    }

    public loadContact(profile) {
        let jobSeekerContact = new JobSeekerContact;
        jobSeekerContact.jobseeker_id = profile['jobseeker_id'];
        jobSeekerContact.email_address = profile['contact']['email_address'];
        jobSeekerContact.phone_no = profile['contact']['phone_no'];
        jobSeekerContact.phone_no_country_code = profile['contact']['phone_no_country_code'];
        jobSeekerContact.mobile_no = profile['contact']['mobile_no'];
        jobSeekerContact.mobile_no_country_code = profile['contact']['mobile_no_country_code'];
        this.jobSeekerContact.next(jobSeekerContact);
    }

    public buildForm() {
        this.jobSeekerContact.subscribe((jobSeekerContact) => {
            if (jobSeekerContact) {
                this.phoneNo = jobSeekerContact.phone_no;
                this.mobileNo = jobSeekerContact.mobile_no;

                this.contactusLoader$.next(false);
                this.contact_form = this.fb.group({
                    jobseeker_id: jobSeekerContact.jobseeker_id,
                    phone_no: ['', [BasicValidators.phoneNo]],
                    mobile_no: ['', [Validators.required, BasicValidators.phoneNo]],
                    email_address: [jobSeekerContact.email_address, BasicValidators.email]
                });
            }
        });
    }

    ngOnDestroy() {

        if (this.profileCacheDirty){
            AccountService.profileCacheDirty = true;
        }

    }

    ngOnInit(){

        window.scroll(0, 0);
        this.contactusLoader$.next(true);

        this.buildForm();
        this.currLan = this.accountService.getCurrLang();
    }

    onRead() {
        this.status1 = 'read';
        this.activeForm = false;
    }

    onEdit(){
        this.status1 = 'edit';
        this.activeForm = true;
    }

    saveContactDetails()
    {
        this.postFlag = true;

        if (this.contact_form.valid)
        {
            this.contactusLoader$.next(true);

            let postList = {
                jobseeker: {
                    user_attributes: {
                        id: AccountService.profileCache['id'],
                        email: this.contact_form.value.email_address
                    },
                    mobile_phone: this.contact_form.value.mobile_no,
                    home_phone: this.contact_form.value.phone_no
                }
            };

            let result = this._profileService.updateContactDetails(postList);

            result.subscribe((res) => {

                this.profileCacheDirty = true;
                this.postFlag = false;
                this.contactusLoader$.next(false);
                this.onUpdateProfileStatus.emit({update: true});
                this.loadContact(res['jobseeker_profile']);
                this.onRead();
            },
            (error) => {
                if (error.status == 401) {
                    this._profileService.getLogOutUser();
                }

            });
        }
    }
}
