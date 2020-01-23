import { FormBuilder, Validators } from '@angular/forms';
import {
    Component,
    Input,
    OnInit,
    Output,
    EventEmitter,
    ChangeDetectionStrategy, OnDestroy
} from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';

// Services
import { LoaderService } from '../../shared/services/loader.service';
import { ProfileService } from '../../core/services/profile.service';

// models
import { JobSeekerWork, RolesAndResponsible } from './models/JobSeekerWork';
import { Company } from '../../shared/models/Company';
import { Sector } from '../../shared/models/Sector';
import { City } from '../../shared/models/City';
import { Country } from '../../shared/models/Country';
import { Department } from '../../shared/models/Department';
import { AccountService } from '../../core/account/services/account.service';

declare var jQuery: any;

@Component({
    selector: 'work-block',
    templateUrl: 'work.component.html',
    styleUrls: ['./work.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class WorkComponent implements OnInit, OnDestroy {

    @Input() cachedProfile: BehaviorSubject<any>;
    @Input() commonData: BehaviorSubject<any>;
    @Input() display_mode = 'desktop';  // desktop mobile;
    @Output() onUpdateProfileStatus = new EventEmitter();

    // flags
    public work_exp_status = 'read';
    public work_exp_add = false;
    public workSpinnerFlag = false;

    // BehaviorSubject
    public jobSeekerWorkList$: BehaviorSubject<any> = new BehaviorSubject(null);

    // members
    public jobSeekerWorkList: JobSeekerWork[] = [];
    public addNewWorkFlag: boolean = true;
    public addNewWorkDatePickerFlag: boolean = false;
    public companyEditList = [];
    public countryList = [];
    public cityList = [];
    public sectorList = [];
    public profileCacheDirty = false;

    // Subscription
    public deleteWorkExperienceSubscription: Subscription;
    public deleteWorkFileSubscription: Subscription;
    public commonDataSubscription: Subscription;
    public cachedProfileSubscription: Subscription;
    public ngUnsubscribe: Subject<void> = new Subject<void>();
    public currLan = 'en';
    public fixedTextHash = this.loaderService.getFixedText();

    constructor(public fb: FormBuilder,
                public loaderService: LoaderService,
                public accountService: AccountService,
                public _profileService: ProfileService) {
    }

    public ngOnDestroy() {

        if (this.deleteWorkExperienceSubscription) {
            this.deleteWorkExperienceSubscription.unsubscribe();
        }
        if (this.deleteWorkFileSubscription) {
            this.deleteWorkFileSubscription.unsubscribe();
        }
        if (this.commonDataSubscription) {
            this.commonDataSubscription.unsubscribe();
        }
        if (this.cachedProfileSubscription) {
            this.cachedProfileSubscription.unsubscribe();
        }

        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
        this.resetCache();
    }

    public resetCache() {
        if (this.profileCacheDirty) {
            AccountService.profileCacheDirty = true;
        }
    }

    public buildCompanyForm(selWork: any) {

        return this.fb.group({
            work_id: [selWork.id],
            company_id: [selWork.company.id],
            company_name: [selWork.company.name, Validators.required],
            company_title: [selWork.company_title, Validators.required],
            company_sector_id: [selWork.company_sector.id, Validators.required],
            company_country: [selWork.company_country.id, Validators.required],
            company_city_id: [selWork.company_city.id, Validators.required],
            company_city_name: [selWork.company_city.name],
            company_start_date: [selWork.company_start_date, Validators.required],
            company_end_date: [selWork.company_end_date],
            company_still_working: [selWork.company_still_working]
        });
    }

    public updateProfile($event) {
        this.onUpdateProfileStatus.emit($event);
    }

    public onDelete(id: number = null, index: number = null) {

        this.deleteWorkExperienceSubscription = this._profileService
            .deleteWorkExperience(id).subscribe((res) => {
                this.profileCacheDirty = true;
                jQuery('.close_delete').modal('hide');
                this.jobSeekerWorkList = [];
                if (res['jobseeker_experiences'].length == 0) {
                    this.work_exp_status = 'read';
                }

                res['jobseeker_experiences'].forEach((work, work_count) => {

                    let selWork =
                        new JobSeekerWork(this.fixedTextHash['work_exp_certificate'][this.currLan]);

                    selWork = this.getBuildWorkExp(selWork, work, work_count);
                    selWork.company_form = this.buildCompanyForm(selWork);
                    this.jobSeekerWorkList.push(selWork);

                });

                this.resetCache();
                this.jobSeekerWorkList$.next(this.jobSeekerWorkList);
                this.onUpdateProfileStatus.emit({update: true});

            }, (error) => {

                if (error.status === 401) {
                    this._profileService.getLogOutUser();
                }
            });

    }

    public onDeleteFile(id: number = null, index: number = null) {

        this.deleteWorkFileSubscription = this._profileService.deleteWorkFile(id)
            .subscribe((res) => {
                this.profileCacheDirty = true;
                jQuery('.close_delete').modal('hide');

                this.jobSeekerWorkList[index] = this.getBuildWorkExp(this.jobSeekerWorkList[index],
                    res['jobseeker_experience'], index);
                this.jobSeekerWorkList[index].company_form =
                    this.buildCompanyForm(this.jobSeekerWorkList[index]);
                this.jobSeekerWorkList$.next(this.jobSeekerWorkList);
                this.onUpdateProfileStatus.emit({update: true});
            }, (error) => {

                if (error.status === 401) {
                    this._profileService.getLogOutUser();
                }
            });
    }

    public getBuildWorkExp(selWork, work, work_count) {

        selWork.id = work.id;
        selWork.company_title = work.position;
        ;
        selWork.company_start_date = new Date(work['from']);
        if (work['to'] != null) {
            selWork.company_end_date = new Date(work['to']);
        } else {
            selWork.company_end_date = null;
        }

        selWork.work_file_D.classMap = 'upload_work_d' + (work_count);
        selWork.work_file_M.classMap = 'upload_work_m' + (work_count);

        selWork.work_file_M.file_format_list = ['text/plain', 'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        selWork.work_file_D.file_format_list = ['text/plain', 'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

        selWork.work_file_D.id = work.id;
        selWork.work_file_M.id = work.id;

        selWork.work_file_D.index = work_count;
        selWork.work_file_M.index = work_count;

        selWork.company_doc_upload_name = work.document_file_name;
        selWork.company_doc_upload_path = work.document;

        // Objects
        selWork.company = (work.company != null) ? work.company : new Company();
        selWork.company_sector = (work.sector != null) ? work.sector : new Sector();
        selWork.company_city = (work.city != null) ? work.city : new City();
        selWork.company_country = (work.country != null) ? work.country : new Country();
        selWork.department = (work.department != null) ? work.department : new Department();
        selWork.company_still_working = true;

        if (work['to'] != null) {
            selWork.company_duration = this.loaderService.getCalDuration(work['from'], work['to']);

            selWork.company_still_working = false;

        } else {
            selWork.company_duration = this.loaderService.getCalDuration(work['from'], null);
        }

        selWork.temp_roles_resp_valid = true;
        selWork.temp_roles_resp = '';
        selWork.company_roles_and_resp = new Array();

        if (work['description'] && work['description'].length > 0) {
            work['description'].forEach((rr) => {
                selWork.company_roles_and_resp.push(new RolesAndResponsible(rr));
            });
        }

        return selWork;

    }

    public ngOnInit(): any {

        this.commonDataSubscription = this.commonData.subscribe((res) => {
            if (res) {
                this.countryList = res['countries'];
            }
        });

        AccountService.s3Loaded$.subscribe((resFlag) => {
            if (resFlag) {
                this.sectorList = this.loaderService.getSectors();
            }
        });

        this.cachedProfileSubscription = this.cachedProfile.subscribe((res) => {
            if (res) {
                let work_experience = res;
                if (!work_experience || !work_experience['work_experience']) {
                    this.jobSeekerWorkList$.next(null);
                } else {
                    this.jobSeekerWorkList = [];
                    work_experience['work_experience'].forEach((work, work_count) => {

                        let selWork = new JobSeekerWork(
                            this.fixedTextHash['work_exp_certificate'][this.currLan]);

                        selWork = this.getBuildWorkExp(selWork, work, work_count);
                        selWork.company_form = this.buildCompanyForm(selWork);

                        this.jobSeekerWorkList.push(selWork);
                    });

                    if (this.work_exp_status === 'edit') {
                        this.validateObj();
                    }
                    this.jobSeekerWorkList$.next(this.jobSeekerWorkList);

                }
            }
        });
        this.currLan = this.accountService.getCurrLang();
    }

    public validateObj() {
        if (!this.jobSeekerWorkList || this.jobSeekerWorkList.length === 0) {
            this.onAddWorkExp();
        }
    }

    public onReadWE() {
        this.work_exp_status = 'read';
        let last_index = this.jobSeekerWorkList.length - 1;
        this.onCancelWE(last_index);
    }

    public onEditWE(id: number = null) {
        if (id == null) {
            this.work_exp_status = 'edit';
        } else {
            this.companyEditList.push(id);
        }
    }

    public onCancelWE(id: number = null) {
        if (!this.jobSeekerWorkList || this.jobSeekerWorkList.length === 0) {
            return;
        }
        if (this.jobSeekerWorkList.length === 1) {
            this.work_exp_status = 'read';
        }

        // Change to array  so that i can remove an element
        let jobSeekerWorkList = this.jobSeekerWorkList;
        this.addNewWorkFlag = true;

        // Remove unsaved
        if (this.jobSeekerWorkList[id].newed == true) {
            jobSeekerWorkList.pop();
            this.addNewWorkDatePickerFlag = false;
        }

        // Hide the element
        this.companyEditList.splice(this.companyEditList.indexOf(id), 1);
    }

    public onCancelWE2($event) {

        this.onCancelWE($event.id);
    }

    public onSaveWE2($event) {
        if ($event['result']) {
            if ($event.id == -1) {

                this.jobSeekerWorkList[(this.jobSeekerWorkList.length - 1)].newed = false;
                this.jobSeekerWorkList[(this.jobSeekerWorkList.length - 1)] =
                    this.getBuildWorkExp(this.jobSeekerWorkList[(this.jobSeekerWorkList.length - 1)]
                        , $event['result']['jobseeker_experience'],
                        (this.jobSeekerWorkList.length - 1));

                this.jobSeekerWorkList[(this.jobSeekerWorkList.length - 1)]
                    .company_form = this.buildCompanyForm(
                    this.jobSeekerWorkList[(this.jobSeekerWorkList.length - 1)]);
                this.onCancelWE((this.jobSeekerWorkList.length - 1));
            } else {

                this.jobSeekerWorkList[$event.id] =
                    this.getBuildWorkExp(this.jobSeekerWorkList[$event.id],
                        $event['result']['jobseeker_experience'], $event.id);
                this.jobSeekerWorkList[$event.id].company_form =
                    this.buildCompanyForm(this.jobSeekerWorkList[$event.id]);
                this.onCancelWE($event.id);
            }
            this.jobSeekerWorkList$.next(this.jobSeekerWorkList);
        }
    }

    public closeBox() {
        jQuery('.close_delete').modal('hide');
    }

    public onUploadComplete($event) {
        if ($event.id != null) {

            this.jobSeekerWorkList[$event.id] =
                this.getBuildWorkExp(this.jobSeekerWorkList[($event.id)],
                    $event['result']['jobseeker_experience'], $event.id);
            this.jobSeekerWorkList[$event.id].company_form =
                this.buildCompanyForm(this.jobSeekerWorkList[$event.id]);

            this.jobSeekerWorkList$.next(this.jobSeekerWorkList);
            this.profileCacheDirty = true;
            this.onUpdateProfileStatus.emit({update: true});
        }
    }

    public onAddWorkExp() {
        this.work_exp_status = 'edit';
        let selWork = new JobSeekerWork(this.fixedTextHash['work_exp_certificate'][this.currLan]);

        selWork.id = -1;
        selWork.company_id = -1;
        selWork.newed = true;
        selWork.company_roles_and_resp = [];
        selWork.work_file_D.classMap = 'upload_work_d' + (this.jobSeekerWorkList.length);
        selWork.work_file_M.classMap = 'upload_work_m' + (this.jobSeekerWorkList.length);

        selWork.work_file_M.file_format_list =
            ['text/plain', 'application/pdf', 'application/msword'];
        selWork.work_file_D.file_format_list =
            ['text/plain', 'application/pdf', 'application/msword'];

        // company
        selWork.company = new Company();

        // sector
        selWork.company_sector = new Sector();

        // country
        selWork.company_country = new Country();

        // city
        selWork.company_city = new City();

        selWork.company_form = this.buildCompanyForm(selWork);
        this.addNewWorkFlag = false;
        this.jobSeekerWorkList.push(selWork);
        this.jobSeekerWorkList$.next(this.jobSeekerWorkList);
        let id = this.jobSeekerWorkList.length - 1;

        this.companyEditList.push(id);

        this.work_exp_add = true;
    }
}
