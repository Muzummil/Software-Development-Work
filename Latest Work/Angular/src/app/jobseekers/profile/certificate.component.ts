import { FormBuilder, Validators } from '@angular/forms';

import {
    Component,
    Input,
    OnInit,
    EventEmitter,
    Output,
    ChangeDetectionStrategy
} from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
// models

import { JobSeekerCertificate } from './models/JobSeekerCertificate';

import { ProfileService } from '../../core/services/profile.service';
import { AccountService } from '../../core/account/services/account.service';
import { LoaderService } from '../../shared/services/loader.service';

declare var jQuery: any;

@Component({
    selector: 'cert-block',
    templateUrl: 'certificate.component.html',
    styleUrls: ['./certificate.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class CertificateComponent implements OnInit {

    @Input() cachedProfile: BehaviorSubject<any>;
    @Input() commonData: BehaviorSubject<any>;
    @Input() display_mode: string = 'desktop';  // desktop mobile
    @Output() onUpdateProfileStatus = new EventEmitter();

    // Subscriptions
    public deleteCertificateFileSubcription: Subscription;
    public deleteCertificateSubcription: Subscription;
    public postCertDetailsSubcription: Subscription;
    public commonDataSubcription: Subscription;
    public cachedProfileSubcription: Subscription;

    // BehaviorSubject
    public jobSeekerCertList$: BehaviorSubject<any> = new BehaviorSubject(null);

    // flags
    public cert_add = false;

    public addNewCertFlag: boolean = true;
    public addNewCertFlag$: BehaviorSubject<any> = new BehaviorSubject(true);
    public addNewCertDatePickerFlag: boolean = false;
    public certSpinnerFlag = false;
    public cert_status = 'read';

    // members
    public countryList = [];
    public cityList = [];
    public jobSeekerCertList: JobSeekerCertificate[] = [];
    public sectorList: any;
    public profileCacheDirty = false;
    public ngUnsubscribe: Subject<void> = new Subject<void>();

    public certificateEditList = [];
    public currLan = 'en';
    public fixedTextHash = this.loaderService.getFixedText();

    constructor(public fb: FormBuilder,
                public profileService: ProfileService,
                public loaderService: LoaderService,
                public accountService: AccountService) {
    }

    public ngOnDestroy() {

        // Subscriptions
        if (this.deleteCertificateFileSubcription) {
            this.deleteCertificateFileSubcription.unsubscribe();
        }

        if (this.deleteCertificateSubcription) {
            this.deleteCertificateSubcription.unsubscribe();
        }
        if (this.postCertDetailsSubcription) {
            this.postCertDetailsSubcription.unsubscribe();
        }
        if (this.commonDataSubcription) {
            this.commonDataSubcription.unsubscribe();
        }
        if (this.cachedProfileSubcription) {
            this.cachedProfileSubcription.unsubscribe();
        }

        if (this.profileCacheDirty) {
            AccountService.profileCacheDirty = true;
        }

        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    public onReadCERT() {
        this.cert_status = 'read';
        let last_index = this.jobSeekerCertList.length - 1;
        this.onCancelCERT(last_index);
    }

    public onEditCERT(id: string = null) {
        if (id == null) {
            this.cert_status = 'edit';
        } else {
            this.cert_add = false;
            this.certificateEditList.push(id);
        }
    }

    public onCancelCERT2($event) {
        this.onCancelCERT($event.id);
    }

    public onSaveCERT2($event) {
        if ($event.id != null) {
            this.jobSeekerCertList[$event.id].cert_new = false;
            this.jobSeekerCertList[$event.id].id = $event.result.jobseeker_certificate.id;
            this.jobSeekerCertList[$event.id].cert_id = $event.result.jobseeker_certificate.id;
            this.jobSeekerCertList[$event.id].cert_name = $event.result.jobseeker_certificate.name;
            this.jobSeekerCertList[$event.id].cert_university =
                $event.result.jobseeker_certificate.institute;
            this.jobSeekerCertList[$event.id].cert_start_date =
                $event.result.jobseeker_certificate.start_date;
            this.jobSeekerCertList[$event.id].cert_end_date =
                $event.result.jobseeker_certificate.end_date;
            this.jobSeekerCertList[$event.id].cert_grade =
                $event.result.jobseeker_certificate.grade;
            this.jobSeekerCertList[$event.id].cert_doc_upload_name =
                $event.result.jobseeker_certificate.document_file_name;
            this.jobSeekerCertList[$event.id].cert_doc_upload_path =
                $event.result.jobseeker_certificate.document;
            this.jobSeekerCertList[$event.id].cert_still_studing = true;

            if (this.jobSeekerCertList[$event.id].cert_end_date) {

                this.jobSeekerCertList[$event.id].cert_duration =
                    this.loaderService
                        .getCalDuration(this.jobSeekerCertList[$event.id].cert_start_date,
                            this.jobSeekerCertList[$event.id].cert_end_date);
                this.jobSeekerCertList[$event.id].cert_still_studing = false;
            }

            this.jobSeekerCertList[$event.id].cert_file_D.id =
                $event.result.jobseeker_certificate.id;
            this.jobSeekerCertList[$event.id].cert_file_M.id =
                $event.result.jobseeker_certificate.id;

            this.jobSeekerCertList[$event.id].cert_file_D.index = $event.id;
            this.jobSeekerCertList[$event.id].cert_file_M.index = $event.id;

            this.addNewCertFlag = true;
            this.addNewCertFlag$.next(this.addNewCertFlag);

            this.certificateEditList.splice(this.certificateEditList.indexOf($event.id), 1);
            this.profileCacheDirty = true;
            this.onUpdateProfileStatus.emit({update: true});
        }

    }

    public onCancelCERT(id: number = null) {

        if (!this.jobSeekerCertList || this.jobSeekerCertList.length == 0 || id < 0) {
            return;
        }

        if (this.jobSeekerCertList.length == 1) {
            this.cert_status = 'read';
        }
        // Change to array  so that i can remove an element
        let jobSeekerCertList = this.jobSeekerCertList;

        // Remove unsaved

        if (this.jobSeekerCertList[id].cert_new == true) {
            jobSeekerCertList.pop();
            this.addNewCertFlag = true;
            this.addNewCertFlag$.next(this.addNewCertFlag);
            this.addNewCertDatePickerFlag = false;
        }

        // Hide the element
        this.certificateEditList.splice(this.certificateEditList.indexOf(id), 1);
    }

    public onAddCERT() {
        this.cert_status = 'edit';
        let selCert =
            new JobSeekerCertificate(this.fixedTextHash['upload_certificate'][this.currLan]);
        selCert.id = -1;
        selCert.cert_file_D.classMap = 'upload_cert_d' + (this.jobSeekerCertList.length);
        selCert.cert_file_D.classMap = 'upload_cert_d' + (this.jobSeekerCertList.length);
        selCert.cert_file_M.classMap = 'upload_cert_m' + (this.jobSeekerCertList.length);

        selCert.cert_file_D.file_format_list =
            ['text/plain', 'application/pdf', 'application/msword'];
        selCert.cert_file_M.file_format_list =
            ['text/plain', 'application/pdf', 'application/msword'];

        selCert.cert_file_D.index = null;
        selCert.cert_file_M.index = null;

        selCert.cert_file_M.mode = 'cert';
        selCert.cert_form = this.buildCertForm(selCert);
        selCert.cert_new = true;
        this.addNewCertFlag = false;
        this.addNewCertFlag$.next(this.addNewCertFlag);

        this.jobSeekerCertList.push(selCert);
        this.certificateEditList.push((this.jobSeekerCertList.length - 1));
    }

    public onDeleteFile(id: number = null, index: number = null) {

        this.deleteCertificateFileSubcription = this.profileService
            .deleteCertificateFile(id).subscribe((res) => {
            jQuery('.close_delete').modal('hide');
            if (index != null) {

                this.jobSeekerCertList[index].cert_doc_upload_name =
                    res['jobseeker_certificate'].document_file_name;
                this.jobSeekerCertList[index].cert_doc_upload_path =
                    res['jobseeker_certificate'].document;
                this.jobSeekerCertList$.next(this.jobSeekerCertList);
                this.profileCacheDirty = true;
                this.onUpdateProfileStatus.emit({update: true});
            }

        }, (error) => {
            if (error.status === 401) {
                this.profileService.getLogOutUser();
            }

        });
    }

    public onDelete(id: number = null) {

        this.certSpinnerFlag = true;
        this.deleteCertificateSubcription = this.profileService
            .deleteCertificate(id).subscribe((res) => {
            this.profileCacheDirty = true;
            jQuery('.close_delete').modal('hide');
            let certCnt = -1;
            this.jobSeekerCertList = [];
            if (res['jobseeker_certificates'].length === 0) {
                this.onReadCERT();
            }

            res['jobseeker_certificates'].forEach((cert) => {
                certCnt++;

                this.buildCertList(certCnt, cert);
            });

            this.onUpdateProfileStatus.emit({update: true});
            this.jobSeekerCertList$.next(this.jobSeekerCertList);

        }, (error) => {
            if (error.status === 401) {
                this.profileService.getLogOutUser();
            }

        });

    }

    public buildCertForm(selCert: any) {
        return this.fb.group({
            cert_id: [selCert.id],
            cert_name: [selCert.cert_name, Validators.required],
            cert_university: [selCert.cert_university, Validators.required],
            cert_start_date: [selCert.cert_start_date, Validators.required],
            cert_end_date: [selCert.cert_end_date, Validators.required],
            cert_grade: [selCert.cert_grade, Validators.required]
        });
    }

    public ngOnInit() {
        this.currLan = this.accountService.getCurrLang();
        this.commonDataSubcription = this.commonData.subscribe((res) => {
            if (res) {
                this.countryList = res['countries'];
            }
        });

        this.cachedProfileSubcription = this.cachedProfile.subscribe((res) => {

            if (res) {
                let certificate = res;
                let certCnt = -1;
                if (!certificate['certificate']) {
                    this.jobSeekerCertList$.next([]);
                    return;
                }
                this.jobSeekerCertList = [];
                certificate['certificate'].forEach((cert) => {
                    certCnt++;
                    this.buildCertList(certCnt, cert);
                });

                if (this.cert_status === 'edit') {
                    this.validateObj();
                }
                this.jobSeekerCertList$.next(this.jobSeekerCertList);
            }
        });
    }

    public  validateObj() {
        if (!this.jobSeekerCertList || this.jobSeekerCertList.length == 0) {
            this.onAddCERT();
        }
    }

    public buildCertList(certCnt: number, cert) {
        let selCert =
            new JobSeekerCertificate(this.fixedTextHash['upload_certificate'][this.currLan]);

        selCert.id = cert.id;

        /**
         * FileUploadSettings
         * @type {string}
         */
        selCert.cert_file_D.classMap = 'upload_cert_d' + (certCnt);
        selCert.cert_file_M.classMap = 'upload_cert_m' + (certCnt);

        selCert.cert_file_D.file_format_list =
            ['text/plain', 'application/pdf', 'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        selCert.cert_file_M.file_format_list = ['text/plain', 'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

        selCert.cert_file_D.id = cert.id;
        selCert.cert_file_M.id = cert.id;

        selCert.cert_file_D.index = certCnt;
        selCert.cert_file_M.index = certCnt;

        selCert.cert_id = cert.certificate_id;
        selCert.cert_name = cert.name;
        selCert.cert_university = cert.university_name;
        selCert.cert_grade = cert.grade;

        selCert.cert_start_date = new Date(cert.start_date);
        selCert.cert_still_studing = true;
        if (cert.end_date) {

            selCert.cert_duration = this.loaderService
                .getCalDuration(cert.start_date, cert.end_date);
            selCert.cert_end_date = new Date(cert.end_date);
            selCert.cert_still_studing = false;
        }

        selCert.cert_doc_upload_name = cert.document_file_name;
        selCert.cert_doc_upload_path = cert.document;

        selCert.cert_form = this.buildCertForm(selCert);

        this.jobSeekerCertList.push(selCert);
    }
}
