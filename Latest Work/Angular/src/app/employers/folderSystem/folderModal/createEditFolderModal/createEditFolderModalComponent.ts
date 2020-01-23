import { Component, Input, OnInit } from '@angular/core';
import { BaseFolderModalComponent } from '../baseFolderModalComponent';

@Component({
    selector: 'folder-create-edit-modal',
    templateUrl: './createEditFolderModalComponent.html',
    styleUrls: ['./createEditFolderModal.scss']
})

export class CreateEditFolderModalComponent extends BaseFolderModalComponent implements OnInit {

    @Input() public parentId = null;
    public allUsers;
    public customErrorMessage = null;
    public currLan = 'en';

    public ngOnInit() {
        this.currLan = this.accountService.getCurrLang();
        this.getCreateAddEditForm();
        this.loadUsers();
        this.addEditForm.controls['parent_id'].setValue(this.parentId);
        if (this.folderObject) {
            this.getLoadFolderObjectToForm();
        }
    }

    public loadUsers() {
        this.companyService.getCachedCompanyUsers(this.accountService.getCompanyId(),
            100, true).subscribe((res) => {
            this.allUsers = res;
        });
    }

    public getLoadFolderObjectToForm() {

        this.addEditForm.controls['id'].setValue(this.folderObject.id);
        this.addEditForm.controls['name'].setValue(this.folderObject.name);
        this.addEditForm.controls['parent_id'].setValue(this.folderObject.parent_id);
        if (this.folderObject.assigned_user_ids.length > 1 ) {
            this.addEditForm.controls['only_me'].setValue('false');
        }else {
            this.addEditForm.controls['only_me'].setValue('true');
        }
        this.addEditForm.controls['assigned_user_ids']
            .setValue(this.folderObject.assigned_user_ids);

    }

    public getReset() {
        this.addEditForm.controls['assigned_user_ids']
            .setValue([this.accountService.getUserId()]);
        this.addEditForm.controls['name'].setValue('');
    }

    public getResetToMe() {
        this.addEditForm.controls['assigned_user_ids']
            .setValue([this.accountService.getUserId()]);
    }

    public getEditFolder() {

        this.pristineFlag = false;
        this.resetErrors();
        if (this.addEditForm.valid) {
            this.showSpinner = true;
            delete this.addEditForm.value['only_me'];
            this.folderingService.editFolder(this.folderObject.id, {folder: this.addEditForm.value})
                .subscribe((res) => {
                    this.showSpinner = false;
                    this.element.nativeElement.querySelector('.add-edit-folder').click();
                    this.folderEdited.emit(res);
                }, (error) => {
                    this.showSpinner = false;
                    this.errorflag = true;
                    this.getCustomError(error['error']);
                    this.folderEdited.emit(null);
                });

        }
    }

    public getCreateFolder() {

        this.pristineFlag = false;
        this.resetErrors();
        if (this.addEditForm.valid) {
            this.showSpinner = true;
            delete this.addEditForm.value['only_me'];
            this.folderingService.createFolder({folder: this.addEditForm.value})
                .subscribe((res) => {
                    this.showSpinner = false;
                    // this.addEditForm.reset();
                    this.addEditForm.controls['only_me'].setValue('true');
                    this.getReset();
                    this.element.nativeElement.querySelector('.add-edit-folder').click();
                    this.folderCreated.emit(res);
                }, (error) => {
                    this.showSpinner = false;
                    this.errorflag = true;
                    this.getCustomError(error['error']);
                    this.folderCreated.emit(null);
                });

        }
    }

    public resetErrors() {
        this.customErrorMessage = null;
        this.errorflag = false;
    }

    public getCustomError(error) {
        if (error && error.name) {
            this.customErrorMessage =
                this.fixedTextHash['error_folder_name_taken'][this.currLan];
        } else if (error && error.level) {
            this.customErrorMessage =
                this.fixedTextHash['error_folder_name_reached_max'][this.currLan];
        }
    }

}
