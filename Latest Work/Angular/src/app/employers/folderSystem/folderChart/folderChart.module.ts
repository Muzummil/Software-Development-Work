import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { FolderModalModule } from '../folderModal/folderModal.module';

// Components
import { FolderChartComponent } from './folderChart.component';
// Routes

// Services
import { FolderingService } from '../../../core/services/foldering.service';

@NgModule({
    imports: [CommonModule, RouterModule, RouterModule, SharedModule, FolderModalModule],
    declarations: [FolderChartComponent],
    providers: [FolderingService],
    exports: [FolderChartComponent]
})

export class FolderChartModule {

    constructor(@Optional() @SkipSelf() parentModule: FolderChartModule) {
        if (parentModule) {
            throw new Error('FolderChartModule already loaded; Import in root module only.');
        }
    }
}
