import {
    Component,
    EventEmitter,
    Input,
    Output,
    OnInit,
    ElementRef,
    ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { LoaderService } from '../../shared/services/loader.service';

import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Subscription } from "rxjs/Subscription";

@Component({
    host: {
        '(document:click)': 'onClick($event)',
    },
    selector: 'auto-complete',
    templateUrl: 'autoComplete.component.html',
    styleUrls: ['./autoComplete.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush

})

export class AutoCompleteComponent implements OnInit {

    @Input() recordType: string;
    @Input() error: boolean = false;
    @Input() placeholder: string = null;
    @Input() clearBox: string = null;
    @Input() clearFlag: boolean = false;
    @Input() showTopDrop: boolean = false;
    @Input() returnEmpty: boolean = false;
    @Input() paramsType: string = "";
    @Input() mouseLeaveReset: boolean = false;
    @Input() resetOnSelect: boolean = false;
    @Input() selectOneEnter: boolean = false;
    @Input() selectOnType: boolean = false;
    @Input() fullWidth: boolean = false;
    @Input() keepSelected: boolean = false;
    @Input() items: Array<any> = [];
    @Output() changeRecords = new EventEmitter();
    @Output() clearRecords = new EventEmitter();
    @Input() initData: Array<any> = [];
    @Input() excludeItems: Array<any> = [];
    @Input() initLoad: boolean = false;
    @Input() showCaret = true;
    @Input() id: any;

    public value: any = {};
    public exceptionList = ['Sector'];
    public showSpinner: boolean = false;
    public disabled: boolean = false;
    public hideList: boolean = true;
    public firstLoadFlag: boolean = true;
    public currentmode = null;
    public dropDownSelect = false;
    public selectedOption = 0;
    public activeOption = 0;
    public dropDownStart = false;

    public items$: BehaviorSubject<any> = new BehaviorSubject(null);
    public formAuto: FormGroup;
    public element: ElementRef;
    public newListFlag: boolean = true;
    public totalElements = 6;

    // subscription
    private searchSubscription: Subscription;
    private methodSubscription: Subscription;

    ngOnInit(): any {

        if (this.initData[0]) {
            this.clearBox = this.initData[0]["text"];
        }
        this.formAuto.controls['search_string'].setValue(this.clearBox);
    }

    ngOnDestroy() {

        if (this.searchSubscription)
            this.searchSubscription.unsubscribe();
        if (this.methodSubscription)
            this.methodSubscription.unsubscribe();
    }

    onClick(event) {
        if (!this.element.nativeElement.contains(event.target)) // or some similar check
            this.reset();
    }

    public getClearValue() {

        if (this.clearFlag || this.resetOnSelect) {
            this.clearBox = "";
            this.formAuto.controls['search_string'].setValue(this.clearBox);
        }
    }

    public ngAfterViewInit() {
    }

    public ngOnChanges(_change) {
        if (_change.id != undefined) {
            if (_change.id["currentValue"] != undefined) {
                this.formAuto.controls['search_string'].setValue("");
            }
        }
        if (this.clearFlag) {
            this.clearBox = '';
            this.formAuto.controls['search_string'].setValue(this.clearBox);

        }
    }

    public geTopBox(e: any, isUpMode: boolean = false) {

        // up
        if (!isUpMode && e.keyCode === 38) {
            let tp_row = null;
            if (this.currentmode == 'down') {

                if (this.selectedOption != 0 && this.selectedOption != 1
                    && this.element.nativeElement
                        .querySelector('.option-' + (this.selectedOption - 2))) {
                    tp_row = this.element.nativeElement
                        .querySelector('.option-' + (this.selectedOption - 2)).offsetTop;
                } else {
                    tp_row = this.element.nativeElement
                        .querySelector('.option-' + (this.items.length - 1)).offsetTop;
                }

            } else {

                if (this.selectedOption < (this.items.length - this.totalElements)
                    && this.element.nativeElement.querySelector('.option-' + this.selectedOption)
                ) {
                    tp_row = this.element.nativeElement
                        .querySelector('.option-' + this.selectedOption).offsetTop;
                } else {
                    tp_row = this.element.nativeElement
                        .querySelector('.option-' + (this.items.length - 1)).offsetTop;
                }
            }

            this.element.nativeElement.querySelector('.autocomplete_v2').scrollTop = tp_row;


            this.getProcessSelection('up');
            if (this.selectedOption > 0) {
                this.selectedOption--;
            } else {
                this.selectedOption = this.items.length - 1;
            }
            this.dropDownStart = true;

            this.currentmode = 'up';

            return;
        }
        // down
        if (!isUpMode && e.keyCode === 40) {
            let tp_row = null;
            if (this.currentmode == 'up') {

                if (this.selectedOption != (this.items.length - 1)
                    && this.element.nativeElement
                        .querySelector('.option-' + (this.selectedOption))) {
                    tp_row = this.element.nativeElement
                        .querySelector('.option-' + (this.selectedOption)).offsetTop;
                } else {
                    tp_row = this.element.nativeElement
                        .querySelector('.option-0').offsetTop;
                }

            } else {
                if (this.element.nativeElement.querySelector('.option-' + (this.selectedOption))) {
                    tp_row = this.element.nativeElement
                        .querySelector('.option-' + (this.selectedOption)).offsetTop;
                } else {
                    tp_row = this.element.nativeElement.querySelector('.option-0').offsetTop;
                }
            }

            this.element.nativeElement.querySelector('.autocomplete_v2').scrollTop = tp_row;
            this.getProcessSelection('down');
            if (this.selectedOption < (this.items.length - 1)) {
                this.selectedOption++;
            } else {
                this.selectedOption = 0;
            }
            this.currentmode = 'down';
            this.dropDownStart = true;
            return;
        }
        // enter
        if (!isUpMode && e.keyCode === 13) {

            this.getArrowselected(this.items[this.activeOption]['id'],
                this.items[this.activeOption]['text']);
            return;
        }
    }

    public getDownBox(e: any, isUpMode: boolean = false) {

        // up
        if (!isUpMode && e.keyCode === 38) {
            let tp_row = null;
            if (this.currentmode == 'down') {
                tp_row = (this.selectedOption > 7 && this.element.nativeElement.querySelector('.option-' + (this.selectedOption - 9))) ? this.element.nativeElement.querySelector('.option-' + (this.selectedOption - 9)).offsetTop : this.element.nativeElement.querySelector('.option-0').offsetTop;

            } else {
                tp_row = (this.selectedOption > 7 && this.element.nativeElement.querySelector('.option-' + (this.selectedOption - 7))) ? this.element.nativeElement.querySelector('.option-' + (this.selectedOption - 7)).offsetTop : this.element.nativeElement.querySelector('.option-0').offsetTop;

            }

            this.element.nativeElement.querySelector('.autocomplete_v2').scrollTop = tp_row;

            this.getProcessSelection('up');
            if (this.selectedOption > 0) {
                this.selectedOption--;
            } else {
                this.selectedOption = this.items.length - 1;
            }
            this.dropDownStart = true;

            this.currentmode = 'up';

            return;
        }
        // down
        if (!isUpMode && e.keyCode === 40) {
            let tp_row = null;
            if (this.currentmode == 'up') {
                tp_row = (this.selectedOption > 7 && this.element.nativeElement.querySelector('.option-' + (this.selectedOption - 5))) ? this.element.nativeElement.querySelector('.option-' + (this.selectedOption - 5)).offsetTop : this.element.nativeElement.querySelector('.option-0').offsetTop;
            } else {
                tp_row = (this.selectedOption > 7 && this.element.nativeElement.querySelector('.option-' + (this.selectedOption - 7))) ? this.element.nativeElement.querySelector('.option-' + (this.selectedOption - 7)).offsetTop : this.element.nativeElement.querySelector('.option-0').offsetTop;
            }

            this.element.nativeElement.querySelector('.autocomplete_v2').scrollTop = tp_row;

            this.getProcessSelection('down');
            if (this.selectedOption < (this.items.length - 1)) {
                this.selectedOption++;
            } else {
                this.selectedOption = 0;
            }
            this.currentmode = 'down';
            this.dropDownStart = true;

            return;
        }


        // enter
        if (!isUpMode && e.keyCode === 13) {
            this.getArrowselected(this.items[this.activeOption]['id'], this.items[this.activeOption]['text'], this.items[this.activeOption]['jobs_count']);
            return;
        }
    }

    public inputEvent(e: any, isUpMode: boolean = false): void {
        // enter
        if (!this.dropDownStart && this.selectOneEnter && e.keyCode === 13 && this.formAuto.controls['search_string'].value != "") {

            this.getArrowselected(null, this.formAuto.controls['search_string'].value);
            return;
        }

        // If no list to scroll return back
        if (this.items.length == 0)
            return;

        this.getIntialPosition();

        if (!this.showTopDrop)
            this.getDownBox(e, isUpMode);
        else
            this.geTopBox(e, isUpMode);

    }

    getResetSector() {
        this.selectedOption = 0;
    }

    getArrowselected(id, text, jobs_count = 0): void {

        this.dropDownSelect = true;
        this.firstLoadFlag = true;
        this.clearBox = text;
        this.formAuto.controls['search_string'].setValue(this.clearBox);
        this.changeRecords.emit({ id: id, name: text, jobs_count: jobs_count });
        this.hideList = true;
        this.value = {};
        this.items = [];
        this.initData = [];
        this.items$.next([]);
        this.getResetSector();
        this.getClearValue();
    }


    getProcessSelection(mode = 'down') {

        if (mode == 'down') {


            if (this.currentmode == 'up') {
                this.getProcessRemoveStyle('down');
                this.selectedOption += 2;

                if (this.selectedOption > this.items.length - 1) {
                    this.selectedOption = 0;
                }
            } else {
                this.getProcessRemoveStyle('up');
            }

            this.element.nativeElement.querySelector('.option-' + this.selectedOption).classList.add('blue-active-drop');
            this.activeOption = this.selectedOption;
        } else if (mode == 'up') {

            if (this.currentmode == 'down') {
                this.getProcessRemoveStyle('up');
                this.selectedOption -= 2;
                if (this.selectedOption < 0) {
                    this.selectedOption = this.items.length - 1;
                }
            } else {
                this.getProcessRemoveStyle('down');

            }
            this.element.nativeElement.querySelector('.option-' + this.selectedOption).classList.add('blue-active-drop');
            this.activeOption = this.selectedOption;

        }

    }


    getProcessRemoveStyle(mode = 'down') {

        if (mode == 'up') {

            if (this.element.nativeElement.querySelector('.option-' + (this.selectedOption - 1))) {
                this.element.nativeElement.querySelector('.option-' + (this.selectedOption - 1)).classList.remove('blue-active-drop');
            } else {
                this.element.nativeElement.querySelector('.option-' + (this.items.length - 1)).classList.remove('blue-active-drop');
            }

        } else if (mode == 'down') {

            if (this.element.nativeElement.querySelector('.option-' + (this.selectedOption + 1))) {
                this.element.nativeElement.querySelector('.option-' + (this.selectedOption + 1)).classList.remove('blue-active-drop');
            } else {
                this.element.nativeElement.querySelector('.option-' + (0)).classList.remove('blue-active-drop');
            }

        }
    }

    public selected(_value: any): void {


        if (_value.id == null) {
            this.items = [];
            if (_value.text && _value.text != '') {
                this.getArrowselected(null, _value.text);
            }

        } else {
            this.items = [];
            if (_value.text && _value.text != '')
                this.getArrowselected(_value.id, _value.text);
        }

        this.hideList = true;
        this.value = {};
        this.items = [];
        this.initData = [];
        this.items$.next([]);
        this.getClearValue();


    }

    public mouseLeave() {
        if (this.mouseLeaveReset) {
            this.reset();
        }
    }

    public reset() {
        this.hideList = true;
        this.value = {};
        this.items = [];
        this.initData = [];
        this.items$.next([]);
        this.getClearValue();
    }


    public removed(value: any): void {

    }

    public typed(value: any): void {
        this.getNewList(value);
    }

    public refreshValue(_value: any): void {
        this.value = _value;
    }


    constructor(private loaderService: LoaderService, public fb: FormBuilder, element: ElementRef) {

        this.element = element;
        this.formAuto = this.fb.group({ search_string: [''] });

        this.searchSubscription = this.formAuto.controls['search_string'].valueChanges.debounceTime(100).subscribe(val => {
            if (val && val.length > 0) {

                this.dropDownStart = false;
                if (this.selectOnType && !this.dropDownSelect) {
                    this.changeRecords.emit({ id: null, name: val });
                }

                if (!this.firstLoadFlag) {


                    this.getNewList(val);
                }
                this.firstLoadFlag = false;
                this.dropDownSelect = false;
            } else if (this.returnEmpty == true) {
                this.clearRecords.emit({ id: null, name: '' });
            }
        });

    }


    public activateSearch() {
        this.firstLoadFlag = false;
        this.dropDownStart = false;

    }

    public getNewList(search_string: string, event = null) {
        this.showSpinner = true;
        this.hideList = true;
        // this.showList = true;
        let method_name = "get" + this.recordType + "Search";
        if (this.methodSubscription)
            this.methodSubscription.unsubscribe();

        if (this.exceptionList.indexOf(this.recordType) != -1)
            this.getProcessItem(this.loaderService[method_name](search_string, this.paramsType));
        else {
            if (this.id != undefined && this.id != 'undefined' && this.id > 0) {
                method_name = "get" + this.recordType + "ByCountry";
                this.methodSubscription = this.loaderService[method_name](search_string, this.id).subscribe(recordList => {
                    this.getProcessItem(recordList);
                });
            }
            else {
                this.methodSubscription = this.loaderService[method_name](search_string, this.paramsType).subscribe(recordList => {
                    this.getProcessItem(recordList);
                });
            }
        }
    }

    private getProcessItem(recordList) {
        this.items = [];


        this.showSpinner = false;
        recordList.forEach(res => {
            let foundFlag = false;
            this.excludeItems.forEach(xItem => {
                if (xItem.id == res.id) {
                    foundFlag = true;
                }
            });

            if (!foundFlag)
                this.items.push({ id: res.id, text: res.name, jobs_count: res['jobs_count'] });
        });

        this.newListFlag = true;
        if (this.items.length > 0) {
            this.hideList = false;
        }

        if (this.showTopDrop) {
            this.selectedOption = this.items.length - 1;

        } else {
            this.selectedOption = 0;
        }
        this.items$.next(this.items);
    }


    public getIntialPosition() {

        if (!this.newListFlag)
            return;

        if (this.showTopDrop) {
            if (this.validateObj(this.element.nativeElement.querySelector('.option-' + (this.items.length - 1))))
                this.element.nativeElement.querySelector('.autocomplete_v2').scrollTop = this.element.nativeElement.querySelector('.option-' + (this.items.length - 1)).offsetTop;
        } else {
            if (this.validateObj(this.element.nativeElement.querySelector('.option-0')))
                this.element.nativeElement.querySelector('.autocomplete_v2').scrollTop = this.element.nativeElement.querySelector('.option-0').offsetTop;
        }

        this.newListFlag = false;
    }


    private validateObj(val) {

        return (val == null) ? false : true;
    }

}
