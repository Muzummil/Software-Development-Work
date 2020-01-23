import { OnInit, Component, OnDestroy, Input } from '@angular/core';

// Service
import { AccountService } from '../../../core/account/services/account.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { ActivatedRoute } from '@angular/router';
import { FolderingService } from '../../../core/services/foldering.service';
import { BehaviorSubject } from 'rxjs';
import { ErrorHandling } from '../../../core/services/errorHandling.service';

@Component({
    selector: 'folder-detail',
    templateUrl: 'folderDetail.component.html',
    styleUrls: ['./folderDetail.scss']
})

export class FolderDetailComponent implements OnInit, OnDestroy {

    public currLan = 'en';
    public sub;
    public sub2;
    public folderId;
    public folderName;
    public fixedTextHash = this.loaderService.getFixedText();
    public folderList = [];
    public ancestors = [];
    public folderObj = {};
    public folderList$ = new BehaviorSubject([]);
    public totalRecords$: BehaviorSubject<any> = new BehaviorSubject(0);
    public showSpinner = true;
    public currentPage = 1;
    public level = 1;
    public urlPath;

    constructor(public accountService: AccountService,
                public folderingService: FolderingService,
                public loaderService: LoaderService,
                public errorHandling: ErrorHandling,
                public activeRoute: ActivatedRoute) {
    }

    public ngOnInit() {
        this.currLan = this.accountService.getCurrLang();

        this.sub = this.activeRoute.params.subscribe((params) => {

            this.sub2 = this.activeRoute.queryParams.subscribe((qparams) => {
                this.currentPage = (qparams['page']) ? qparams['page'] : 1;
                if (params['folderTitle-id']) {
                    let paramList = params['folderTitle-id'].split('-');
                    this.folderId = +paramList[paramList.length - 1];
                    this.folderName = paramList[0];

                    this.urlPath = this.accountService.getCurrLangUrl()
                        + this.accountService.getPath() + '/folders/' +  params['folderTitle-id'];
                    this.loadDate();
                }
            });
        });
    }

    public loadDate() {
        this.folderingService.getFolderDetails(this.folderId, this.currentPage).subscribe((res) => {
            this.showSpinner = false;
            this.folderObj = res;
            this.folderList = res['folders'];
            this.ancestors = res['meta'].folder_details.ancestors;
            this.level = res['meta'].folder_details.level;
            this.folderList$.next(this.folderList);
            this.totalRecords$.next(res['meta']['total_count']);

            }, (errors) => {
            let error = {status: 404};
            this.errorHandling.errorHandling(error);
        });
    }

    public ngOnDestroy(): void {
        this.sub.unsubscribe();
        this.sub2.unsubscribe();
    }

    public getUrl() {
        return 'employer/folders/' + this.folderName + '-' + this.folderId + '/search-tags';
    }

}
