import { File } from '../../../shared/models/File';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CompanyPicture } from '../../../shared/models/Company';

import { Router } from '@angular/router';

// Services
import { CompanyService } from '../../../core/services/company.service';
import { AccountService } from '../../../core/account/services/account.service';
import { LoaderService } from '../../../shared/services/loader.service';

declare var jQuery: any;

@Component({
    selector: 'company-culture-desktop',
    templateUrl: 'companyCultureDesktop.component.html',
    styleUrls: ['./companyCultureDesktop.scss']

})

export class CompanyCultureDesktopComponent implements OnInit {

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
                public accountService: AccountService,
                public loaderService: LoaderService,
                public _fb: FormBuilder) {
    }

    public buildAddNewFile() {
        this.fileNew = new File(this.fixedTextHash['add_new_office_picture'][this.currLan],
            'profile', 'PNG, JPG', 3, 'MB');
        this.fileNew.classMap = 'newculture_desktop';
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
        this.companyCultureObs.subscribe((res) => {

            this.buildAddNewFile();
            res.forEach((selteam, cultureIndex) => {

                this.fileMainList[cultureIndex] =
                    new File(this.fixedTextHash['edit_office_picture'][this.currLan],
                        'profile', 'PNG, JPG', 3, 'MB');
                this.fileMainList[cultureIndex].classMap = 'myculturemain_desktop' + cultureIndex;
                this.fileMainList[cultureIndex].mode = 'company_culture';

                this.fileMainList[cultureIndex].formParams.push({
                    title: 'title',
                    value: selteam['name'],
                    placeholder: 'title'
                });

                this.fileMainList[cultureIndex].selId = selteam['id'];
                this.fileMainList[cultureIndex].method = 'PUT';
                this.fileMainList[cultureIndex].root = 'culture[avatar]';
                this.fileMainList[cultureIndex].rootTag = 'culture';
                this.fileMainList[cultureIndex].file_optional = true;
                this.fileMainList[cultureIndex].cropperSettings_croppedWidth = 860;
                this.fileMainList[cultureIndex].cropperSettings_croppedHeight = 635;
                this.fileMainList[cultureIndex].cropperSettings_width = 860;
                this.fileMainList[cultureIndex].cropperSettings_height = 635;
            });
        });
    }

    public ngOnInit(): void {
        window.scroll(0, 0);
        this.currLan = this.accountService.getCurrLang();
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

            this.buildAddNewFile();
            this.onBuildFileuploaders();
        }
    }


}
