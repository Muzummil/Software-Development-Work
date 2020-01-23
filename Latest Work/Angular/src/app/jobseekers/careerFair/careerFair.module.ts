import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { ElementBlockModule } from '../../shared/elementBlock.module';
import { PaginationModule } from '../../shared/pagination.module';
import { DatePipeModule } from '../../shared/datePipe.module';
import { AccountService } from '../../core/account/services/account.service';
import { ConfigService } from '../../shared/config.service';
import { LoaderService } from '../../shared/services/loader.service';
import { CareerFairService } from '../../core/services/careerFair.service';
import { CareerRoutes } from './careerFair.route';
import { CareerFairDetailsComponent } from './careerFairDetails/careerFairDetails.component';
import { CareerFairListComponent } from './careerFairList/careerFairList.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        ElementBlockModule,
        PaginationModule,
        DatePipeModule,
        CareerRoutes
    ],
    declarations: [
        CareerFairListComponent,
        CareerFairDetailsComponent,
    ],
    providers: [
        AccountService,
        Location,
        FormBuilder,
        ConfigService,
        LoaderService,
        CareerFairService
    ],

    exports: []
})
export class CareerFairModule {

    constructor(@Optional() @SkipSelf() parentModule: CareerFairModule) {
        if (parentModule) {
            throw new Error('CareerModule already loaded; Import in root module only.');
        }
    }
}
