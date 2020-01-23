import { NgModule } from '@angular/core';
import { LeftsideBarComponent, FooterBarComponent, HeaderBarComponent } from '../layout/index';
import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SwitchLanguageModule } from '../switch_language/switchLanguage.module';
import { BaseFooterBarComponent } from '../layout/baseFooterBar/baseFooterBar.component';
import { BaseHeaderBarComponent } from '../layout/baseHeaderBar/baseHeaderBar.component';
import { BasePublicMenuBarComponent } from '../layout/basePublicMenuBar/basePublicMenuBar.component';
import { PublicMenuBarComponent } from '../layout/publicMenuBar/publicMenuBar.component';


@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        RouterModule,
        SlimLoadingBarModule,
        SwitchLanguageModule
    ],
    declarations: [
        LeftsideBarComponent,
        FooterBarComponent,
        BaseFooterBarComponent,
        BaseHeaderBarComponent,
        BasePublicMenuBarComponent,
        PublicMenuBarComponent,
        HeaderBarComponent,
    ],
    exports: []
})

export class DisplayBlockModule {

}
