import {
    Component,
    EventEmitter,
    Input,
    Output,
    OnInit,
    ChangeDetectionStrategy, OnDestroy
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { LoaderService } from '../../shared/services/loader.service';
import { AccountService } from '../../core/account/services/account.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


@Component({
    selector: 'auto-comp1',
    template: `
        <!-- Auto complete Spinner -->
        <div *ngIf="(showSpinnerObs | async)" class="autocomplete_spinner text-align">
            <span><img src="/assets/images/balls.svg"></span>
        </div>
        <ng2-select
                [items]="items"
                [error]="error"
                [customclass]="customclass"
                [active]="initData"
                [resetOnEmpty]="resetOnEmpty"
                (data)="refreshValue($event)"
                (selected)="selected($event)"
                (keyup)="checkEnteredKeys($event)"
                placeholder="{{fixedTextHash['add_city'][currLan]}}">
        </ng2-select>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutoComplete1Component implements OnInit, OnDestroy {

    @Input() countryId: number = 2;
    @Input() items: Array<any> = [];
    public itemsObs: BehaviorSubject<any> = new BehaviorSubject([]);
    @Input() current_city: any;
    @Output() changeCityId = new EventEmitter();
    @Output() onEmptyText = new EventEmitter();
    @Input() initData: Array<any> = [];
    @Input() resetOnEmpty: boolean = false;
    @Input() error = false;
    @Input() customclass = '';
    public currLan = 'en';
    public fixedTextHash = this.loaderService.getFixedText();

    // Subscription
    public timerSubscription: Subscription;
    public citySubscription: Subscription;

    public value: any = {};
    public _disabledV: string = '0';
    public disabled: boolean = false;
    public showSpinner = false;
    public showSpinnerObs: BehaviorSubject<any> = new BehaviorSubject(this.showSpinner);

    constructor(public loaderService: LoaderService,
                public accountService: AccountService) {

    }

    public ngOnInit(): void {

        this.getNewCityList();
        this.currLan = this.accountService.getCurrLang();
    }
    checkEnteredKeys(e){
        if(e.target.value==''){
            this.onEmptyText.emit(false);
            return;
        }
    }

    public ngOnDestroy() {
        if (this.timerSubscription) {
            this.timerSubscription.unsubscribe();
        }

        if (this.citySubscription) {
            this.citySubscription.unsubscribe();
        }
    }

    public selected(value: any): void {
        this.changeCityId.emit({id: value.id, name: value.text});

    }

    public refreshValue(value: any): void {
        if (value[0]) {
            this.value = value[0];
        } else {
            this.value = value;
        }
    }

    public loader() {
        this.loaderService.getCitiesList([this.countryId]).subscribe(city => {
            this.items = [];
            city.forEach((res) => {
                this.items.push({id: res.id, text: res.name});
            });
            this.itemsObs.next(this.items);
        });
    }

    public getNewCityList() {

        this.showSpinner = true;
        this.showSpinnerObs.next(this.showSpinner);

        this.citySubscription = this.loaderService.getCitiesList([this.countryId])
            .subscribe((city) => {

            this.items = [];
            this.showSpinner = false;
            this.showSpinnerObs.next(this.showSpinner);
            city.forEach((res) => {
                this.items.push({id: res.id, text: res.name});
            });
            this.itemsObs.next(this.items);
        });
    }

}
