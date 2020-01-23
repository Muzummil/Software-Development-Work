import { File } from '../../../shared/models/File';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CompanyPicture } from '../../../shared/models/Company';

import { Router } from '@angular/router';

// Services
import { CompanyService } from '../../../core/services/company.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { AccountService } from '../../../core/account/services/account.service';

declare var jQuery: any;

@Component({
    selector: 'company-culture-mobile',
    templateUrl: 'companyCultureMobile.component.html',
    styleUrls: ['./companyCultureMobile.scss']
})

export class CompanyCultureMobileComponent implements OnInit {

    // Forms
    public cultureForm: FormGroup;
    @Input() companyCultureObs: BehaviorSubject<any> = new BehaviorSubject(null);
    @Input() companyId: number = null;

    @Output() backEmit: EventEmitter<any> = new EventEmitter();

    // Behavior Subject
    public pristineFlag$: BehaviorSubject<any> = new BehaviorSubject(true);
    public mainPicUpdatedObs: BehaviorSubject<any> = new BehaviorSubject(false);
    public postSuccessFull: boolean = false;
    public pageMode = 'list';  // list edit add
    public fileMainList = [];
    public fileNew;
    public currLan = 'en';
    public fixedTextHash = this.loaderService.getFixedText();

    constructor(public _router: Router,
                public _companyservice: CompanyService,
                public loaderService: LoaderService,
                public  accountService: AccountService,
                public _fb: FormBuilder) {
    }

    public buildAddNewFile() {

        this.fileNew = new File(this.fixedTextHash['add_new_office_picture'][this.currLan],
            'profile', 'PNG, JPG', 3, 'MB');
        this.fileNew.classMap = 'newculture';
        this.fileNew.mode = 'company_culture';
        this.fileNew.formParams.push({title: 'title', value: '', placeholder: 'title'});
        this.fileNew.selId = '';
        this.fileNew.method = 'POST';
        this.fileNew.root = 'culture[avatar]';
        this.fileNew.rootTag = 'culture';
        this.fileNew.cropperSettings_croppedWidth = 860;
        this.fileNew.cropperSettings_croppedHeight = 635;
        this.fileNew.cropperSettings_width = 860;
        this.fileNew.cropperSettings_height = 635;
    }

    public onBuildFileuploaders() {
        this.buildAddNewFile();
        this.companyCultureObs.subscribe((res) => {

            res.forEach((selteam, cultureIndex) => {

                this.fileMainList[cultureIndex] =
                    new File(this.fixedTextHash['edit_office_picture'][this.currLan],
                        'profile', 'PNG, JPG', 3, 'MB');
                this.fileMainList[cultureIndex].classMap = 'myculturemain' + cultureIndex;
                this.fileMainList[cultureIndex].mode = 'company_culture';
                this.fileMainList[cultureIndex].formParams.push({
                    title: 'title',
                    value: selteam['name']
                });
                this.fileMainList[cultureIndex].selId = selteam['id'];
                this.fileMainList[cultureIndex].method = 'PUT';
                this.fileMainList[cultureIndex].root = 'culture[avatar]';
                this.fileMainList[cultureIndex].rootTag = 'culture';
                this.fileMainList[cultureIndex].cropperSettings_croppedWidth = 860;
                this.fileMainList[cultureIndex].cropperSettings_croppedHeight = 635;
                this.fileMainList[cultureIndex].cropperSettings_width = 860;
                this.fileMainList[cultureIndex].cropperSettings_height = 635;
                this.fileMainList[cultureIndex].file_optional = true;
            });
        });
    }

    public ngOnInit(): void {
        this.currLan = this.accountService.getCurrLang();
        window.scroll(0, 0);
        this.onBuildFileuploaders();
    }

    public onDelete(id, index) {
        this._companyservice.getDeleteCultureMember(this.companyId,
            this.companyCultureObs.value[index]['id']).subscribe((res) => {
            this.companyCultureObs.next(res);
            jQuery('.close_delete').modal('hide');
        });
    }

    public onBack() {
        this.backEmit.emit({operation: 'back'});
    }

    public onMainUploaded($event) {

        if ($event['result']['culture']) {

            let newCultureFlag = true;
            this.companyCultureObs.value.forEach((selval, selIndex) => {

                if (selval.id == $event['result']['culture']['id']) {
                    newCultureFlag = false;
                    this.companyCultureObs.value[selIndex]['image_url'] =
                        $event['result']['culture']['avatar'];
                    this.companyCultureObs.value[selIndex]['image_thumb_url'] =
                        $event['result']['culture']['avatar'];
                    this.companyCultureObs.value[selIndex]['name'] =
                        $event['result']['culture']['title'];

                }

                this.mainPicUpdatedObs.next(true);
            });

            if (newCultureFlag == true) {
                let picture = new CompanyPicture();
                picture.id = $event['result']['culture']['id'];
                picture.name = $event['result']['culture']['title'];
                picture.description = $event['result']['culture']['title'];
                picture.image_url = $event['result']['culture']['avatar'];
                picture.image_thumb_url = $event['result']['culture']['avatar'];
                this.companyCultureObs.value.unshift(picture);
            }

            this.onBuildFileuploaders();
        }
    }

    public onCultureSave() {
        this.pristineFlag$.next(false);

        let postData = {};
        if (this.cultureForm.valid) {

            postData = {
                culture: {
                    title: this.cultureForm.value['title']
                }
            };

            this._companyservice.updateCompanyCulture(this.companyId, this.cultureForm.value['id'],
                postData).subscribe((res) => {

                this.postSuccessFull = true;
                window.scroll(0, 0);
                Observable.of(1).delay(2000)
                    .subscribe((x) => {

                        if (this.cultureForm.value['id']) {
                            this.companyCultureObs.value.forEach((selval, selIndex) => {
                                if (selval.id == res[0]['id']) {
                                    this.companyCultureObs.value[selIndex] = res[0];
                                }
                            });
                        } else {
                            this.companyCultureObs.value.unshift(res[0]);
                        }

                        this.postSuccessFull = false;
                        this.pageMode = 'list';
                    });
            });
        }

    }


}
