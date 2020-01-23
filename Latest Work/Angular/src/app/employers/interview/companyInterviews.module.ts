import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

// Services

// Route Guard

// Components
import { CompanyInterviewComponent } from './companyInterview/companyInterviews.component';

@NgModule({
    imports: [CommonModule, RouterModule, SharedModule],
    declarations: [CompanyInterviewComponent],
    exports: []
})

export class CompanyInterviewModule {

}
