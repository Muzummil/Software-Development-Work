import { Router } from '@angular/router';
import {
    Input,
    OnInit,
    Output,
    EventEmitter,
    Component,
    ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup } from '@angular/forms';

// Services
import { ProfileService } from '../../core/services/profile.service';

// Directives

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

// models
import { File1, File } from '../../shared/models/File';
import { AccountService } from '../../core/account/services/account.service';
import { LoaderService } from '../../shared/services/loader.service';

@Component({

    selector: 'address_contact_resume',
    templateUrl: 'address_contact_resume.html',
    styleUrls: ['./addressContactResume.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,

})

export class AddressContactResumeComponent implements OnInit {

    @Input() public jobSeekerContact;
    @Input() public cachedProfile: BehaviorSubject<any>;
    @Input() public jobSeekerAddress;
    @Input() public contactList;
    @Input() public address;
    @Input() public contact;
    @Input() public coverLetters;
    @Input() public resumes;
    @Input() public commonData;
    @Output() public onUpdateProfileStatus = new EventEmitter();

    //Observables
    public resumes2$: BehaviorSubject<any> = new BehaviorSubject(null);
    public coverLetters2$: BehaviorSubject<any> = new BehaviorSubject(null);
    public loadSpinner$: BehaviorSubject<any> = new BehaviorSubject(false);

    //members
    public resumes2: File1[] = [];
    public resumes_previous: File1[] = [];
    public file: File;
    public profileCacheDirty = false;

    public coverLetters2: File1[] = [];
    public coverLetters_previous: File1[] = [];

    public file1: File;
    public default_coverletter: number = null;
    public default_resume: number = null;


    public countryList = [];
    public cityList = [];
    public delResumeList = [];
    public delCoverLetterList = [];

    //flags
    public status3 = 'read';
    public status4 = 'read';
    public tab = 'resume';
    public setDefaultResume: boolean = false;
    public setDefaultCoverLetter: boolean = false;
    public deleteResume: boolean = false;
    public deleteCoverLetter: boolean = false;

    public status3$: BehaviorSubject<any> = new BehaviorSubject('read');
    public status4$: BehaviorSubject<any> = new BehaviorSubject('read');
    public currLan = 'en';
    public fixedTextHash = this.loaderService.getFixedText();

    public addressLoader = false;

    constructor(
        public _profileService: ProfileService,
        public loaderService: LoaderService,
        public accountService: AccountService,
        public _router: Router) {

    }

    public ngOnDestroy() {
        if (this.profileCacheDirty) {
            AccountService.profileCacheDirty = true;
        }
    }

    public ngOnInit() {
        this.currLan = this.accountService.getCurrLang();
        window.scroll(0, 0);
        this.file = new File(this.fixedTextHash['cv'][this.currLan], 'resume',
            'PDF, DOC', 4, 'MB', true);
        this.file.file_format_list = ['text/plain', 'application/pdf', 'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        this.file.classMap = 'resume_block';

        this.loadSpinner$.next(true);
        this.cachedProfile.subscribe((res) => {

            if (res) {
                if (res['resumes']) {
                    this.resumes2 = [];
                    res['resumes'].forEach((selResume, resumeId) => {
                        let file1 = new File1();
                        file1.name = selResume.document_file_name || selResume.title;
                        file1.default = selResume.default;
                        file1.url = selResume.document;
                        file1.id = selResume.id;
                        this.resumes2.push(file1);
                    });

                    this.resumes_previous = this.resumes2.slice();

                    this.resumes2$.next(this.resumes2);
                }

                if (res['coverletters']) {
                    this.coverLetters2 = [];
                    res['coverletters'].forEach((selCoverletter) => {
                        let file1 = new File1();
                        file1.name = selCoverletter.document_file_name || selCoverletter.title;
                        file1.default = selCoverletter.default;
                        file1.url = selCoverletter.document;
                        file1.id = selCoverletter.id;
                        this.coverLetters2.push(file1);
                    });

                    this.coverLetters_previous = this.coverLetters2.slice();

                    this.coverLetters2$.next(this.coverLetters2);
                }

                this.loadSpinner$.next(false);
            }
        });

        this.file1 = new File(this.fixedTextHash['upload_your_cover_letter'][this.currLan],
            'coverletter', 'PDF, DOC', 4, 'MB', true);
        this.file1.file_format_list = ['text/plain', 'application/pdf', 'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        this.file1.classMap = 'coverletter';
    }

    public onReadResume() {
        if (this.deleteResume === true) {
            this.resumes2 = this.resumes_previous.slice();
            this.resumes2$.next(this.resumes2);
            this.deleteResume = false;
        }

        this.status3 = 'read';
        this.status3$.next('read');
    }

    public onEditResume() {
        this.status3 = 'edit';
        this.status3$.next('edit');
    }

    public onDeleteCoverLetter(index: number, id: number) {
        this.deleteCoverLetter = true;
        this.delCoverLetterList.push(id);

        this.coverLetters2.splice(index, 1);
        this.coverLetters2$.next(this.coverLetters2);
    }

    public onDeleteResume(index: number, id: number) {
        this.deleteResume = true;
        this.delResumeList.push(id);

        this.resumes2.splice(index, 1);
        this.resumes2$.next(this.resumes2);
    }

    public onReadCover() {
        if (this.deleteCoverLetter == true) {
            this.coverLetters2 = this.coverLetters_previous.slice();
            this.coverLetters2$.next(this.coverLetters2);
            this.deleteCoverLetter = false;
        }
        this.status4 = 'read';
        this.status4$.next('read');
    }

    public onEditCover() {
        this.status4 = 'edit';
        this.status4$.next('edit');
    }

    public showResume() {
        this.tab = 'resume';

    }

    public showCoverLetter() {
        this.tab = 'cover';

    }

    public setResumeDefault(id: number) {
        this.setDefaultResume = true;

        this.default_resume = this.resumes2[id].id;
        this.resumes2.forEach((resume) => {
            resume.default = false;
        });
        this.resumes2[id].default = true;
        this.resumes2$.next(this.resumes2);
    }

    public updateCoverLetterList($event) {
        if ($event['result']) {

            let selCoverletter = $event['result']['jobseeker_coverletter'];

            let file1 = new File1();
            file1.name = selCoverletter.document_file_name;
            file1.default = selCoverletter.default;
            file1.url = selCoverletter.document;
            file1.id = selCoverletter.id;
            this.coverLetters2.push(file1);
            this.setCoverLetterDefault((this.coverLetters2.length - 1));

            this.coverLetters2$.next(this.coverLetters2);
        }
    }

    public updateResumeList($event) {

        if ($event['result']) {

            let selResume = $event['result']['jobseeker_resume'];

            let file1 = new File1();
            file1.name = selResume.document_file_name;
            file1.default = selResume.default;
            file1.url = selResume.document;
            file1.id = selResume.id;
            this.resumes2.push(file1);
            this.onUpdateProfileStatus.emit({update: true});
            this.setResumeDefault((this.resumes2.length - 1));

            this.resumes2$.next(this.resumes2);
        }
    }

    public onSaveCover() {
        if (this.deleteCoverLetter === true) {
            this._profileService.deleteCoverLetterList(this.delCoverLetterList).subscribe((val) => {
                    this.profileCacheDirty = true;
                    this.deleteCoverLetter = false;
                    this.onReadCover();
                    this.onUpdateProfileStatus.emit({update: true});
                },
                (error) => {
                    this.coverLetters2 = this.coverLetters_previous.slice();
                    this.coverLetters2$.next(this.coverLetters2);
                    if (error.status == 401) {
                        this._profileService.getLogOutUser();
                    }

                }
            );
        } else if (this.setDefaultCoverLetter === true) {

            this.setDefaultCoverLetter = false;
            this._profileService.setDefaultCoverLetter(this.default_coverletter)
                .subscribe((val) => {
                        this.onReadCover();
                        this.profileCacheDirty = true;
                        this.onUpdateProfileStatus.emit({update: true});
                    },
                    (error) => {
                        if (error.status === 401) {
                            this._profileService.getLogOutUser();
                        }

                    }
                );
        } else {
            this.status4 = 'read';
            this.status4$.next('read');
        }
    }

    public onSaveResume() {

        if (this.deleteResume === true) {
            this._profileService.deleteResumeList(this.delResumeList).subscribe((val) => {
                    this.profileCacheDirty = true;
                    this.deleteResume = false;
                    this.onReadResume();
                    this.onUpdateProfileStatus.emit({update: true});
                },
                (error) => {

                    this.resumes2 = this.resumes_previous.slice();
                    this.resumes2$.next(this.resumes2);
                    if (error.status === 401) {
                        this._profileService.getLogOutUser();
                    }

                }
            );
        } else if (this.setDefaultResume === true) {

            this.setDefaultResume = false;
            this._profileService.setDefaultResume(this.default_resume).subscribe((val) => {
                    this.onReadResume();
                    this.profileCacheDirty = true;
                    this.onUpdateProfileStatus.emit({update: true});
                },
                (error) => {

                    if (error.status === 401) {
                        this._profileService.getLogOutUser();
                    }

                }
            );
        } else {
            this.status3 = 'read';
            this.status3$.next('read');
        }
    }

    public onDownloadFile(url: string) {
        open(url, '_blank');
    }

    public setCoverLetterDefault(id: number) {
        this.setDefaultCoverLetter = true;
        this.default_coverletter = this.coverLetters2[id].id;

        this.coverLetters2.forEach((coverLetters) => {
            coverLetters.default = false;
        });
        this.coverLetters2[id].default = true;
        this.coverLetters2$.next(this.coverLetters2);
    }

}
