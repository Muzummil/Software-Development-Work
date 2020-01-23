import {Component, Input} from '@angular/core';

@Component({
    selector: 'spinner',
    styleUrls: ['./spinnerComponent.scss'],
    template: ` 
         <div *ngIf="visible" class="loading"> 
        <img src="/assets/images/balls.svg"  >
        </div>
    `
})
export class SpinnerComponent {
    @Input() visible = true;
}