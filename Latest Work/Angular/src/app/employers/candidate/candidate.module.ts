import { NgModule } from '@angular/core';
import { FileUploadModule } from 'ng2-file-upload/ng2-file-upload';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

// Modules
import { SharedModule } from '../../shared/shared.module';
import { DashboardStatsModule } from '../../core/dashboard/stats/dashboardStats.module';
import { CandidateDetailsModule } from './candidateDetails.module';
import { CandidateProfileComModule } from './candidateProfileCom.module';
import { ElementBlockModule } from '../../shared/elementBlock.module';
import { SearchTagModule } from '../../shared/searchTag.module';
import { PaginationModule } from '../../shared/pagination.module';

// services
import { LoaderService } from '../../shared/services/loader.service';
import { AccountService } from '../../core/account/services/account.service';
import { CompanyService } from '../../core/services/company.service';

// Routes
import { CandidateRoutingModule } from './candidate.routes';

// Components
import { SearchCandidatesComponent } from './searchCandidates/searchCandidates.component';
import { FilterCandidateComponent } from './filterCandidate/filterCandidate.component';
import { ListCandidatesComponent } from './listCandidates/listCandidates.component';
import { CandidateProfileComponent } from './candidateProfile/candidateProfile.component';

import { AnimateCircleModule } from '../../shared/animateCircle.module';
import { FolderToolBarModule } from '../folderSystem/folderToolsBar/folderToolBar.module';
import { CandidateHistoryComponent } from './candidateHistory/candidateHistoryComponent';
import { EvaluationFormModule } from '../evaluationForm/evaluationForm.module';

@NgModule({
    imports: [
        CandidateRoutingModule,
        CommonModule,
        ElementBlockModule,
        SearchTagModule,
        PaginationModule,
        CandidateDetailsModule,
        AnimateCircleModule,
        FormsModule,
        FileUploadModule,
        ReactiveFormsModule,
        DashboardStatsModule,
        CandidateProfileComModule,
        FolderToolBarModule,
        EvaluationFormModule,
        SharedModule],
    providers: [LoaderService, AccountService, CompanyService],
    declarations: [
        SearchCandidatesComponent,
        CandidateHistoryComponent,
        ListCandidatesComponent,
        FilterCandidateComponent,
        CandidateProfileComponent],
    exports: [SearchCandidatesComponent, ListCandidatesComponent,
        FilterCandidateComponent, CandidateProfileComponent]
})

export class CandidateModule {

}
