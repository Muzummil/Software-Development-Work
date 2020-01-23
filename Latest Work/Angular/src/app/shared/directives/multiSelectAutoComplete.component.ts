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
import { JobService } from 'app/core/services/job.service';

@Component({
    host: {
        '(document:click)': 'onClick($event)',
    },
    selector: 'multi-select-auto-complete',
    templateUrl: 'multiSelectAutoComplete.component.html',
    styleUrls: ['./multiSelectAutoComplete.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush

})

export class MultiSelectAutoCompleteComponent implements OnInit {

    @Input() error: boolean = false;
    @Input() placeholder: string = null;
    @Input() clearBox: string = null;
    @Input() excludeItems: Array<any> = [];
    @Input() showCaret = true;
    @Input() jobId: any;
    @Input() exceptData: any;
    @Input() key: any;

    @Output() changeRecords = new EventEmitter();


    public showSpinner: boolean = false;
    public hideList: boolean = true;
    public firstLoadFlag: boolean = true;
    public currentmode = null;
    public dropDownSelect = false;
    public selectedOption = 0;
    public activeOption = 0;
    public dropDownStart = false;

    public items: any;
    public items$: BehaviorSubject<any> = new BehaviorSubject(null);
    public selectedItems = [];
    public selectedItems$: BehaviorSubject<any> = new BehaviorSubject(null);
    public formAuto: FormGroup;
    public element: ElementRef;
    public newListFlag: boolean = true;
    public totalElements = 6;

    // subscription
    private searchSubscription: Subscription;
    private methodSubscription: Subscription;

    constructor(private loaderService: LoaderService, public fb: FormBuilder, element: ElementRef, public jobService: JobService) {

        this.element = element;
        this.formAuto = this.fb.group({ search_string: [''] });

        this.searchSubscription = this.formAuto.controls['search_string'].valueChanges.debounceTime(100).subscribe(val => {
            if (val && val.length > 0) {
                this.dropDownStart = false;
                if (!this.firstLoadFlag) {
                    this.getSearchList(val);
                }
                this.firstLoadFlag = false;
                this.dropDownSelect = false;
            }
            else{
                this.hideList = true;
                this.items$.next([]);
                this.getClearValue();
                if (this.methodSubscription) {
                    this.methodSubscription.unsubscribe();
                }
                this.showSpinner = false;
            }
        });

    }


    ngOnInit(): any {
        this.formAuto.controls['search_string'].setValue("");
        if (this.exceptData && this.exceptData.length > 0) {
            this.exceptData.forEach(element => {
                this.selectedItems.push({ id: element, name: element, jobs_count: 0 });
            });
            this.selectedItems$.next(this.selectedItems);
        }
    }

    onClick(event) {
        if (!this.element.nativeElement.contains(event.target)) // or some similar check
            this.reset();
    }

    public getClearValue() {
        this.formAuto.controls['search_string'].setValue("");
    }

    public ngOnChanges(_change) {
        this.formAuto.controls['search_string'].setValue(this.clearBox);
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
        if (this.items == undefined || this.items == null || this.items.length == 0)
            return;
        this.getIntialPosition();
        this.getDownBox(e, isUpMode);
    }

    getResetSector() {
        this.selectedOption = 0;
    }

    getArrowselected(id, text, jobs_count = 0): void {
        this.dropDownSelect = true;
        this.firstLoadFlag = true;
        this.clearBox = text;
        this.formAuto.controls['search_string'].setValue(this.clearBox);

        this.selectedItems.push({ id: id, name: text, jobs_count: jobs_count });
        this.selectedItems$.next(this.selectedItems);

        this.changeRecords.emit({ key: "school_in", name: text, type: "add" });
        this.hideList = true;
        this.items = [];
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

    public reset() {
        this.hideList = true;
        this.items$.next([]);
        this.getClearValue();
    }

    public selected(_value: any): void {
        this.hideList = true;
        this.exceptData.push(_value.text);
        this.selectedItems.push({ id: _value.text, name: _value.text, jobs_count: 0 });
        this.selectedItems$.next(this.selectedItems);
        this.formAuto.controls['search_string'].setValue("");
        this.changeRecords.emit({ key: this.key, name: _value.text, type: "add" });
    }

    public removed(value: any): void {
        this.exceptData.splice(this.exceptData.indexOf(value), 1);
        if (this.selectedItems.length > 0) {
            this.selectedItems.forEach(element => {
                if (element.id == value) {
                    this.selectedItems.splice(this.selectedItems.indexOf(element), 1);
                }
            });
        }
        this.selectedItems$.next(this.selectedItems);
        this.changeRecords.emit({ key: this.key, name: value, type: "removed" });
    }


    public activateSearch() {
        this.firstLoadFlag = false;
        this.dropDownStart = false;

    }

    public getSearchList(search_string: string, event = null) {
        this.showSpinner = true;
        this.hideList = true;
        if (search_string.length > 0) {
            if (this.methodSubscription) {
                this.methodSubscription.unsubscribe();
            }
            if (this.key == 'school_in') {
                this.methodSubscription = this.jobService.getUniversitiesByName(search_string, this.jobId, this.exceptData).subscribe((res) => {
                    if (res != null && res['jobs'] != null) {
                        this.getProcessItem(res['jobs']);
                    }
                    else {
                        if (this.methodSubscription) {
                            this.methodSubscription.unsubscribe();
                        }
                        this.showSpinner = false;
                    }
                });
            }
            else if (this.key == 'field_of_study_in') {
                this.methodSubscription = this.jobService.getDegreeCourseByName(search_string, this.jobId, this.exceptData).subscribe((res) => {
                    if (res != null && res['jobs'] != null) {
                        this.getProcessItem(res['jobs']);
                    }
                    else {
                        if (this.methodSubscription) {
                            this.methodSubscription.unsubscribe();
                        }
                        this.showSpinner = false;
                    }
                });
            }
            else {
                if (this.methodSubscription) {
                    this.methodSubscription.unsubscribe();
                }
                this.showSpinner = false;
            }
        }
        else {
            this.hideList = true;
            this.items$.next([]);
            this.getClearValue();
            if (this.methodSubscription) {
                this.methodSubscription.unsubscribe();
            }
            this.showSpinner = false;
        }

    }

    private getProcessItem(recordList) {
        this.items = [];
        recordList.forEach(res => {
            if (res.length > 1) {
                this.items.push({ id: res[0], text: res[0], jobs_count: res[1] });
            }
            else {
                this.items.push({ id: res[0], text: res[0], jobs_count: 0 });
            }
        });

        this.newListFlag = true;
        if (this.items.length > 0) {
            this.hideList = false;
        }

        this.selectedOption = 0;

        this.showSpinner = false;
        this.items$.next(this.items);
    }


    public getIntialPosition() {
        if (!this.newListFlag)
            return;
        if (this.validateObj(this.element.nativeElement.querySelector('.option-0')))
            this.element.nativeElement.querySelector('.autocomplete_v2').scrollTop = this.element.nativeElement.querySelector('.option-0').offsetTop;

        this.newListFlag = false;
    }


    private validateObj(val) {
        return (val == null) ? false : true;
    }

    ngOnDestroy() {
        if (this.searchSubscription)
            this.searchSubscription.unsubscribe();
        if (this.methodSubscription)
            this.methodSubscription.unsubscribe();
    }

}
