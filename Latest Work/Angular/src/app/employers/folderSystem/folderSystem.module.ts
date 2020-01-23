import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { FolderToolBarModule } from './folderToolsBar/folderToolBar.module';

// Components
import { FolderListingComponent } from './folderListing/folderListing.component';
import { FolderDetailComponent } from './folderDetail/folderDetail.component';
import { FolderBreadCrumbComponent } from './folderBreadCrumb/folderBreadCrumb.component';
import { FolderCandidateListComponent } from './folderCandidateList/folderCandidateList.component';
import { FolderSearchTagsListComponent }
    from './FolderSearchTagsList/folderSearchTagsList.component';

// Routes
import { FolderSystemRoutingModule } from './folderSystem.routes';

// Services
import { FolderingService } from '../../core/services/foldering.service';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FolderChartModule } from './folderChart/folderChart.module';
import { PaginationModule } from '../../shared/pagination.module';
import { SearchTagFolderModule } from '../../core/searchTagFolder/searchTagFolder.module';

@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, SharedModule,
        FolderSystemRoutingModule, FolderToolBarModule, FolderChartModule, PaginationModule,
        SearchTagFolderModule],
    declarations: [FolderListingComponent, FolderDetailComponent, FolderBreadCrumbComponent,
    FolderCandidateListComponent, FolderSearchTagsListComponent],
    providers: [FolderingService],
    exports: []
})

export class FolderSystemModule {

}
