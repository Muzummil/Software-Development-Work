import { HttpClient} from '@angular/common/http';
import {Injectable,Inject} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {ConfigService} from '../../shared/config.service';
import {Tags} from '../../shared/models/Tags';

import {AccountService} from  '../../core/account/services/account.service';

@Injectable()
export class TagService {

	public _root_url = "jobseekers/";
    public _tags_url = "tags/";
    public _update_tags_url ="/update_tags.json";
    public AuthHeader;
    public AuthHeader2;
    public userId:any;

    constructor(public _http:HttpClient, @Inject(AccountService) authService:AccountService){
    	this.AuthHeader = authService.AuthHeader();
    	this.AuthHeader2 = authService.AuthHeader2();
        this.userId = authService.getUserId();
    }


    public getBuildTags(data) {

        let listTags = [];
        if(data.tags)
        {
            data.tags.forEach(res => {
                let tag = new Tags();
                tag.id = res.id;
                tag.name = res.name;
                tag.weight = res.weight;

                listTags.push(tag);

            });
        }
        return listTags;
    }

    getTags(searchString:string) {
        return this._http.get(ConfigService.getAPI()+this._tags_url+'?q[name_cont]='+searchString,this.AuthHeader)
            .map(res => this.getBuildTags(res));
    }


    updateTags(tags :any){
        return this._http.post(ConfigService.getAPI()+this._root_url+this.userId+this._update_tags_url, JSON.stringify({jobseeker: tags}), this.AuthHeader2)
            .map(res => res)
    }
}
