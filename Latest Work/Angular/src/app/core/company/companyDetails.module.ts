// angular
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

// Services
import { CompanyService } from '../services/company.service';

// Modules
import { SharedModule } from '../../shared/shared.module';
import { SafePipeModule } from '../../shared/safePipe.module';
import { PaginationModule } from '../../shared/pagination.module';

// Components
import { CompanyDetailsComponent } from './companyDetails/companyDetails.component';
import { CultureComponent } from './culture/culture.component';
import { CompanyPremiumComponent } from './companyPremium/companyPremium.component';
import { ElementBlockModule } from '../../shared/elementBlock.module';
import { CompanyTeamComponent } from './companyTeam/companyTeam.component';
import { UploadModule } from '../../shared/upload.module';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule,
        PaginationModule,
        SafePipeModule,
        ElementBlockModule,
        UploadModule
    ],
    declarations: [
        CompanyDetailsComponent,
        CompanyPremiumComponent,
        CultureComponent,
        CompanyTeamComponent

    ],
    providers: [
        CompanyService
    ],
    exports: [CompanyDetailsComponent, CompanyPremiumComponent, CultureComponent]
})
export class CompanyDetailsModule {

    constructor(@Optional() @SkipSelf() parentModule: CompanyDetailsModule) {
        if (parentModule) {
            throw new Error('CompanyDetailsModule already loaded; Import in root module only.');
        }
    }
}
