import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

//Component
import {LanguageTagComponent} from '../shared/directives/languageTag.component';
import {MobLanguageTagComponent} from '../shared/directives/mobLanguageTag.component';
import {ElementBlockModule} from '../shared/elementBlock.module';




@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        ElementBlockModule,
        RouterModule,
    ],
    declarations: [
        LanguageTagComponent,
        MobLanguageTagComponent
    ],
    exports: [
        LanguageTagComponent,
        MobLanguageTagComponent
    ]
})



export class LanguageModule {


}