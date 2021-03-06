import { NgModule } from '@angular/core';
import { FileUploadModule } from 'ng2-file-upload/ng2-file-upload';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

// Modules
import { SharedModule } from '../../shared/shared.module';
import { DashboardStatsModule } from '../../core/dashboard/stats/dashboardStats.module';
import { VideoModule } from '../../shared/video.module';
import { CandidateProfileComModule } from './candidateProfileCom.module';

// Services
import { LoaderService } from '../../shared/services/loader.service';
import { AccountService } from '../../core/account/services/account.service';
import { CompanyService } from '../../core/services/company.service';

// Components
import { CandidateComponent } from './candidate/candidate.component';
import { DatePipeModule } from '../../shared/datePipe.module';
import { PaginationModule } from '../../shared/pagination.module';
import { AnimateCircleModule } from '../../shared/animateCircle.module';
import { FolderToolBarModule } from '../folderSystem/folderToolsBar/folderToolBar.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        DatePipeModule,
        PaginationModule,
        FileUploadModule,
        ReactiveFormsModule,
        DashboardStatsModule,
        AnimateCircleModule,
        FolderToolBarModule,
        CandidateProfileComModule,
        VideoModule,
        SharedModule],
    providers: [LoaderService, AccountService, CompanyService],
    declarations: [CandidateComponent],
    exports: [CandidateComponent]
})

export class CandidateDetailsModule {

}
