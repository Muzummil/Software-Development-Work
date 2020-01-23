import { NgModule } from '@angular/core';
import { FileUploadModule } from 'ng2-file-upload/ng2-file-upload';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

// Components
import { TermsComponent } from './terms.component';
import { TermsArComponent } from './terms.ar.component';
import { PolicyComponent } from './policy.component';
import { PolicyArComponent } from './policy.ar.component';

// Service
import { AccountService } from '../account/services/account.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        FileUploadModule,
        ReactiveFormsModule,
        SharedModule],
    providers: [AccountService],
    declarations: [TermsComponent, TermsArComponent,
        PolicyComponent, PolicyArComponent],
    exports: [TermsComponent, TermsArComponent,
        PolicyComponent, PolicyArComponent]
})

export class GeneralModule {

}
