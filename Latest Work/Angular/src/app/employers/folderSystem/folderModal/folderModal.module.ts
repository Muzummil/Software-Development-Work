import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateEditFolderModalComponent }
from './createEditFolderModal/createEditFolderModalComponent';
import { BaseFolderModalComponent } from './baseFolderModalComponent';
import { DeleteFolderModalComponent } from './deleteFolderModal/deleteFolderModalComponent';
import { FolderingService } from '../../../core/services/foldering.service';

@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, SharedModule],
    declarations: [CreateEditFolderModalComponent, BaseFolderModalComponent,
        DeleteFolderModalComponent],
    providers: [FolderingService],
    exports: [CreateEditFolderModalComponent, BaseFolderModalComponent,
        DeleteFolderModalComponent]
})

export class FolderModalModule {

}
