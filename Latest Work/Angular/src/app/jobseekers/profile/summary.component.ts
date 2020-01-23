import {Input, OnInit,Output,EventEmitter,Component,ChangeDetectionStrategy} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup,Validators} from '@angular/forms';

import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Subscription} from "rxjs/Subscription";
import {ProfileService} from "../../core/services/profile.service";
import {AccountService} from "../../core/account/services/account.service";
import {LoaderService} from "../../shared/services/loader.service";


@Component({
    selector: "profile-summary",
    templateUrl: "summary.component.html",
    styleUrls: ['./summary.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})


export class SummaryComponent implements OnInit {

    @Input() summary;
    @Output() onUpdateProfileStatus = new EventEmitter();

    public summary_status = "read";
    public profileCacheDirty = false;
    //flags
    public summaryLoader = false;
    public summaryLoader$:BehaviorSubject<any> = new BehaviorSubject(false);
    public postFlag:boolean = false;
    public currLan = "en";
    public fixedTextHash = this.loaderService.getFixedText();

    summary_form:FormGroup;

    //Subscription
    public resultSubscription:Subscription;


    ngOnInit() {
        window.scroll(0,0);
        this.summary_form.controls["summary"].setValue(this.summary);
        this.currLan = this.accountService.getCurrLang();

    }

    constructor(fb:FormBuilder,
                public loaderService:LoaderService,
                public accountService:AccountService,
                public _profileService:ProfileService,
                public _router:Router) {

        //Average word is 5 char separated by 1 char space
        let summary_validation = {
            summary: ['', Validators.compose([
                Validators.minLength(30),
                Validators.maxLength(1800)
            ])],
        };

        this.summary_form = fb.group(summary_validation);
    }

    onSubmit() {

        if (this.summary_form.valid) {
            this.summaryLoader = true;
            this.summaryLoader$.next(true);
            this.postFlag = true;
            let result = this._profileService.updateSummary(this.summary_form.value);

            this.resultSubscription =result.subscribe(
                x => {
                    this.profileCacheDirty = true;
                    this.summaryLoader = false;
                    this.summaryLoader$.next(false);
                    this.summary = this.summary_form.value["summary"];
                    this.postFlag =false;

                    this.summary_status = 'read';
                    this.onUpdateProfileStatus.emit({"update":true});

                },
                response => {
                    if (response.status == 404) {

                        this._router.navigate(['NotFound']);
                    }
                    if (response.status == 401) {
                        this._profileService.getLogOutUser();
                    }
                });
        }
        else {

        }

    }


    ngOnDestroy() {

        if(this.resultSubscription)
            this.resultSubscription.unsubscribe();
        if(this.profileCacheDirty){
            AccountService.profileCacheDirty = true;
        }
    }
    onRead() {
        this.summary_form.controls['summary'].setValue(this.summary);
        this.summary_status = "read";
    }

    onEdit() {
        this.summary_status = "edit";
    }

}
