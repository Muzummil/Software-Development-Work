import {
    Input,
    Component,
    OnInit,
    Output,
    EventEmitter,
    ChangeDetectionStrategy, OnDestroy
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ConfigService } from '../../shared/config.service';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';

import { File } from '../../shared/models/File';
import { AccountService } from '../../core/account/services/account.service';
import { LoaderService } from '../../shared/services/loader.service';

// Directives

@Component({

    selector: 'work-edu-cert',
    templateUrl: 'work_edu_cert.component.html',
    styleUrls: ['./work_edu_cert.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush

})

export class WorkEduCertComponent implements OnInit, OnDestroy {
    @Input() cachedProfile: BehaviorSubject<any>;
    @Input() commonData: BehaviorSubject<any>;
    @Output() onUpdateProfileStatus = new EventEmitter();
    public currLan = 'en';
    public fixedTextHash = this.loaderService.getFixedText();

    public cachedProfile$: BehaviorSubject<any> = new BehaviorSubject(null);

    // General Data List
    public sectorList: any;

    public screenwidth = 0;
    public mobileScreen = ConfigService.mobileScreen;
    public screenTab = 'experience';

    // Subscriptions
    public cachedProfileSubcription: Subscription;
    private ngUnsubscribe: Subject<void> = new Subject<void>();

    // Members
    public file: File;

    /**
     * Forms
     */
    public formCompany: FormGroup;

    constructor(public fb: FormBuilder,
                public accountService: AccountService,
                public loaderService: LoaderService) {

        this.formCompany = this.fb.group({
            company_name: ['', Validators.compose([Validators.required])],
            company_title: ['', Validators.required],
            company_sector_id: ['', Validators.required],
            company_country: ['', Validators.required],
            company_city_id: ['', Validators.required],
            company_start_date: ['', Validators.required],
            company_end_date: ['', Validators.required]
        });

    }

    public switchTab(mode = 'experience') {

        this.screenTab = mode;
    }

    public ngOnInit(): any {
        this.currLan = this.accountService.getCurrLang();
        window.scroll(0, 0);
        this.screenwidth = window.innerWidth;
        this.cachedProfileSubcription = this.cachedProfile.subscribe((res) => {

            if (res) {
                this.cachedProfile$.next(res);
            }
        });
    }

    public ngOnDestroy() {
        if (this.cachedProfileSubcription) {
            this.cachedProfileSubcription.unsubscribe();
        }
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

}
