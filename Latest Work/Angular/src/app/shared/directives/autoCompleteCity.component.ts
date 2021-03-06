import {Component,EventEmitter,Input,Output} from '@angular/core';

import {LoaderService} from '../../shared/services/loader.service';

//models
import {BehaviorSubject} from "rxjs/BehaviorSubject"


@Component({
    selector: 'auto-comp-city',
    styleUrls: ['./autoCompleteCity.scss'],
    template: `

<div *ngIf="showSpinner" class="autocomplete_spinner">
    <span><img src="/assets/images/balls.svg"></span>
</div>
<div [class.input-tag-common-width]="!fullWidth">
 <ng2-select *ngIf="placeholder == null"
         [items]="items"
         [showJobsCount]="showJobsCount"    
         [itemsObs]="items$"    
         [active]="initData"
         [resetOnSelect]="resetOnSelect"
         [selectOneEnter]="selectOneEnter"
         (data)="refreshValue($event)"
         (selected)="selected($event)"
         (removed)="removed($event)"
         (typed)="typed($event)"
         (keyup.enter)="selected($event)"
         placeholder="Add {{recordType}}">

 </ng2-select>
 <ng2-select *ngIf="placeholder != null"
         [items]="items"
         [showJobsCount]="showJobsCount"
         [itemsObs]="items$"    
         [active]="initData"
         [resetOnSelect]="resetOnSelect"
         [selectOneEnter]="selectOneEnter"
         (data)="refreshValue($event)"
         (selected)="selected($event)"
         (removed)="removed($event)"
         (typed)="typed($event)"
         (keyup.enter)="selected($event)"
         placeholder="{{placeholder}}">

 </ng2-select>
</div>

`
})




export class AutoCompleteCityComponent {

    @Input() recordType:string;
    @Input() placeholder:string = null;
    @Input() paramsType:string = "";
    @Input() resetOnSelect:boolean = false;
    @Input() selectOneEnter:boolean = false;
    @Input() fullWidth:boolean = false;
    @Input() items:Array<any> = [];
    @Output() changeRecords = new EventEmitter();
    @Input() initData:Array<any>  = [];
    @Input() excludeItems:Array<any> =[];
    @Input() countryList = [];
    @Input() sortOrder = "jobs";
    @Input() showJobsCount:boolean =false;

    public value:any = {};
    public showSpinner:boolean = false;
    public _disabledV:string = '0';
    public disabled:boolean = false;

    public items$:BehaviorSubject<any> = new BehaviorSubject(null);


    public get disabledV():string {
        return this._disabledV;
    }

    public set disabledV(value:string) {
        this._disabledV = value;
        this.disabled = this._disabledV === '1';
    }

    public selected(_value:any):void {

        if(_value.id && _value.text) {
            this.items = [];
            if(this.showJobsCount){
                this.changeRecords.emit({id:_value.id,name: _value.text,jobs_count: _value.jobs_count});
            }
            else{
                this.changeRecords.emit({id:_value.id,name: _value.text});
            }
        }
        else if (_value.srcElement && _value.srcElement.value && _value.srcElement.value.length > 0){

            if(this.showJobsCount){
                this.changeRecords.emit({id:null,name: _value.srcElement.value,jobs_count: _value.jobs_count});

            }
            else{
                this.changeRecords.emit({id:null,name: _value.srcElement.value});

            }
        }

        this.value = {};
        this.items = [];
        this.initData = [];
        this.items$.next([]);
        // this.changeRecords.emit({id:this.value.id,name:this.value.text});
    }

    public removed(value:any):void {

    }

    public typed(value:any):void {
        this.getNewList(value);
    }

    public refreshValue(_value:any):void {
        this.value = _value;
    }

    constructor(public loaderService:LoaderService){

    }

    public getNewList(search_string:string) {


        this.showSpinner = true;

        this.loaderService.getCitySearch(this.countryList,search_string,this.sortOrder).subscribe(recordList=> {
            this.items = [];

            this.showSpinner = false;
            recordList.forEach(res => {
                let foundFlag = false;
                this.excludeItems.forEach(xItem => {
                    if(xItem.id == res.id)
                    {
                        foundFlag =  true;
                    }
                });

                if(!foundFlag){

                    if(this.showJobsCount){
                        this.items.push({id:res.id, text:res.name,jobs_count:res.jobs_count});
                    }
                    else{
                        this.items.push({id:res.id, text:res.name});

                    }
                }
            });

            this.items$.next(this.items);

        });
    }

}

