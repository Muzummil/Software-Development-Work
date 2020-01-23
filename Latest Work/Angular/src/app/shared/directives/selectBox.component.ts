import {
    Component,
    Input,
    EventEmitter,
    Output,
    ChangeDetectionStrategy,
    OnDestroy, OnChanges
} from '@angular/core';
import { ElementRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';

@Component({
    host: {
        '(document:click)': 'onClick($event)',
    },
    selector: 'bootstrap-selectbox',
    styleUrls: ['./selectBox.scss'],
    template: `
        <div (mouseleave)="mouseLeave()" class="new-drop-down">
            <form [formGroup]="formAuto">
                <input type="text"
                       class="{{customclass}}"
                       formControlName="search_string"
                       #autocomp
                       autocomplete="off"
                       (click)="moveFocus()"
                       (keydown)="inputEvent($event)"
                       (keyup)="inputEvent($event, true)"
                       [attr.placeholder]="placeholder"
                       [class.error-feild]="error">
                <span *ngIf="showCaret == true" class="caret"></span>
            </form>
            <ul class="autocomplete_v2" [class.hide]="hideList" [class.dropdown-menu]="showTopDrop">
                <li *ngFor="let selItem of items,let selIndex = index"
                    [class.active-auto-v2]="items.length == 0"
                    [class.active-auto-v2]="autocomp.value == selItem?.name"
                    class="option-{{selIndex}}"
                    (click)="getArrowselected(selItem?.id,selItem?.name,true);sendEvent($event)">
                    {{selItem?.name}}
                </li>
            </ul>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class SelectBoxComponent implements OnDestroy, OnChanges {

    @Input() visible = true;
    @Input() selectList = [];
    @Input() excludeItems: any[] = [];
    @Input() placeholder = '';
    @Input() selectedValue = null;
    @Input() stringFeedback = true;
    @Input() resetOnLoad = true;
    @Input() showCaret = true;
    @Input() mouseLeaveReset: boolean = false;
    @Input() selectOnEmpty = false;
    @Input() returnEmptyBox = false;
    @Input() arrowSelectionCompulsion = false;
    @Input() onTypeOpen = false;
    @Input() createNewList = true;
    @Input() showSearch = true;
    @Input() clickOutEmit = true;
    @Input() resetNow = false;
    @Input() resetOnSelect: boolean = false;
    @Input() selectOneEnter: boolean = true;
    @Output() selectedId = new EventEmitter();
    @Output() onEmptyText = new EventEmitter();
    @Output() selectedString = new EventEmitter();
    @Output() returnEvent = new EventEmitter();
    @Input() customclass = '';

    public searchString = '';
    public typedString: string = '';
    public items = [];
    public selectionEmitFlag: boolean = true;

    // Subscriptions
    public search_stringSubscription: Subscription;

    public formAuto: FormGroup;
    public element: ElementRef;
    public newListFlag: boolean = true;
    @Input() selectOnType: boolean = false;
    public dropDownSelect = false;
    public firstLoadFlag: boolean = true;
    public hideList: boolean = true;
    @Input() showTopDrop: boolean = false;
    @Input() error: boolean = false;
    @Input() resetOnEmpty: boolean = true;
    @Input() expandNewList: boolean = true;

    public limit1 = 5;
    public limit2 = 7;
    public limit4 = 5;
    public madeSelect = false;
    public search_string;

    private currentmode = null;
    private selectedOption = 0;
    private arrowSelection: boolean = false;
    private activeOption = 0;
    private ngUnsubscribe: Subject<void> = new Subject<void>();
    constructor(public fb: FormBuilder, element: ElementRef) {

        this.element = element;
        this.formAuto = this.fb.group({search_string: []});
        this.search_stringSubscription = this.formAuto.controls['search_string']
            .valueChanges.debounceTime(0).subscribe((val) => {
            if (val && val.length > 0 || this.selectOnEmpty) {

                this.arrowSelection = false;
                this.search_string = val;
                if (this.onTypeOpen && !this.firstLoadFlag) {
                    this.hideList = false;
                }
                if (this.selectOnType && !this.dropDownSelect) {
                    // Use this if you want to emit any string as you type
                    this.selectedId.emit({id: null, name: val});
                }
                if (!this.firstLoadFlag && this.createNewList === true) {
                    this.selectionEmitFlag = false;
                    this.getNewList(val);
                }
                if (this.madeSelect === false) {

                    this.firstLoadFlag = false;
                    this.dropDownSelect = false;
                }


                this.madeSelect = false;
            } else if (this.returnEmptyBox && (val && val.length === 0)) {
                this.selectedId.emit({id: null, name: null});
                this.reset();
            } else {
                if (this.resetOnEmpty) {
                    this.getBkupList();
                }
            }
        });

    }

    public getCheckExclude(id) {

        let returnFlag = false;
        this.excludeItems.forEach((val) => {

            if (val['id'] === id) {
                returnFlag = true;
            }

        });

        return returnFlag;
    }

    public mouseLeave() {
        if (this.mouseLeaveReset) {
            this.reset();
        }
    }

    public onClick(event) {
        // SelectionEmitFlag is false means. reset.
        if (!this.selectionEmitFlag && this.clickOutEmit) {
            this.formAuto.controls['search_string'].setValue('');
            this.selectedId.emit({id: null, name: ''});
        }

        // Reset Flags
        this.selectionEmitFlag = true;
        this.firstLoadFlag = true;

        if (!this.element.nativeElement.contains(event.target)) {
            // or some similar check
            this.reset();
        }
    }

    public reOrderList(selval, index) {
        if (index === 0) {
            this.items.unshift(selval);
        } else {
            this.items.push(selval);
        }
    }

    public getNewList(search_string: string, event = null) {
        this.hideList = true;

        if (search_string.length > 0) {
            this.items = [];
            let matchlocation = 0;
            this.selectList.forEach((selval) => {
                matchlocation = selval['name'].toLowerCase().indexOf(search_string.toLowerCase());
                if (matchlocation !== -1 && !this.getCheckExclude(selval['id'])) {
                    this.reOrderList(selval, matchlocation);
                }
            });
        } else {
            this.getBkupList();
        }

        this.newListFlag = true;
        if (this.items.length > 0 && this.expandNewList) {
            this.hideList = false;
        }

        if (this.showTopDrop) {
            this.selectedOption = this.items.length - 1;
        } else {
            this.selectedOption = 0;
        }
        // This flag must be set true after first load.
        this.expandNewList = true;
    }

    public reset() {
        this.hideList = true;
    }

    public getProcessSelection(mode = 'down') {

        if (mode === 'down') {
            if (this.currentmode === 'up') {
                this.getProcessRemoveStyle('down');
                this.selectedOption += 2;

                if (this.selectedOption > this.items.length - 1) {
                    this.selectedOption = 0;
                }
            } else {
                this.getProcessRemoveStyle('up');
            }

            this.element.nativeElement.querySelector('.option-' + this.selectedOption)
                .classList.add('blue-active-drop');
            this.activeOption = this.selectedOption;
        } else if (mode === 'up') {

            if (this.currentmode === 'down') {
                this.getProcessRemoveStyle('up');
                this.selectedOption -= 2;
                if (this.selectedOption < 0) {
                    this.selectedOption = this.items.length - 1;
                }
            } else {
                this.getProcessRemoveStyle('down');

            }
            this.element.nativeElement.querySelector('.option-' + this.selectedOption)
                .classList.add('blue-active-drop');
            this.activeOption = this.selectedOption;

        }

    }

    public getProcessRemoveStyle(mode = 'down') {

        if (mode === 'up') {
            if (this.element.nativeElement.querySelector('.option-' + (this.selectedOption - 1))) {
                this.element.nativeElement.querySelector('.option-' + (this.selectedOption - 1))
                    .classList.remove('blue-active-drop');
            } else {
                this.element.nativeElement.querySelector('.option-' + (this.items.length - 1))
                    .classList.remove('blue-active-drop');
            }

        } else if (mode === 'down') {

            if (this.element.nativeElement.querySelector('.option-' + (this.selectedOption + 1))) {
                this.element.nativeElement.querySelector('.option-' + (this.selectedOption + 1))
                    .classList.remove('blue-active-drop');
            } else {
                this.element.nativeElement.querySelector('.option-' + (0)).classList
                    .remove('blue-active-drop');
            }
        }
    }

    public getDownBox(e: any, isUpMode: boolean = false) {

        // up
        if (!isUpMode && e.keyCode === 38) {

            this.arrowSelection = true;
            let tp_row = null;
            if (this.currentmode === 'down') {
                tp_row = (this.selectedOption > this.limit1 && this.element.nativeElement
                    .querySelector('.option-' + (this.selectedOption - this.limit2))) ?
                    this.element.nativeElement.querySelector('.option-' +
                        (this.selectedOption - this.limit2)).offsetTop :
                    this.element.nativeElement.querySelector('.option-0').offsetTop;
            } else {
                tp_row = (this.selectedOption > this.limit1 &&
                    this.element.nativeElement
                        .querySelector('.option-' + (this.selectedOption - this.limit1))) ?
                    this.element.nativeElement
                        .querySelector('.option-' + (this.selectedOption - this.limit1)).offsetTop :
                    this.element.nativeElement.querySelector('.option-0').offsetTop;
            }

            this.element.nativeElement.querySelector('.autocomplete_v2').scrollTop = tp_row;

            this.getProcessSelection('up');
            if (this.selectedOption > 0) {
                this.selectedOption--;
            } else {
                this.selectedOption = this.items.length - 1;
            }

            this.currentmode = 'up';

            return;
        }
        // down
        if (!isUpMode && e.keyCode === 40) {

            this.arrowSelection = true;
            let tp_row = null;
            if (this.currentmode === 'up') {
                tp_row = (this.selectedOption > this.limit1 &&
                    this.element.nativeElement
                        .querySelector('.option-' + (this.selectedOption - this.limit4))) ?
                    this.element.nativeElement
                        .querySelector('.option-' + (this.selectedOption - this.limit4)).offsetTop :
                    this.element.nativeElement.querySelector('.option-0').offsetTop;
            } else {
                tp_row = (this.selectedOption > this.limit1 && this.element.nativeElement
                    .querySelector('.option-' + (this.selectedOption - this.limit1))) ?
                    this.element.nativeElement
                        .querySelector('.option-' + (this.selectedOption - this.limit1)).offsetTop :
                    this.element.nativeElement.querySelector('.option-0').offsetTop;
            }

            this.element.nativeElement.querySelector('.autocomplete_v2').scrollTop = tp_row;

            this.getProcessSelection('down');
            if (this.selectedOption < (this.items.length - 1)) {
                this.selectedOption++;
            } else {
                this.selectedOption = 0;
            }
            this.currentmode = 'down';

            return;
        }
        // enter
        if (!isUpMode && e.keyCode === 13) {

            if (this.selectOneEnter) {
                this.getArrowselected(this.items[this.activeOption]['id'],
                    this.items[this.activeOption]['name']);
            }
            return;

        }
    }

    public getArrowselected(id, text, clickselect = false): void {
        this.selectionEmitFlag = true;

        if (this.returnEmptyBox && !this.arrowSelection && !clickselect && this.search_string &&
            this.formAuto.controls['search_string'].value.length === 0) {
            this.formAuto.controls['search_string'].setValue('');
            this.selectedId.emit({id: null, name: ''});

        } else {
            this.typedString = text;
            if (clickselect || !this.arrowSelectionCompulsion ||
                (this.arrowSelectionCompulsion && this.arrowSelection)) {
                this.formAuto.controls['search_string'].setValue(text);
                this.selectedId.emit({id, name: text});
            }
        }

        this.arrowSelection = false;
        this.firstLoadFlag = true;
        this.getCleanup();
        this.madeSelect = true;
    }

    public getCleanup() {
        // Reset the input box on selection
        if (this.resetOnSelect) {
            this.typedString = '';
            this.formAuto.controls['search_string'].setValue('');
        }
        this.dropDownSelect = true;
        this.firstLoadFlag = true;
        this.hideList = true;
        this.activeOption = 0;
        this.items = [];
    }

    public inputEvent(e: any, isUpMode: boolean = false): void {

        if(e.target.value==''){
            this.onEmptyText.emit(true);
        }

        if (this.returnEmptyBox && e.keyCode === 8) {
            if (this.formAuto.controls['search_string'].value.length == 0) {
                this.selectedId.emit({id: null, name: null});
                this.reset();
            }
        }

        if (e.keyCode === 27) {
            this.hideList = true;
        }

        // If no list to scroll return back
        if (this.items.length === 0) {
            return;
        }

        this.getIntialPosition();

        if (!this.showTopDrop) {
            this.getDownBox(e, isUpMode);
        }

        this.sendEvent(e);

    }

    public sendEvent(e) {
        this.returnEvent.emit({event: e});

    }

    public validatePosition(position = null) {
        return (position == null) ? false : true;
    }

    public getIntialPosition() {

        if (!this.newListFlag)
            return;

        if (this.showTopDrop) {
            if (this.validatePosition(this.element.nativeElement
                .querySelector('.autocomplete_v2').scrollTop =
                this.element.nativeElement.querySelector('.option-' + (this.items.length - 1)))) {
                this.element.nativeElement.querySelector('.autocomplete_v2').scrollTop =
                    this.element.nativeElement.querySelector('.option-' + (this.items.length - 1))
                        .offsetTop;
            }
        } else {
            if (this.element.nativeElement.querySelector('.autocomplete_v2').scrollTop ===
                this.element.nativeElement.querySelector('.option-0')) {
                this.element.nativeElement.querySelector('.autocomplete_v2').scrollTop =
                    this.element.nativeElement.querySelector('.option-0').offsetTop;
            }
        }

        this.newListFlag = false;
    }

    public ngOnDestroy() {

        if (this.search_stringSubscription) {
            this.search_stringSubscription.unsubscribe();
        }

        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    public ngOnChanges(_change) {
        this.getLoadedData();
    }

    public getLoadedData() {

        if (this.selectList) {
            this.items = this.selectList.slice();
        }

        for (let key in this.items) {
            if (this.items.hasOwnProperty(key)) {
                if ((this.selectedValue || this.selectedValue === 0) &&
                    this.items[key]['id'] == this.selectedValue) {

                    if (this.stringFeedback || (!this.stringFeedback && this.firstLoadFlag)) {
                        this.formAuto.controls['search_string'].setValue(this.items[key]['name']);
                    }
                    this.typedString = this.items[key]['name'];
                    return;
                }
            }
        }

        if (this.resetOnLoad) {
            this.formAuto.controls['search_string'].setValue('');
            this.typedString = '';
        }
        if (this.resetNow) {
            this.resetNow = false;
            this.firstLoadFlag = true;
            this.formAuto.controls['search_string'].setValue('');
            this.typedString = '';
        }
    }

    public cleanList(list) {
        let item = [];

        list.forEach((val1) => {
            let found = false;
            this.excludeItems.forEach((val) => {
                if (val['id'] === val1.id) {
                    found = true;
                }
            });
            if (!found) {
                item.push(val1);
            }
        });

        return item;
    }

    public getBkupList() {
        if (this.selectList) {
            this.items = this.cleanList(this.selectList.slice());
        }
    }

    public setBkupList() {
        if (this.selectList) {
            this.items = this.cleanList(this.selectList.slice());
        }
    }

    public moveFocus() {
        this.firstLoadFlag = false;
        this.hideList = false;
        this.setBkupList();
    }
}
