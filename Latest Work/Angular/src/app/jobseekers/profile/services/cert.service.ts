import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../../shared/config.service';

import { Injectable } from '@angular/core';

// Models
import { JobSeekerCertificate } from '../models/JobSeekerCertificate';


@Injectable()
export class CertService {

    public _url = "cert.html";

    constructor(public _http: HttpClient) {

    }

    updateCertDetails(jobSeekerCertificate: JobSeekerCertificate) {
        return this._http.put(ConfigService.getBloovoAPI() + this._url, JSON.stringify(jobSeekerCertificate))
            .map(res => res);
    }

    postCertDetails(jobSeekerCertificate: JobSeekerCertificate) {
        return this._http.post(ConfigService.getBloovoAPI() + this._url, JSON.stringify(jobSeekerCertificate))
            .map(res => res);
    }

    getCertList() {
        return this._http.get(ConfigService.getBloovoAPI() + this._url)
            .map(res => res)
            .delay(500);
    }
}
