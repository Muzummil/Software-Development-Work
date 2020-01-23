import {
    Component,
    Input,
    OnInit,
    EventEmitter,
    Output,
    ChangeDetectionStrategy, OnDestroy
} from '@angular/core';

// Services
import { ProfileService } from '../../core/services/profile.service';
import { AccountService } from '../../core/account/services/account.service';
import { LoaderService } from '../../shared/services/loader.service';

let moment = require('moment');

@Component({
    selector: 'sel-certificate',
    templateUrl: 'selCertificate.component.html',
    styleUrls: ['./selCertificate.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class SelCertificateComponent implements OnInit, OnDestroy {

    // flags
    public cerSpinnerFlag: boolean = false;
    public certificate_pristine: boolean = true;
    public startDate;
    public endDate;
    public profileCacheDirty = false;
    public toYear = moment().format('YYYY');
    public maxDate = moment()._d;
    public certSpinnerFlag = false;
    public postInProcess = false;
    public currLan = 'en';
    public fixedTextHash = this.loaderService.getFixedText();

    @Input() cert_index;
    @Input() certificate;
    @Input() display_mode;

    // Output
    @Output() cancelCERT = new EventEmitter();
    @Output() saveCERT = new EventEmitter();
    @Output() onUpdateProfileStatus = new EventEmitter();

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

        this.startDate = this.certificate.cert_form.value.cert_start_date;
        this.endDate = this.certificate.cert_form.value.cert_end_date;
        this.currLan = this.accountService.getCurrLang();
    }

    public onSaveCERT(id: number = null) {
        this.certificate_pristine = false;
        this.cerSpinnerFlag = true;
        if (this.certificate.cert_form.valid && !this.postInProcess) {
            this.onPost(id);
        }
    }

    public onCancelCERT(id: number = null) {
        this.cancelCERT.emit({id});
    }

    public selectStartDate(obj) {
        this.startDate = obj.value;
    }

    public selectEndDate(obj) {
        this.endDate = obj.value;

    }

    public onPost(index: number) {

        this.postInProcess = true;
        let postList = {
            id: this.certificate.cert_form.value.cert_id,
            name: this.certificate.cert_form.value.cert_name,
            institute: this.certificate.cert_form.value.cert_university,
            attachment: null,
            grade: this.certificate.cert_form.value.cert_grade,
            from: moment(new Date(this.certificate.cert_form.value.cert_start_date))
                .format('YYYY-MM-DD'),
            to: moment(new Date(this.certificate.cert_form.value.cert_end_date))
                .format('YYYY-MM-DD')
        };

        if (this.certificate.cert_form.value.cert_id === -1) {
            this._profileService.postCertificate(postList).subscribe((res) => {
                this.profileCacheDirty = true;

                this.postInProcess = false;
                this.saveCERT.emit({id: index, result: res});
            }, (error) => {
                if (error.status === 401) {
                    this._profileService.getLogOutUser();
                }

            });

        } else {
            this._profileService.updateCertificate(postList).subscribe((res) => {
                    this.profileCacheDirty = true;

                    this.postInProcess = false;
                    this.saveCERT.emit({id: index, result: res});

                },
                (error) => {
                    if (error.status === 401) {
                        this._profileService.getLogOutUser();
                    }

                });

        }
    }
}
