import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

// Component
import { UploadComponent } from '../shared/directives/upload.component';
import { BuildFileUploadComponent } from '../shared/directives/buildFileUpload.component';

// Modules
import { FileUploadModule } from 'ng2-file-upload/ng2-file-upload';
import { ImageCropperModule } from 'ng2-img-cropper/src/imageCropperModule';

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        FileUploadModule,
        ImageCropperModule,
        RouterModule,
    ],
    declarations: [
        UploadComponent,
        BuildFileUploadComponent,
    ],
    exports: [
        UploadComponent,
        BuildFileUploadComponent
    ]
})

export class UploadModule {

}