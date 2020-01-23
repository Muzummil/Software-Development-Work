import { Directive, Component, OnInit, ElementRef,OnDestroy, Inject, AfterViewChecked } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router'


//services
import { AccountService } from '../../core/account/services/account.service';




@Component({

    selector: "candidate-emp-dashboard",
    templateUrl: "candidate.component.html"
})


export class CandidateComponent implements OnInit, AfterViewChecked ,OnDestroy {

    public companyId:number = null;
    public candidateId:number = null;

    public queryParamsObs;


    constructor(public accountService:AccountService,public _activeRoute:ActivatedRoute){

        if(this.companyId == null){
            this.companyId = this.accountService.getCompanyId();
        }

        this.accountService.setSwitchFlag(false);

    }

    ngOnDestroy(){
        this.queryParamsObs.unsubscribe();
    }
    ngOnInit():void {

        this.queryParamsObs=  this._activeRoute.queryParams.subscribe(res=>{
            window.scrollTo(0,0);
            this.candidateId = res["id"];
        })



    }




    ngAfterViewChecked():void {
    }

}
