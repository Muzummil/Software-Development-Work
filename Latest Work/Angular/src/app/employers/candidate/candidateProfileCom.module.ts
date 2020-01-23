import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

// Modules
import { SharedModule } from '../../shared/shared.module';
import { ElementBlockModule } from '../../shared/elementBlock.module';

// Services
import { LoaderService } from '../../shared/services/loader.service';
import { AccountService } from '../../core/account/services/account.service';
import { CompanyService } from '../../core/services/company.service';

// Components
import { CandidateProfileComComponent } from './candidateProfileCom/candidateProfileCom.component';
import { OfferLetterComponent } from './offerLetter/offerletter.component';

@NgModule({
    imports: [
        CommonModule,
        ElementBlockModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule],
    providers: [LoaderService, AccountService, CompanyService],
    declarations: [
        CandidateProfileComComponent, OfferLetterComponent],
    exports: [CandidateProfileComComponent, OfferLetterComponent]
})

export class CandidateProfileComModule {


}
