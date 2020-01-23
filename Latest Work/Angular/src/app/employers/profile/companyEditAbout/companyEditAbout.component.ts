import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';

// Services
import { CompanyService } from '../../../core/services/company.service';

declare var jQuery: any;

@Component({

    selector: 'company-about',
    templateUrl: 'companyEditAbout.component.html',
    styleUrls: ['./companyEditAbout.scss']

})

export class CompanyEditAboutComponent implements OnInit {

    // Forms
    public commonForm: FormGroup;
    @Input() companyObs: BehaviorSubject<any> = new BehaviorSubject(null);
    @Input() companyId: number = null;

    @Output() backEmit: EventEmitter<any> = new EventEmitter();

    // Behavior Subject
    public pristineFlag$: BehaviorSubject<any> = new BehaviorSubject(true);
    public postSuccessFull: boolean = false;
    public phoneNo: string;

    constructor(public _router: Router,
                public _companyservice: CompanyService,
                public _fb: FormBuilder) {
    }

    public ngOnInit(): void {
        window.scroll(0, 0);
        this.companyObs.subscribe((res) => {
            this.commonForm = this._fb.group({
                id: [res['id']],
                summary: [res['summary'], Validators.required]
            });
        });
    }

    public onBack() {
        this.backEmit.emit({operation: 'back'});
    }

    public onCompanySave() {

        this.pristineFlag$.next(false);

        let postData = {};
        if (this.commonForm.valid) {

            postData = {
                company: {
                    summary: this.commonForm.value['summary']

                }
            };

            this._companyservice.updateCompanyDetails(this.companyId, postData)
                .subscribe((res) => {

                this.postSuccessFull = true;
                window.scroll(0, 0);
                Observable.of(1).delay(2000)
                    .subscribe(x => {
                        this.postSuccessFull = false;
                        this.backEmit.emit({operation: 'back'});
                    });

            });
        }

    }

}
