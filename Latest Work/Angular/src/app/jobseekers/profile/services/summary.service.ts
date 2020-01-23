import { HttpClient} from '@angular/common/http';
import {ConfigService} from '../../../shared/config.service';

import {Injectable,Inject} from '@angular/core';
import {AccountService} from  '../../../core/account/services/account.service';




@Injectable()
export class SummaryService {

    public _url ="jobseekers/";
    public AuthHeader;
    public AuthHeader2;
    public userId;


    constructor(public _http: HttpClient,@Inject(AccountService) authService:AccountService) {
        this.AuthHeader = authService.AuthHeader();
        this.AuthHeader2 = authService.AuthHeader2();
        this.userId = authService.getUserId();
    }





    updateContactDetails(summary :string) {
        return this._http.put(ConfigService.getAPI()+this._url+this.userId,
            JSON.stringify({jobseeker: summary}), this.AuthHeader2)
            .map(res => res)

    }





}
