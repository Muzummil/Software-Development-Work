import { OnInit, Component, OnDestroy } from '@angular/core';

// Service
import { AccountService } from '../../../core/account/services/account.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { FolderingService } from '../../../core/services/foldering.service';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'folder-listing',
    templateUrl: 'folderListing.component.html',
    styleUrls: ['./folderListing.scss']
})

export class FolderListingComponent implements OnInit, OnDestroy {

    public currLan = 'en';
    public fixedTextHash = this.loaderService.getFixedText();
    public folderList = [];
    public currentPage = 1;
    public folderList$ = new BehaviorSubject([]);
    public totalRecords$: BehaviorSubject<any> = new BehaviorSubject(0);
    public showSpinner = true;
    public urlPath;
    public sub1;
    public sub2;
    public searchableTags = [];

    constructor(public accountService: AccountService,
                public loaderService: LoaderService,
                public activeRoute: ActivatedRoute,
                public folderingService: FolderingService,
    ) {
        this.accountService.setSwitchFlag(false);
    }

    public ngOnInit() {
        this.accountService.setCustomSeo();
        this.sub2 = this.activeRoute.queryParams.subscribe((qparams) => {
            this.currentPage = (qparams['page']) ? qparams['page'] : 1;
            this.getLoader();
        });

        this.urlPath = this.accountService.getCurrLangUrl() +
            this.accountService.getPath() + '/folders';
        this.currLan = this.accountService.getCurrLang();
    }

    public getLoader() {
        this.showSpinner = true;
        this.sub1 = this.folderingService.getAllFolders(this.currentPage).subscribe((res) => {
            this.showSpinner = false;
            this.folderList = res.folders;
            this.folderList$.next(this.folderList);
            this.totalRecords$.next(res['meta']['total_count']);
        });
    }

    public selectedTag($event) {

    }
    public ngOnDestroy() {
        this.sub1.unsubscribe();
        this.sub2.unsubscribe();
    }

    public getUrl() {
        return 'employer/folders/root/search-tags';
    }

}
