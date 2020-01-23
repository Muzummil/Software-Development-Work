import { HttpClient} from '@angular/common/http';
import {ConfigService} from '../../../shared/config.service';

import {Injectable,Inject} from '@angular/core';

import {AccountService} from  '../../../core/account/services/account.service'

@Injectable()
export class WorkService {

    public _url ="jobseekers/";
    public AuthHeader;
    public userId;


    constructor(public _http: HttpClient,@Inject(AccountService) authService:AccountService) {
        this.AuthHeader = authService.AuthHeader();
        this.userId = authService.getUserId();
    }

    updateWorkDetails(summary :string){
        return this._http.put(ConfigService.getBloovoAPI()+this._url, JSON.stringify(summary))
            .map(res => res)
    }

    getWorkList() {
        return this._http.get(ConfigService.getBloovoAPI()+this._url)
            .map(res => res)
            .delay(500)
    }
}
