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
import { CareerFairEmployerRoutes } from './careerFairEmployer.route';
import { ImageCropperModule } from 'ng2-img-cropper';
import { UploadModule } from '../../shared/upload.module';
import { CareerFairListComponent } from './careerFairList/careerFairList.component';
import { CareerFairAddEditComponent } from './careerFairAddEdit/careerFairAddEdit.component';
import { CareerFairDetailsEmpComponent } from './careerFairDetailsEmp/careerFairDetailsEmp.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        ElementBlockModule,
        PaginationModule,
        DatePipeModule,
        CareerFairEmployerRoutes,
        ImageCropperModule,
        UploadModule
    ],
    declarations: [
        CareerFairListComponent,
        CareerFairDetailsEmpComponent,
        CareerFairAddEditComponent
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
export class CareerFairEmployerModule {

    constructor(@Optional() @SkipSelf() parentModule: CareerFairEmployerModule) {
        if (parentModule) {
            throw new Error('CareerModule already loaded; Import in root module only.');
        }
    }
}
