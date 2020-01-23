import { OnInit, Component, OnDestroy, Input } from '@angular/core';

// Service
import { AccountService } from '../../core/account/services/account.service';
import { LoaderService } from '../../shared/services/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from '../services/profile.service';

@Component({
    selector: 'search-tag-folder',
    templateUrl: 'searchTagFolder.component.html',
    styleUrls: ['./searchTagFolder.scss']
})

export class SearchTagFolderComponent  implements OnInit {

    @Input() public  selectedTagsIds = [];
    @Input() public  url = '';
    public currLan = 'en';
    public fixedTextHash = this.loaderService.getFixedText();
    public searchableTags = [];
    public allTags = null;
    public  selectedTagsList = [];

    constructor(public accountService: AccountService,
                public loaderService: LoaderService,
                public profileService: ProfileService,
                public router: Router
    ) {

    }

    public ngOnInit(): void {
        this.getAllTags();
        this.currLan = this.accountService.getCurrLang();
    }

    public getAllTags() {
        this.profileService.getTags().subscribe((res) => {
            if (res) {
                this.allTags = res;
                this.getTagSearchList(this.allTags);
                this.getTagIds();
            }
        });
    }

    public getTagIds() {

        this.selectedTagsList = this.allTags.hash_tags
            .filter((selTag) => this.selectedTagsIds.indexOf(selTag['id']) !== -1);
    }

    public getTagSearchList(allTags) {
        this.searchableTags = [];
        allTags.hash_tags.forEach((selTag) => {
            this.searchableTags.push({id: selTag['id'], text: selTag['name']});
        });

    }

    public selectedTag($event) {
        let matchList = this.selectedTagsIds.filter((selTagId) => $event.id === selTagId);
        if (matchList.length === 0) {
            this.selectedTagsIds.push($event.id);
            this.selectedTagsList.push({id: $event.id, name: $event.text});
            this.getNewUrl();
        }
    }

    public getNewUrl() {
        let pageParams = (this.selectedTagsIds.length > 0) ?
            {ids : this.selectedTagsIds.toString()} : {};
        this.router.navigate([this.url], {queryParams: pageParams});
    }

    public getRemoveTag(selectTag) {
         this.selectedTagsIds = this.selectedTagsIds
             .filter((res) => res !== selectTag['id']);
         this.selectedTagsList = this.selectedTagsList
            .filter((res) => res['id'] !== selectTag['id']);
         this.getNewUrl();
    }
}
