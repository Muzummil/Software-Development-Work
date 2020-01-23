import {Component,EventEmitter,Input,Output,OnInit,ChangeDetectionStrategy} from '@angular/core';
import {FormGroup,FormBuilder} from '@angular/forms';


import {LoaderService} from '../../shared/services/loader.service';
import {AccountService} from '../../core/account/services/account.service';
import {Subscription} from "rxjs/Subscription";
import {BehaviorSubject} from "rxjs/BehaviorSubject"
import {Observable} from "rxjs/Observable";

@Component({
    selector: 'auto-complete-dropdown',
    templateUrl: "autoCompDropdown.component.html",
    styleUrls: ['./autoCompleteDropdown.scss'],
    providers: [AccountService, LoaderService],
    changeDetection: ChangeDetectionStrategy.OnPush

})

// export class AutoCompDropdownComponent  implements OnInit{
export class AutoCompDropdownComponent {

    @Input() recordType:string;
    @Input() error:boolean = false;
    @Input() placeholder:string = null;
    @Input() clearBox:string = null;
    @Input() paramsType:string = "";
    @Input() resetOnSelect:boolean = false;
    @Input() resetOnChange:boolean = false;
    @Input() selectOneEnter:boolean = false;
    @Input() fullWidth:boolean = false;
    @Input() keepSelected:boolean = false;
    @Input() items:Array<any> = [];
    @Output() changeRecords = new EventEmitter();
    @Input() initData:Array<any>  = [];
    @Input() excludeItems:Array<any> =[];
    @Input() clearFlag:boolean = false;

    public value:any = {};
    public showSpinner:boolean = false;
    public _disabledV:string = '0';
    public disabled:boolean = false;
    public firstLoadFlag:boolean = true;
    public hideList:boolean = true;
    public selValue = "";

    //subscription
    private searchSubscription:Subscription;
    private methodSubscription:Subscription;

    public  keyObservable = Observable.of(null);

    public items$:BehaviorSubject<any> = new BehaviorSubject(null);
    public formAuto:FormGroup;


    ngOnInit():any {

        if(this.initData[0]){
            this.clearBox = this.initData[0]["text"];
        }
    }


    public getClearValue(){
        if(this.clearFlag || this.resetOnSelect){
            this.clearBox = "";
            this.formAuto.controls['search_string'].setValue(this.clearBox);
        }
    }

    public get disabledV():string {
        return this._disabledV;
    }

    public set disabledV(value:string) {
        this._disabledV = value;
        this.disabled = this._disabledV === '1';
    }


    public selected(_value:any):void {



        if(_value.id == null) {
            this.items = [];
            if(_value.text && _value.text != ''){
                this.changeRecords.emit({id:null,name: _value.text});
            }

        }
        else{
            this.items = [];
            if(_value.text && _value.text != ''){
                this.firstLoadFlag = true;
                this.changeRecords.emit({id:_value.id,name: _value.text});

            }
        }

        this.hideList = true;
        this.value = {};
        this.items = [];
        this.initData = [];
        this.items$.next([]);


    }

    public removed(value:any):void {

    }

    public typed(value:any):void {
        this.getNewList(value);
    }

    public refreshValue(_value:any):void {
        this.value = _value;
    }

    constructor(private loaderService:LoaderService,public fb:FormBuilder){

            this.formAuto = this.fb.group({search_string:[]})


        this.searchSubscription = this.formAuto.controls['search_string'].valueChanges.debounceTime(0).subscribe(val=>{
               if(val && val.length > 0){
                   this.selected({id:null,text:val})


                   if(!this.firstLoadFlag){
                       this.getNewList(val);
                   }
                   this.firstLoadFlag = false;

               }
            })
    }


    public resetItems(){

        this.value = {};
        this.items = [];
        this.initData = [];
        this.items$.next(null);

    }


    ngOnDestroy(){

        if(this.searchSubscription)
            this.searchSubscription.unsubscribe();
        if(this.methodSubscription)
            this.methodSubscription.unsubscribe();



    }



    ngOnChanges(_changes) {

        if(this.resetOnChange){
            this.clearBox = "";
            this.formAuto.controls['search_string'].setValue(this.clearBox);
        }

    }



    public getNewList(search_string:string,event = null) {

        

        this.showSpinner = true;
        this.hideList = true;
        // this.showList = true;
        let method_name = "get" + this.recordType + "Search";

        if(this.methodSubscription)
            this.methodSubscription.unsubscribe();


        this.methodSubscription= this.loaderService[method_name](search_string,this.paramsType).subscribe(recordList=> {
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

                if(!foundFlag)
                    this.items.push({id:res.id, text:res.name});
            });

            if(this.items.length > 0){
                this.hideList = false;
            }
            this.items$.next(this.items);

        });
    }

}
