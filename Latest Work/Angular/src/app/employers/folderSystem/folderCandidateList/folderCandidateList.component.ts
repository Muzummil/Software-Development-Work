import { OnInit, Component, OnDestroy } from '@angular/core';

// Service
import { AccountService } from '../../../core/account/services/account.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { FolderingService } from '../../../core/services/foldering.service';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'folder-candidate-list',
    templateUrl: 'folderCandidateList.component.html',
    styleUrls: ['./folderCandidateList.scss']
})

export class FolderCandidateListComponent implements OnInit, OnDestroy {

    public currLan = 'en';
    public sub;
    public sub2;
    public level;
    public folderId;
    public folderName;
    public currentPage = 1;
    public fixedTextHash = this.loaderService.getFixedText();
    public jobseekerList = [];
    public ancestors = [];
    public jobSeekerList$ = new BehaviorSubject([]);
    public showSpinner = true;
    public totalRecords$: BehaviorSubject<any> = new BehaviorSubject(0);
    public urlPath;

    constructor(public accountService: AccountService,
                public folderingService: FolderingService,
                public loaderService: LoaderService,
                public activeRoute: ActivatedRoute) {
    }
    public ngOnInit() {
        this.accountService.setCustomSeo();
        this.currLan = this.accountService.getCurrLang();

        this.sub = this.activeRoute.params.subscribe((params) => {

            this.sub2 = this.activeRoute.queryParams.subscribe((qparams) => {
                if (params['folderTitle-id']) {
                    let paramList = params['folderTitle-id'].split('-');
                    this.folderId = +paramList[paramList.length - 1];
                    this.folderName = paramList[0];
                    this.urlPath = this.accountService.getCurrLangUrl()
                        + this.accountService.getPath() + '/folders/' +  params['folderTitle-id']
                        + '/candidates';
                    this.currentPage = (qparams['page']) ? qparams['page'] : 1;
                    this.loadDate();
                }
            });

        });
    }

    public loadDate() {
        this.folderingService.getFolderCandidateDetails(this.folderId, this.currentPage)
            .subscribe((res) => {
            this.showSpinner = false;
            this.jobseekerList = res['jobseeker_folders'];
            this.ancestors = res['meta']['folder_details'].ancestors;
            this.level = res['meta']['folder_details'].level;
            this.totalRecords$.next(res['meta']['total_count']);
            this.jobSeekerList$.next(this.jobseekerList);

        });
    }

    public ngOnDestroy(): void {
        this.sub.unsubscribe();
    }

    public getUpdateResult($event) {
        if ($event) {
            this.loadDate();
        }
    }

    public getUpdateTags(jobseekerIndex, tags) {
        this.jobSeekerList$.value[jobseekerIndex]['jobseeker']['hash_tags'] = tags;
    }

    public getUrl() {
        return 'employer/folders/' + this.folderName + '-' + this.folderId + '/search-tags';
    }
}
