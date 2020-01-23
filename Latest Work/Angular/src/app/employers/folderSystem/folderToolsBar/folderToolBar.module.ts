import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { FolderChartModule } from '../folderChart/folderChart.module';

// Components
import { FolderToolBarComponent } from '../folderToolsBar/folderToolBar.component';

// Routes

// Services
import { FolderingService } from '../../../core/services/foldering.service';
import { ProfileService } from '../../../core/services/profile.service';

// Modules
import { VideoModule } from '../../../shared/video.module';
import { ElementBlockModule } from '../../../shared/elementBlock.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [CommonModule, RouterModule, RouterModule, SharedModule, FolderChartModule,
        VideoModule, ElementBlockModule, FormsModule, ReactiveFormsModule],
    declarations: [FolderToolBarComponent],
    providers: [FolderingService, ProfileService],
    exports: [FolderToolBarComponent]
})

export class FolderToolBarModule {

    constructor(@Optional() @SkipSelf() parentModule: FolderToolBarModule) {
        if (parentModule) {
            throw new Error('FolderToolBarModule already loaded; Import in root module only.');
        }
    }
}
