import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EvaluationFormComponent } from './evaluationForm.component';

@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, SharedModule],
    declarations: [EvaluationFormComponent],
    providers: [],
    exports: []
})

export class EvaluationFormModule {

}
