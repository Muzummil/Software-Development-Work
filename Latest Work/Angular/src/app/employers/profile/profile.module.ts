import { NgModule } from '@angular/core';
import { FileUploadModule } from 'ng2-file-upload/ng2-file-upload';
import { CompanyDetailsModule } from '../../core/company/companyDetails.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { ElementBlockModule } from '../../shared/elementBlock.module';
import { CandidateDetailsModule } from '../candidate/candidateDetails.module';

// Services
import { LoaderService } from '../../shared/services/loader.service';
import { StatsService } from '../../core/services/stats.service';
import { JobService } from '../../core/services/job.service';

// Routes
import { ProfileRoutingModule } from './profile.routes';
import { PaginationModule } from '../../shared/pagination.module';

// Components
import { CompanyComponent } from './company/company.component';
import { CandidateComponent } from './candidate/candidate.component';
import { CompanyEditComponent } from './companyEdit/companyEdit.component';
import { CompanyEditMobileComponent } from './companyEditMobile/companyEditMobile.component';
import { CompanyGeneralMobileComponent } from './companyGeneralMobile/companyGeneralMobile.component';
import { CompanyEditAboutComponent } from './companyEditAbout/companyEditAbout.component';
import { CompanyCultureMobileComponent }
from './companyCultureMobile/companyCultureMobile.component';
import { CompanyCultureDesktopComponent }
    from './companyCultureDesktop/companyCultureDesktop.component';
import { TopMenuComponent } from './topMenu/topMenu.component';
import { CompanyUsersComponent } from './companyUsers/companyUsers.component';
import { CompanyUserAddEditComponent } from './companyUserAddEdit/companyUserAddEdit.component';
import { CompanyUserReportComponent } from './companyUserReport/companyUserReport.component';
import { FilterProfilesComponent } from './filterProfiles/filterProfiles.component';
import { UploadModule } from '../../shared/upload.module';
import { SafePipeModule } from '../../shared/safePipe.module';

@NgModule({
    imports: [
        CompanyDetailsModule, ProfileRoutingModule,
        CommonModule,
        CandidateDetailsModule,
        UploadModule,
        PaginationModule,
        FormsModule,
        SafePipeModule,
        FileUploadModule,
        ReactiveFormsModule,
        ElementBlockModule,
        SharedModule],
    providers: [LoaderService, StatsService, JobService],
    declarations: [
        CompanyComponent,
        CandidateComponent,
        CompanyUserAddEditComponent,
        CompanyUserReportComponent,
        CompanyUsersComponent,
        FilterProfilesComponent,
        CompanyCultureDesktopComponent,
        CompanyCultureMobileComponent,
        TopMenuComponent,
        CompanyEditComponent,
        CompanyEditMobileComponent,
        CompanyGeneralMobileComponent,
        CompanyEditAboutComponent
    ],
    exports: []
})

export class ProfileModule {

}
