import { Component, Input } from '@angular/core';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';

@Component({
    selector: 'page-transition',
    template: `
        <div class="slim-loading-bar" *ngIf="slimLoadingBarService?.progress">
            <div class="slim-loading-bar-progress"
                 [style.width]="slimLoadingBarService?.progress + '%'"
                 [style.backgroundColor]="color" [style.color]="color"
                 [style.height]="height" [style.opacity]="show ? '1' : '0'"></div>
        </div>
    `
})
export class PageTransitionComponent {

    @Input() progress: number = 0;
    @Input() height: string = '2px';
    @Input() show: boolean = true;

    constructor(public slimLoadingBarService: SlimLoadingBarService) {

    }


}
