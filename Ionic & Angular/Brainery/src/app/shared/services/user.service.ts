import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { SharedModule } from '../shared.module';
import { Observable } from 'rxjs/Observable';
// import { BehaviorSubject } from 'rxjs/BehaviorSubject';

// import * as _ from '@types/underscore';
// import { IDrupalLoginResponse, IDrupalUser } from '../interfaces/drupal-user';

@Injectable()
export class UserService {
    // public userUpdate = new BehaviorSubject<any>({});
    //public loggedInStatusUpdate = new BehaviorSubject<any>({});
    
    constructor(private http: Http) {
    }

    public login(username: string, password: string) {
            // console.log(username,password);
            let url = SharedModule.API_URL+'Users/Authenticate';    
            // const url = this.appConfigService.uri('Users/Authenticate');
            let credentials = {
                user_id: username,
                login_password: password,
                is_new:1,
                auth_for:"login"
            }
            console.log(url);
        return Observable.create(observer => {
            this.http.post(url, credentials, this.getRequestOptions()).subscribe(response => {
                console.log(response);
                const data = this.parseResponse(response);
                // this.cache.set('user', data);
                observer.next(data);
                observer.complete();
                // this.userUpdate.next({});

            }, (error) => {
                const errorBody = JSON.parse(error['_body']);

                observer.error(errorBody);
            });
        });
    }
    public logout() {
            // console.log("username,password");
            let url = SharedModule.NEW_URL + "api/logout.php?type=student";

            // const url = this.appConfigService.uri('Users/Authenticate');
        return Observable.create(observer => {
            this.http.get(url,this.getRequestOptions()).subscribe(response => {
                // const data = this.parseResponse(response);
                console.log("tttt++",response);
                localStorage.clear();
                // this.cacheService.clear();
                // this.router.navigate(['/login']);
                // this.cache.set('user', data);
                observer.next();
                observer.complete();
                // this.userUpdate.next({});

            }, (error) => {
                const errorBody = JSON.parse(error['_body']);

                observer.error(errorBody);
            });
        });
    }
    
    private getRequestOptions(): RequestOptions {
        const requestOptions = new RequestOptions({
            headers: new Headers({
                'content-type': 'application/json'
                // 'content-type': 'text/plain'
            })
        });

        return requestOptions;
    }
    private parseResponse(response) {
        const data = JSON.parse(response['_body']);
        return data;
    }

}