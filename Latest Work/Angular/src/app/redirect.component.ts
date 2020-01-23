import {Component, OnInit} from '@angular/core';

import {Router,ActivatedRoute} from '@angular/router';

//Services
import { AccountService } from './core/account/services/account.service';
import {ConfigService} from "./shared/config.service";


declare var jQuery:any;
@Component({
    selector: "re-direct",
    templateUrl: "redirect.component.html"

})


export class RedirectComponent implements OnInit {

    public queryParamsObs;
    ngOnDestroy() {
        this.queryParamsObs.unsubscribe();
    }


    ngOnInit() {


        this.queryParamsObs = this._activeRoute.queryParams.subscribe(qparams => {

            let paramsList = {};
            for(var key in qparams){
                if (qparams.hasOwnProperty(key)) {
                    paramsList[key] = qparams[key];
                }
            }


            if(this.accountService.getAuth() && !this.accountService.getCheckEmployer()) {
                this._router.navigate(['/'+ConfigService.jobseekerPath+'/profile/invite-connections'],{queryParams:paramsList});
            }
            else if(this.accountService.getAuth() && this.accountService.getCheckEmployer()) {
                this._router.navigate(['/employer/profile/invite-connections'],{queryParams:paramsList});
            }
            else {
                this._router.navigate(['/404']);
            }

        });


    }

    constructor(public accountService:AccountService,
                public _activeRoute:ActivatedRoute,
                    public _router:Router) {


        }

}
