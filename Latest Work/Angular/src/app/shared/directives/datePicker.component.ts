import {
    Component,
    EventEmitter,
    Output,
    Input,
    ElementRef, OnChanges, AfterViewInit, ChangeDetectorRef, AfterViewChecked
} from '@angular/core';
import { AccountService } from '../../core/account/services/account.service';

import * as Pikaday from 'pikaday';
import * as moment from 'moment';

@Component({

    selector: 'datePicker-block',
    styleUrls: ['./datePicker.scss'],
    template: `<input type="text"
                      autocomplete="off"
                      class="{{customclass}}"
                      [class.error-feild]="error"
                      [id]="'datepicker_cert_'+sel_id"
                      [attr.placeholder]="dp_placeholder"
                      [(ngModel)]="final_format" value="{{final_format}}" #seldate
                      (change)="emitDate(seldate)"
                      (keyup)="onClear($event)">`,
})

export class DatePickerComponent implements OnChanges, AfterViewInit, AfterViewChecked {

    @Input() dp_placeholder;
    @Input() dp_value = '';
    @Input() dp_startDate;
    @Input() sel_id = '';
    @Input() fromYear = 1946;
    @Input() toYear = 2025;
    @Input() numberOfMonths = 1;
    @Input() maxDate = null;
    @Input() minDate = null;
    @Input() setDefaultDate = '';
    @Input() dateRangeFlag: boolean = false;
    @Input() customclass = '';

    @Input() error: boolean = false;
    @Output() emitSelDate = new EventEmitter();
    @Output() onEmptyText = new EventEmitter();

    public startPicker;
    public datePickerLoaded: boolean = false;
    public final_format: string = '';
    public currLan = 'en';
    public firstLoad = false;

    constructor(public elementRef: ElementRef,
        private cdRef: ChangeDetectorRef,
        public accountService: AccountService) {
        this.currLan = this.accountService.getCurrLang();
    }

    public emitDate(data) {
       
        this.emitSelDate.emit({ selDate: data.value });
    }
    onClear(event){
        if(event.target.value==''){
            this.onEmptyText.emit(true);
            return;
        }
    }

    public ngOnChanges(_changes) {
        if (this.datePickerLoaded === true) {
            this.dp_startDate = moment(new Date(this.dp_startDate)).add(0, 'days')['_d'];
            this.startPicker.setMinDate(this.dp_startDate);
            this.startPicker.setStartRange(this.dp_startDate);
            this.startPicker.setStartRange(this.dp_startDate);
        }
        if (this.dp_value) {
            this.dp_value = moment(Date.parse(this.dp_value)).format('D MMM, YYYY');
            if (this.firstLoad) {
                this.final_format = this.accountService.getFormattedDate(this.dp_value,
                    'MMM DD, YYYY');
            } else {
                this.final_format = this.dp_value;
            }

            this.firstLoad = true;
        } else {
            this.final_format = '';
            this.firstLoad = true;
        }
    }

    public ngAfterViewChecked() {
        this.cdRef.detectChanges();
    }

    public ngAfterViewInit() {
        if (this.dp_value == null) {
            this.dp_value = '';
        } else if (this.dp_value !== '') {
            this.dp_value = moment(Date.parse(this.dp_value)).format('MMM DD, YYYY');
            this.final_format = this.accountService.getFormattedDate(this.dp_value,
                'MMM DD, YYYY');
        }
        this.dp_startDate = moment().add(0, 'days')['_d'];

        let pickADayHash = {
            numberOfMonths: this.numberOfMonths,
            theme: 'triangle-theme',
            field: this.elementRef.nativeElement.querySelector('input'),
            defaultDate: this.setDefaultDate,
            format: 'DD MMM, YYYY',
            yearRange: [this.fromYear, this.toYear]
        };
        if (this.currLan === 'ar') {
            Object.assign(pickADayHash, {
                isRTL: true,
                i18n: {
                    previousMonth: 'عرض الشهر السابق',
                    nextMonth: 'عرض الشهر القادم',
                    months: ['يناير', 'فبراير', 'مارس', 'إبريل', 'مايو',
                        'يونية', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
                    weekdays: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء',
                        'الخميس', 'الجمعة', 'السبت'],
                    weekdaysShort: ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت']
                }
            });
        }

        if (this.dateRangeFlag === false) {
            this.startPicker = new Pikaday(pickADayHash);

            if (this.maxDate) {
                this.startPicker.setMaxDate(this.maxDate);
            }

            if (this.minDate) {
                this.startPicker.setMinDate(this.minDate);
            }

        } else {
            this.startPicker = new Pikaday(pickADayHash);
            this.startPicker.setMinDate(this.dp_startDate);
            this.startPicker.setStartRange(this.dp_startDate);
            this.datePickerLoaded = true;
            if (this.maxDate) {
                this.startPicker.setMaxDate(this.maxDate);
            }

        }
    }

}
