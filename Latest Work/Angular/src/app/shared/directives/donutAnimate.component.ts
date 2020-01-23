import {
    Component,
    OnInit,
    EventEmitter,
    Output,
    OnDestroy,
    Input,
    ElementRef
} from '@angular/core';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { ConfigService } from '../config.service';

declare var jQuery: any;

@Component({

    selector: "donut-animate",
    styleUrls:['./donutAnimate.scss'],
    template: `
        <div class="circle">
            <strong></strong>
            <span>{{title}}</span>
        </div>`,
})


export class DonutAnimateComponent implements OnInit, OnDestroy {

    @Input() val = 1;
    @Input() title = 'Matching Percentage';


    showAnimation(val = 1) {

        var circle_progress = require('jquery-circle-progress/dist/circle-progress.min.js');
        var c4 = jQuery(this.elementRef.nativeElement);
        c4.circleProgress({
            startAngle: -Math.PI / 6 * 3,
            value: val,
            thickness: 5,
            lineCap: 'round',
            fill: {
                gradient: [ConfigService.SPINNER_COLOR_ONE, ConfigService.SPINNER_COLOR_TWO]
            }
        }).on('circle-animation-progress', function (event, progress, stepValue) {
            jQuery(this).find('strong').html(parseFloat((100 * stepValue).toFixed(1)) + '<i>%</i>');
        });


    }

    ngAfterViewInit() {

        this.showAnimation(this.val / 100);
    }

    constructor(public elementRef: ElementRef) {

    }


    ngOnInit() {


    }

    ngOnDestroy() {
    }


}
