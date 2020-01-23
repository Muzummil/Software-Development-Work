import { Component, Input, ElementRef } from '@angular/core';
import { AccountService } from 'app/core/account/services/account.service';
import { ConfigService } from './config.service';

declare var jQuery: any;

@Component({

    selector: 'animate-cicle',
    styleUrls: ['./animateCircle.scss'],
    template: `
        <div class="center" [class.arabic] = "accountService.isArabic()">
            <div class="circle">
                <strong></strong>
                <span>{{textVal}}</span>
            </div>
        </div>
    `,
})

export class AnimateCircleComponent {

    @Input() val;
    @Input() textVal = 50.5;

    constructor(public elementRef: ElementRef, public accountService: AccountService) {
    }

    public ngOnChanges() {
        require('jquery-circle-progress/dist/circle-progress.min.js');
        let c4 = jQuery(this.elementRef.nativeElement);
        c4.circleProgress({
            startAngle: -Math.PI / 6 * 3,
            value: (this.val / 100),
            thickness: 4,
            lineCap: 'round',
            fill: {
                gradient: [ConfigService.SPINNER_COLOR_ONE, ConfigService.SPINNER_COLOR_TWO]
            }
        }).on('circle-animation-progress', function (event, progress, stepValue) {
            jQuery(this).find('strong').html((100 * stepValue).toFixed(1) + '<i>%</i>');
        });
    }

}
