import { FolderListingComponent } from './folderListing/folderListing.component';
import { FolderDetailComponent } from './folderDetail/folderDetail.component';

import { RouterModule } from '@angular/router';
import { FolderCandidateListComponent } from './folderCandidateList/folderCandidateList.component';
import { FolderSearchTagsListComponent } from './FolderSearchTagsList/folderSearchTagsList.component';

export const FolderSystemRoutingModule = RouterModule.forChild([
    {
        path: '',
        component: FolderListingComponent
    },
    {
        path: ':folderTitle-id',
        component: FolderDetailComponent
    },
    {
        path: ':folderTitle-id/candidates',
        component: FolderCandidateListComponent
    },
    {
        path: ':folderTitle-id/search-tags',
        component: FolderSearchTagsListComponent
    }

]);
