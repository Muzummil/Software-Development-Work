import {
    Component,
    EventEmitter,
    Input,
    ElementRef,
    Output,
    OnInit,
    ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
    host: {
        '(document:click)': 'onClick($event)',
    },
    selector: 'ng2-select',
    styleUrls: ['./autoCompleteCustom.scss'],
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
                <span *ngIf="showCaret" class="caret"></span>
            </form>

            <!--dropdown-menu-->
            <ul class="autocomplete_v2" [class.hide]="hideList" [class.dropdown-menu]="showTopDrop">
                <li *ngFor="let selItem of selectList,let selIndex = index"
                    [class.active-auto-v2]="selectList.length == 0"
                    [class.active-auto-v2]="autocomp.value == selItem?.text"
                    class="option-{{selIndex}}"
                    (click)="getArrowselected(selItem?.id,selItem?.text,selItem?.jobs_count)"
                >
                    {{selItem?.text}}
                </li>
            </ul>

        </div>
    `
    , changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutoCompleteCustom implements OnInit {

    @Input() items = [];
    @Input() itemsObs: BehaviorSubject<any>;
    @Input() disabled;
    @Input() active = {};
    @Input() placeholder = 'AutoComplete';
    @Input() resetOnSelect: boolean = false;
    @Input() selectOneEnter: boolean = false;
    @Input() keepSelected: boolean = false;
    @Input() selectOnEnter: boolean = false;
    @Input() mouseLeaveReset: boolean = false;
    @Input() resetOnEmpty: boolean = false;
    @Input() showCaret: boolean = true;
    @Input() customclass = '';

    @Output() data = new EventEmitter();
    @Output() selected = new EventEmitter();
    @Output() removed = new EventEmitter();
    @Output() typed = new EventEmitter();
    @Input() showJobsCount: boolean = false;

    public selvalue = '';
    public searchString = '';
    public selValue = '';
    public formAuto: FormGroup;

    public typedString;
    public limit1 = 5;
    public limit2 = 7;
    public limit4 = 5;
    public selectList = [];
    public newListFlag: boolean = true;
    @Input() selectOnType: boolean = false;
    public dropDownSelect = false;
    public firstLoadFlag: boolean = true;
    public hideList: boolean = true;
    @Input() showTopDrop: boolean = false;
    @Input() error: boolean = false;
    private currentmode = null;
    private selectedOption = 0;
    private activeOption = 0;
    public element: ElementRef;

    constructor(public fb: FormBuilder, element: ElementRef) {

        this.element = element;
        this.formAuto = this.fb.group({search_string: []});

        this.formAuto.controls['search_string'].valueChanges.debounceTime(0).subscribe((val) => {
            if (val && val.length > 0) {

                if (this.selectOnType && !this.dropDownSelect) {
                    // Use this if you want to emit any string as you type
                    // this.selected({id:null,text:val});
                }

                if (!this.firstLoadFlag) {
                    this.getNewList(val);
                }
                this.firstLoadFlag = false;
                this.dropDownSelect = false;
            } else {
                if (this.resetOnEmpty) {
                    this.reset();
                }
            }
        });

    }

    public onClick(event) {
        // or some similar check
        if (!this.element.nativeElement.contains(event.target)) {
            this.reset();
        }
    }

    public getArrowselected(id, text, jobs_count = 0): void {

        this.typedString = text;
        this.formAuto.controls['search_string'].setValue(this.typedString);
        if (text) {
            if (this.showJobsCount) {
                this.selected.emit({id, text, jobs_count});
                this.data.emit({id, text, jobs_count});
            } else {
                this.selected.emit({id, text});
                this.data.emit({id, text});
            }
        }

        this.getCleanup();

    }

    public getCleanup() {
        this.dropDownSelect = true;
        this.firstLoadFlag = true;
        this.hideList = true;
        if (this.resetOnSelect) {
            this.formAuto.controls['search_string'].setValue('');
        }
    }

    public reOrderList(selval, index) {

        if (index == 0) {
            this.selectList.unshift(selval);
        } else {
            this.selectList.push(selval);
        }

    }

    public getNewList(search_string: string, event = null) {

        this.hideList = true;

        if (search_string.length >= 0) {
            this.selectList = [];
            let matchlocation = 0;
            this.items.forEach((selval) => {

                matchlocation = selval['text'].toLowerCase().indexOf(search_string.toLowerCase());
                if (matchlocation !== -1) {
                    this.reOrderList(selval, matchlocation);
                }
            });
        } else {
            this.getBkupList();
        }

        this.newListFlag = true;
        if (this.selectList.length > 0) {

            this.hideList = false;
        }

        if (this.showTopDrop) {
            this.selectedOption = this.selectList.length - 1;

        } else {
            this.selectedOption = 0;
        }

        this.typed.emit(search_string);

    }

    public mouseLeave() {
        if (this.mouseLeaveReset) {
            this.reset();
        }
    }

    public reset() {
        this.getBkupList();
        this.hideList = true;
    }

    public ngOnChanges(_change) {

        if (this.error) {
            return;
        }
        this.selvalue = (this.active[0]) ? this.active[0]['text'] : '';
        for (let key in   this.items) {
            if (this.items.hasOwnProperty(key)) {

                if (this.selvalue && this.items[key]['text'] == this.selvalue && this.firstLoadFlag)
                {
                    this.formAuto.controls['search_string'].setValue(this.items[key]['text']);
                    this.typedString = this.items[key]['text'];
                }
            }
        }
    }

    public ngOnInit(): any {

        this.formAuto.controls['search_string'].setValue(this.typedString);

    }

    public getBkupList() {

        this.items = (this.items) ? this.items : [];
        this.selectList = this.items.slice();
    }

    public moveFocus() {
        this.firstLoadFlag = false;
        this.hideList = false;
        this.getBkupList();

    }

    public inputEvent(e: any, isUpMode: boolean = false): void {

        // If no list to scroll return back
        if (this.selectList.length === 0) {
            if (this.selectOnEnter && e.keyCode === 13) {
                this.getArrowselected(null, this.formAuto.controls['search_string'].value);
            }
            return;
        }

        this.getIntialPosition();

        if (!this.showTopDrop) {
            this.getDownBox(e, isUpMode);
        }

    }

    public getIntialPosition() {

        if (!this.newListFlag) {
            return;
        }

        if (this.showTopDrop) {
            if (this.validateObj(this.element.nativeElement
                .querySelector('.option-' + (this.selectList.length - 1)))) {
                this.element.nativeElement.querySelector('.autocomplete_v2').scrollTop =
                    this.element.nativeElement
                        .querySelector('.option-' + (this.selectList.length - 1)).offsetTop;
            }
        } else {
            if (this.validateObj(this.element.nativeElement.querySelector('.option-0'))) {
                this.element.nativeElement.querySelector('.autocomplete_v2').scrollTop =
                    this.element.nativeElement.querySelector('.option-0').offsetTop;
            }
        }

        this.newListFlag = false;
    }

    public  validateObj(val) {
        return (val == null) ? false : true;
    }

    public getDownBox(e: any, isUpMode: boolean = false) {

        // up
        if (!isUpMode && e.keyCode === 38) {
            let tp_row = null;
            if (this.currentmode == 'down') {
                tp_row = (this.selectedOption > this.limit1 && this.element.nativeElement
                    .querySelector('.option-' + (this.selectedOption - this.limit2))) ?
                    this.element.nativeElement
                        .querySelector('.option-' + (this.selectedOption - this.limit2)).offsetTop
                    : this.element.nativeElement.querySelector('.option-0').offsetTop;

            } else {
                tp_row = (this.selectedOption > this.limit1 && this.element.nativeElement
                    .querySelector('.option-' + (this.selectedOption - this.limit1))) ?
                    this.element.nativeElement
                        .querySelector('.option-' + (this.selectedOption - this.limit1)).offsetTop
                    : this.element.nativeElement.querySelector('.option-0').offsetTop;

            }

            this.element.nativeElement.querySelector('.autocomplete_v2').scrollTop = tp_row;

            this.getProcessSelection('up');
            if (this.selectedOption > 0) {
                this.selectedOption--;
            } else {
                this.selectedOption = this.selectList.length - 1;
            }

            this.currentmode = 'up';

            return;
        }
        // down
        if (!isUpMode && e.keyCode === 40) {
            let tp_row = null;
            if (this.currentmode == 'up') {
                tp_row = (this.selectedOption > this.limit1 &&
                    this.element.nativeElement
                        .querySelector('.option-' + (this.selectedOption - this.limit4))) ?
                    this.element.nativeElement
                        .querySelector('.option-' + (this.selectedOption - this.limit4)).offsetTop
                    : this.element.nativeElement.querySelector('.option-0').offsetTop;
            } else {
                tp_row = (this.selectedOption > this.limit1 &&
                    this.element.nativeElement
                        .querySelector('.option-' + (this.selectedOption - this.limit1))) ?
                    this.element.nativeElement
                        .querySelector('.option-' + (this.selectedOption - this.limit1)).offsetTop
                    : this.element.nativeElement.querySelector('.option-0').offsetTop;
            }

            this.element.nativeElement.querySelector('.autocomplete_v2').scrollTop = tp_row;

            this.getProcessSelection('down');
            if (this.selectedOption < (this.selectList.length - 1)) {
                this.selectedOption++;
            } else {
                this.selectedOption = 0;
            }
            this.currentmode = 'down';

            return;
        }
        // enter
        if (!isUpMode && e.keyCode === 13) {

            if (this.showJobsCount) {
                this.getArrowselected(this.selectList[this.activeOption]['id'],
                    this.selectList[this.activeOption]['text'],
                    this.selectList[this.activeOption]['jobs_count']);
            } else {
                this.getArrowselected(this.selectList[this.activeOption]['id'],
                    this.selectList[this.activeOption]['text']);
            }
            return;
        }
    }

    public getProcessSelection(mode = 'down') {

        if (mode == 'down') {

            if (this.currentmode == 'up') {
                this.getProcessRemoveStyle('down');
                this.selectedOption += 2;

                if (this.selectedOption > this.selectList.length - 1) {
                    this.selectedOption = 0;
                }
            } else {
                this.getProcessRemoveStyle('up');
            }

            this.element.nativeElement
                .querySelector('.option-' + this.selectedOption).classList.add('blue-active-drop');
            this.activeOption = this.selectedOption;
        } else if (mode == 'up') {

            if (this.currentmode == 'down') {
                this.getProcessRemoveStyle('up');
                this.selectedOption -= 2;
                if (this.selectedOption < 0) {
                    this.selectedOption = this.selectList.length - 1;
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

        if (mode == 'up') {

            if (this.element.nativeElement.querySelector('.option-' + (this.selectedOption - 1))) {
                this.element.nativeElement.querySelector('.option-' + (this.selectedOption - 1))
                    .classList.remove('blue-active-drop');
            } else {
                this.element.nativeElement.querySelector('.option-' + (this.selectList.length - 1))
                    .classList.remove('blue-active-drop');
            }

        } else if (mode == 'down') {

            if (this.element.nativeElement.querySelector('.option-' + (this.selectedOption + 1))) {
                this.element.nativeElement.querySelector('.option-' + (this.selectedOption + 1))
                    .classList.remove('blue-active-drop');
            } else {
                this.element.nativeElement.querySelector('.option-' + (0))
                    .classList.remove('blue-active-drop');
            }

        }
    }

}
