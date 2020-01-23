import { HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {JobSeekerSkills} from '../models/JobSeekerSkills';
import {ConfigService} from '../../../shared/config.service';



@Injectable()
export class SkillService {

    public _url ="skills.html";
    constructor(public _http:HttpClient ){

    }

    getSkills() {
        return this._http.get(ConfigService.getBloovoAPI()+this._url)
            .map(res => res)


    }




    updateSkills(skills :JobSeekerSkills[]) {
        return this._http.post(ConfigService.getBloovoAPI()+this._url, JSON.stringify(skills))
            .map(res => res)


    }

}
