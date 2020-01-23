import {Component, OnInit, EventEmitter, Output, Input, ElementRef, Inject, ChangeDetectionStrategy} from '@angular/core';



@Component({

    selector: "timeduration-block",
    templateUrl:"timeDuration.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class TimeDurationComponent implements OnInit {
    elementRef:ElementRef;

    @Input() visible = true;
    @Input() placeholder = "Select Time Duration";
    @Input() totalDurationHours = 8;
    @Input() minuteInterval = 30;
    @Input() showSearch = true;
    @Input() currLan = 'en';

    public searchString = "";
    public selectedName = null;
    public inputFocused = false;
    public pristine:boolean = true;

    @Output() selectedDuration = new EventEmitter();

    public durationList = [];

    ngOnInit() {
        for(var j=30;j<=this.totalDurationHours*60;j = j + this.minuteInterval){
          this.durationList.push({
            id: j,
            name: j + ' ' + (this.currLan == 'en' ? 'Minutes' : 'دقائق')
          });
        }
    }

    moveFocus() {
      this.inputFocused = true;
      setTimeout(() => {this.inputFocused = false});
    }

    onAutofilter(value) {
      this.searchString = value;
    }

    public selected(id:any,name:any) {
      this.pristine = false;

      this.searchString = "";
      this.selectedName = name;
      this.selectedDuration.emit({id:id,name:name});
    }

      constructor(@Inject(ElementRef) elementRef:ElementRef) {
          this.elementRef = elementRef;
      }

}
