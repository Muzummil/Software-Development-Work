import { OnInit, Component, Input, Output, EventEmitter } from '@angular/core';

// Service
import { AccountService } from '../../../core/account/services/account.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { BehaviorSubject } from 'rxjs';
import { FolderingService } from '../../../core/services/foldering.service';

@Component({
    selector: 'folder-chart',
    templateUrl: 'folderChartcomponent.html',
    styleUrls: ['./folderChart.scss']
})

export class FolderChartComponent implements OnInit {

    public currLan = 'en';
    public fixedTextHash = this.loaderService.getFixedText();
    public folderList = [];
    @Input() public specialOperation = 'none';  // none, move, add
    @Input() public folderList$ = new BehaviorSubject([]);
    @Input() public parentId = null;
    @Input() public jobseekerFolderId = null;
    @Input() public candidateObj = null;
    @Input() public currentFolderId = null;
    @Output() public updateDone = new EventEmitter();
    @Output() public seeMore = new EventEmitter();
    public showSpinner = true;

    constructor(public accountService: AccountService,
                public loaderService: LoaderService,
                public folderingService: FolderingService
    ) {
    }

    public ngOnInit() {
        this.currLan = this.accountService.getCurrLang();
        if (this.folderList$) {
            this.folderList$.subscribe((res) => {
                if (res) {
                    this.folderList = res.map((selFolder) => {
                        selFolder['show_sub'] = false;
                        return selFolder;
                    });
                    this.showSpinner = false;
                }
            });
        }

    }

    public getUrl(folder) {
        let url = this.accountService.getCurrLangUrl() + this.accountService.getPath() +
            '/folders/' + this.accountService.getSpaceToDashLowerCase(folder.name) + '-' +
            folder.id;

        if (folder.level === 3) {
            url += '/candidates';
        }

        return url;
    }

    public getAddMoveTo(folderObj) {
        let postJson = {jobseeker_folder :
                {jobseeker_id: this.getJobseekerId(), folder_id: folderObj.id}};
        if (this.currentFolderId) {
            this.folderingService.editJobseekerFolder(this.jobseekerFolderId, postJson)
                .subscribe((res) => {
                        this.updateDone.emit({status: true});
                    },
                    (error) => {
                        this.updateDone.emit({status: false, error, folder: folderObj});
                    });
        }else {
            this.folderingService.createJobseekerFolder(postJson)
                .subscribe((res) => {
                    this.updateDone.emit({status: true});
                },
                (error) => {
                    this.updateDone.emit({status: false, error, folder: folderObj});
                    });
        }
    }

    public getToggleSub(selFolder) {
        selFolder['show_sub'] = (selFolder['show_sub']) ? false : true;
    }

    public getAddFolderInCache(folderObj) {
        this.folderList.push(folderObj.folder);
        this.folderList$.next(this.folderList);
    }

    public getEditFolderInCache(folderObj) {
        this.folderList = this.editFolderInTree(folderObj.folder, this.folderList);
        this.folderList$.next(this.folderList);
    }

    public getDeleteFolderInCache(folderId) {
        this.folderList = this.removeFolderFromTree(this.folderList, folderId);
        this.folderList$.next(this.folderList);
    }

    public editFolderInTree(folderObj, folderTree = []) {
        if (folderTree.length === 0) {
            return [folderObj];
        }else {
            folderTree.forEach((selFolder, selFolderIndex) => {
                if (selFolder.id === folderObj.id) {
                    folderTree[selFolderIndex] = folderObj;
                }else {
                    if (selFolder.sub_folders && selFolder.sub_folders.length > 0) {
                        selFolder.sub_folders =
                            this.editFolderInTree(folderObj, selFolder.sub_folders);
                    }
                }
            });
        }
        return folderTree;
  }

    public removeFolderFromTree(folderTree = [], folderId) {
        folderTree.forEach((selFolderLevel, folderIndex) => {
            if (selFolderLevel.id === folderId) {
                delete folderTree[folderIndex];
                folderTree = folderTree.filter((i) => i);
            } else {
                if (selFolderLevel.sub_folders && selFolderLevel.sub_folders.length > 0) {
                    selFolderLevel.sub_folders =
                        this.removeFolderFromTree(selFolderLevel.sub_folders, folderId);
                }
            }

        });
        return folderTree;

    }

    public getErrorMessage() {
        // Not Implemented Yet
    }

    public getSeeMore(folderId) {
        this.seeMore.emit({folderId});
    }

    public getJobseekerId() {
        return (this.candidateObj.jobseeker_id) ?
            this.candidateObj.jobseeker_id : this.candidateObj.id;
    }

}
