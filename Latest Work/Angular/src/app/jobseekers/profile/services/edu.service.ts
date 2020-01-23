import { HttpClient} from '@angular/common/http';
import {ConfigService} from '../../../shared/config.service';

import {Injectable} from '@angular/core';

//Models
import {JobSeekerEducation} from '../models/JobSeekerEducation';


@Injectable()
export class EduService {

    public _url ="edu.html";


    constructor(public _http: HttpClient) {

    }

    updateEduDetails(jobSeekerEducation :JobSeekerEducation) {
        return this._http.put(ConfigService.getBloovoAPI()+this._url, JSON.stringify(jobSeekerEducation))
            .map(res => res)
    }

    postEduDetails(jobSeekerEducation :JobSeekerEducation){
        return this._http.post(ConfigService.getBloovoAPI()+this._url, JSON.stringify(jobSeekerEducation))
            .map(res => res)
    }

    getEduList() {

        return this._http.get(ConfigService.getBloovoAPI()+this._url)
            .map(res => res)
            .delay(500)
    }
}
