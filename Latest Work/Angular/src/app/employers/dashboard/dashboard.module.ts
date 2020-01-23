import { NgModule } from '@angular/core';
import { FileUploadModule } from 'ng2-file-upload/ng2-file-upload';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

// Modules
import { SharedModule } from '../../shared/shared.module';
import { DashboardStatsModule } from '../../core/dashboard/stats/dashboardStats.module';
import { CandidateDetailsModule } from '../candidate/candidateDetails.module';
import { PaginationModule } from '../../shared/pagination.module';

// Services
import { LoaderService } from '../../shared/services/loader.service';

// Route Guard
import { CanActivateMostViewedProfiles } from './canActivateMostViewedProfiles.activate.guard';

// Routes
import { DashboardRoutingModule } from './dashboard.route';

// Components
import { TopMenuComponent } from './topMenu.component';
import { StatsComponent } from './stats.component';
import { MostViewedJobsComponent } from './mostViewedJobs.component';
import { MostViewedProflesComponent } from './mostViewedProfiles.component';
import { CandidateComponent } from './candidate.component';
import { AnimateCircleModule } from '../../shared/animateCircle.module';

@NgModule({
    imports: [DashboardRoutingModule,
        CommonModule,
        FormsModule,
        FileUploadModule,
        AnimateCircleModule,
        ReactiveFormsModule,
        PaginationModule,
        DashboardStatsModule,
        CandidateDetailsModule,
        SharedModule],
    providers: [LoaderService, CanActivateMostViewedProfiles],
    declarations: [CandidateComponent, MostViewedJobsComponent,
        MostViewedProflesComponent, StatsComponent, TopMenuComponent],
    exports: []
})

export class DashboardModule {

}
