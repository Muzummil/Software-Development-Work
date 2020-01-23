import {Component, Input, EventEmitter, Output, OnInit, AfterViewInit, ChangeDetectionStrategy, ViewChild} from '@angular/core';
import {Renderer} from '@angular/core';

var moment = require('moment-timezone');

declare var moment:any;
@Component({

    selector: "timezone",
    templateUrl: "timeZone.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class TimeZoneComponent implements OnInit, AfterViewInit {

    @ViewChild('typedvalue') typedvalue: any;
    public timeZoneList = moment.tz ? moment.tz.names() : [];

    @Input() visible = true;
    @Input() selectList = [];
    @Input() placeholder = "";
    @Input() selectedValue = null;
    @Input() showSearch = true;
    @Input() autoSelectTimeZone:boolean = false;

    @Output() selectedId = new EventEmitter();

    public selectedName = null;
    public searchString = "";
    public inputFocused = false;
    public pristine:boolean = true;
    public localTimeZone;

    constructor(public renderer: Renderer) {
      this.localTimeZone = moment.tz.guess();
    }

    onAutofilter(value) {

        this.searchString = value;
    }

    ngOnInit() {
        this.timeZoneList.forEach(res => {
            this.selectList.push({
                id: res,
                // name: "(GMT " + moment.tz(res).format('Z') + ") " +res
                name: res
            });

          if(this.autoSelectTimeZone && res == this.localTimeZone){
            this.selected( this.selectList[this.selectList.length -1].id, this.selectList[this.selectList.length -1].name)
          }
        })


    }

    ngAfterViewInit(){

    }

    moveFocus() {
        this.inputFocused = true;
        // we need this because nothing will
        // happens on next method call,
        // ngOnChanges in directive is only called if value is changed,
        // so we have to reset this value in async way,
        // this is ugly but works
        setTimeout(() => {this.inputFocused = false});
    }


    public selected(id:any,name:any) {
        this.pristine = false;

        this.searchString = "";
        this.selectedName = name;
        this.selectedId.emit({id:id,name:name});
        if(this.typedvalue){
          this.typedvalue.nativeElement.value = "";
        }
    }

}
