import {
    Component,
    Output,
    EventEmitter,
    ElementRef,
    Inject,
    Input,
    OnInit,
    ChangeDetectionStrategy, OnDestroy
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

/**
 * Services
 */
import { Tags } from '../../shared/models/Tags';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { ProfileService } from '../../core/services/profile.service';
import { AccountService } from '../../core/account/services/account.service';
import { LoaderService } from '../../shared/services/loader.service';

declare var jQuery: any;

@Component({
    selector: 'job-tags',
    templateUrl: 'tags.component.html',
    styleUrls: ['./tags.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class TagsComponent implements OnInit, OnDestroy {

    @Input() tags;
    @Output() onUpdateProfileStatus = new EventEmitter();

    public validTagLength = 50;
    public tagError: boolean = false;
    public tagsarry: Tags[] = [];
    public tags_status = 'read';
    public elementRef: ElementRef;
    public maxCount: number = 10;
    public tag = new Tags();
    public profileCacheDirty = false;

    // flags
    public showSpinnerFlag = false;

    // Observer
    public showSpinnerFlag$: BehaviorSubject<any> = new BehaviorSubject(false);

    // Subscriptions
    public tagsSubscription: Subscription;
    public updatetagsSubscription: Subscription;
    public currLan = 'en';
    public fixedTextHash = this.loaderService.getFixedText();

    constructor(public _profile_service: ProfileService,
                public loaderService: LoaderService,
                public accountService: AccountService,
                @Inject(ElementRef) elementRef: ElementRef) {
        this.elementRef = elementRef;
    }

    public ngOnInit() {
        window.scroll(0, 0);
        this.showSpinnerFlag$.next(false);
        this.currLan = this.accountService.getCurrLang();

        this.tagsSubscription = this.tags.subscribe((tag) => {
            if (tag) {
                this.tagsarry = [];
                tag.forEach((y) => {
                    let tag = new Tags();
                    tag.id = y.id;
                    tag.name = y.name;
                    tag.weight = y.weight;
                    this.tagsarry.push(tag);
                });
            }
        });
    }

    public ngOnDestroy() {

        if (this.tagsSubscription) {
            this.tagsSubscription.unsubscribe();
        }
        if (this.updatetagsSubscription) {
            this.updatetagsSubscription.unsubscribe();
        }
        if (this.profileCacheDirty) {
            AccountService.profileCacheDirty = true;
        }
    }

    public onRead() {
        this.tags_status = 'read';
    }

    public onEdit() {
        this.tags_status = 'edit';
    }

    public onAddElement($event) {
        this.tagError = false;
        if ($event.name.length > this.validTagLength) {
            this.tagError = true;
            return;
        }

        this.tag = new Tags();
        this.tag.id = $event.id;
        this.tag.name = $event.name;
        this.tagsarry.push(this.tag);
    }

    public onRemoveElement(index: number) {
        if (index > -1) {
            this.tagsarry.splice(index, 1);
        }
    }

    public onSave() {
        this.showSpinnerFlag$.next(true);

        let new_tags_obj = [];
        for (var i = 0; i < this.tagsarry.length; ++i) {
            new_tags_obj.push({id: null, name: this.tagsarry[i].name});
        }

        this.updatetagsSubscription = this._profile_service
            .updateTags({tags: new_tags_obj}).subscribe((res) => {
                this.profileCacheDirty = true;
                this.showSpinnerFlag$.next(false);

                if (res['jobseekers']) {

                    this.tagsarry = res['jobseekers'];
                    this.tags = Observable.of(this.tagsarry);
                    this.onUpdateProfileStatus.emit({update: true});
                    this.tags_status = 'read';
                }

            },
            error => {
                if (error.status == 401) {
                    this._profile_service.getLogOutUser();
                }
            });
    }
}
