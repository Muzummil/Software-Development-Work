import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigService } from '../../../shared/config.service';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import { AccountService } from '../../account/services/account.service';

@Injectable()
export class SignupService {
    public userJobseekerSignupUrl = 'users/signup_jobseeker';
    public jobseekerSignupUrl = 'jobseekers';
    public employerSignupUrl = 'users/signup_employer';
    // members
    public authService;

    constructor(public _http: HttpClient, @Inject(AccountService) authService: AccountService) {
        this.authService = authService;
    }

    // Auth Header Json
    public AuthHeader2() {
        return {
            headers: new HttpHeaders().set('Authorization',
                this.authService.getAuthKey()).set('Content-Type', 'application/json')
        };
    }
    public signupOrUpdateJobseeker(postData, isUpdate: boolean = false) {

        if (isUpdate) {
            return this.updateJobSeeker(postData);
        } else {
            return this.createJobSeeker(postData);
        }
    }

    public signupJobseeker(postData) {
        let headers = new HttpHeaders().set('Content-Type', 'application/json');

        if (postData['user'] && postData['user']['email']) {
            headers.set('Authorization', 'Basic ' + btoa(postData['user']['email'] +
                ':' + postData['user']['password']));
        }

        return this._http.post(ConfigService.getAPI() +
            this.userJobseekerSignupUrl, JSON.stringify(postData), {headers})
            .map((res) => res);
    }

    public createJobSeeker(postData) {
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        if (postData['user'] && postData['user']['email']) {
            headers.set('Authorization', 'Basic ' + btoa(postData['user']['email'] + ':'
                + postData['user']['password']));
        }
        return this._http.post(ConfigService.getAPI() + this.jobseekerSignupUrl,
            JSON.stringify(postData), {headers})
            .map((res) => res);
    }

    public updateJobSeeker(postData) {
        return this._http.put(ConfigService.getAPI() + this.jobseekerSignupUrl + '/' +
            this.authService.getUserId(),
            JSON.stringify(postData), this.AuthHeader2())
            .map((res) => res);
    }

    public signupEmployer(postData) {
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        if (postData['user'] && postData['user']['email']) {
            headers.append('Authorization', 'Basic ' +
                btoa(postData['user']['email'] + ':' + postData['user']['password']));
        }
        return this._http.post(ConfigService.getAPI() +
            this.employerSignupUrl, JSON.stringify(postData), {headers})
            .map((res) => res);
    }

    public signupEmployerWithImage(formData: FormData, postData) {

        return Observable.create((observer) => {

            let xhr: XMLHttpRequest = new XMLHttpRequest();

            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        observer.next(JSON.parse(xhr.response));
                        observer.complete();
                    } else {
                        observer.error(xhr.response);
                    }
                }
            };

            let url = ConfigService.getAPI() + this.employerSignupUrl;
            let method = 'POST';

            xhr.open(method, url, true);
            xhr.setRequestHeader('Authorization', 'Basic ' +
                btoa('aa@aa.aa' + ':' + 'test1234'));
            xhr.send(formData);
        });
    }
}
