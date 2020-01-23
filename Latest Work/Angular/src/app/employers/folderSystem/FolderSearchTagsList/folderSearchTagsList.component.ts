import { OnInit, Component, OnDestroy } from '@angular/core';

// Service
import { AccountService } from '../../../core/account/services/account.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { FolderingService } from '../../../core/services/foldering.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ProfileService } from '../../../core/services/profile.service';

@Component({
    selector: 'folder-candidate-search-tag-list',
    templateUrl: 'folderSearchTagsList.component.html',
    styleUrls: ['./folderSearchTagsList.scss']
})

export class FolderSearchTagsListComponent implements OnInit, OnDestroy {

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
    public tagIds = [];
    public loadedFlag= false;

    constructor(public accountService: AccountService,
                public folderingService: FolderingService,
                public loaderService: LoaderService,
                public router: Router,
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
                    this.currentPage = (qparams['page']) ? qparams['page'] : 1;
                    this.tagIds = ((qparams['ids']) ? qparams['ids'].split(',') : [])
                        .map((res) => parseInt(res, 10))
                    this.loadDate();
                }
            });

        });
    }

    public getUrl() {
        let folderIdentifier = (this.folderName !== 'root')
            ? this.folderName + '-' + this.folderId : 'root';
        return 'employer/folders/' + folderIdentifier + '/search-tags';
    }

    public loadDate() {
        this.folderingService
            .getCandidateInFolderByTags(this.folderId, this.tagIds, this.currentPage)
            .subscribe((res) => {
                this.showSpinner = false;
                this.jobseekerList = res['jobseekers'];
                this.totalRecords$.next(res['meta']['total_count']);
                this.jobSeekerList$.next(this.jobseekerList);
                this.loadedFlag = true;
            });
    }

    public ngOnDestroy(): void {
        this.sub.unsubscribe();
        this.sub2.unsubscribe();
    }

    public getUpdateResult($event) {
        if ($event) {
            this.loadDate();
        }
    }

    public getUpdateTags(jobseekerIndex, tags) {
        this.jobSeekerList$.value[jobseekerIndex]['hash_tags'] = tags;
    }

    public goBack() {
        let folderIdentifier = (this.folderName !== 'root')
            ? '/' + this.folderName + '-' + this.folderId : '';
        this.router.navigate(['/employer/folders' + folderIdentifier]);
    }
}
