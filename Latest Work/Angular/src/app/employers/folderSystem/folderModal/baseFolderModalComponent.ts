import { OnInit, Component, Input, ElementRef, Output, EventEmitter } from '@angular/core';

// Service
import { AccountService } from '../../../core/account/services/account.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { FolderingService } from '../../../core/services/foldering.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CompanyService } from '../../../core/services/company.service';

declare var jQuery: any;

@Component({
    selector: 'folder-base-modal',
    template: ''
})

export class BaseFolderModalComponent implements OnInit {

    @Input() public folderObject = null;
    @Output() public folderDeleted = new EventEmitter();
    @Output() public folderCreated = new EventEmitter();
    @Output() public folderEdited = new EventEmitter();
    public currLan = 'en';
    public showSpinner = false;
    public errorflag = false;
    public fixedTextHash = this.loaderService.getFixedText();
    public addEditForm: FormGroup;
    public pristineFlag: boolean = true;

    constructor(public accountService: AccountService,
                public loaderService: LoaderService,
                public companyService: CompanyService,
                public element: ElementRef,
                public formBld: FormBuilder,
                public folderingService: FolderingService,
    ) {
    }

    public ngOnInit() {
        this.currLan = this.accountService.getCurrLang();
    }

    public getCreateAddEditForm() {
        this.addEditForm = this.formBld.group({
            name: ['', Validators.required],
            id: [''],
            parent_id: [null],
            assigned_user_ids: [[this.accountService.getUserId()], Validators.required],
            only_me: ['true']
        });
    }

    public getFolderDelete(folderId) {
        this.errorflag = false;
        this.showSpinner = true;
        this.folderingService.deleteFolder(folderId).subscribe((res) => {
            this.showSpinner = false;
            this.element.nativeElement.querySelector('.delete-folder').click();
            this.folderDeleted.emit(true);
        }, (error) => {
            this.showSpinner = false;
            this.errorflag = true;
            this.folderDeleted.emit(false);
        });

    }


}
