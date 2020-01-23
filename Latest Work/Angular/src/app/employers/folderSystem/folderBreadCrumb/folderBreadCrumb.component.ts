import { OnInit, Component, Input } from '@angular/core';

// Service
import { AccountService } from '../../../core/account/services/account.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { ActivatedRoute } from '@angular/router';

@Component({
        selector: 'folder-breadcrumb',
    templateUrl: 'folderBreadCrumb.component.html',
    styleUrls: ['./folderBreadCrumb.scss']
})

export class FolderBreadCrumbComponent implements OnInit {

    public currLan = 'en';
    public fixedTextHash = this.loaderService.getFixedText();
    @Input() public ancestors = [];
    @Input() public level = 1;
    @Input() public activeClass = '';  // folder, Candidates
    constructor(public accountService: AccountService,
                public loaderService: LoaderService,
                public activeRoute: ActivatedRoute) {
    }

    public ngOnInit() {
        this.currLan = this.accountService.getCurrLang();
    }
}
