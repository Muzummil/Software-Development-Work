import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../shared/config.service';

import { Injectable, Inject } from '@angular/core';
import { AccountService } from '../account/services/account.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class CareerFairService {

    // Cache
    public static allCareerFairDirty: boolean = true;
    public static allCareerFairCache$ = new BehaviorSubject(null);

    // members
    public authService;

    constructor(public _http: HttpClient, @Inject(AccountService) authService: AccountService) {
        this.authService = authService;
    }

    public getAllActiveCareerFairs(page = 1): Observable<any> {
        let url = ConfigService.getAPI() + 'career_fairs?page=' + page;
        url = this.authService.getBuildArabicUrl(url);
        if (CareerFairService.allCareerFairDirty) {
            return this._http.get(url, this.authService.AuthHeader())
                .map((res) => {
                    CareerFairService.allCareerFairCache$.next(res);
                    return res;
                });
        } else {
            return CareerFairService.allCareerFairCache$;
        }

    }

    public getCareerFairDetails(id): Observable<any> {
        let url = ConfigService.getAPI() + 'career_fairs/' + id;
        url = this.authService.getBuildArabicUrl(url);
        return this._http.get(url, this.authService.AuthHeader())
            .map((res) => {
                CareerFairService.allCareerFairCache$.next(res);
                return res;
            });

    }

    public getCareerFairApplicants(careerFairId, page = 1): Observable<any> {
        let url = ConfigService.getAPI() + 'career_fairs/' + careerFairId + '/applicants?page=' + page;
        url = this.authService.getBuildArabicUrl(url);
        return this._http.get(url, this.authService.AuthHeader())
            .map((res) => {
                CareerFairService.allCareerFairCache$.next(res);
                return res;
            });

    }

    public getJoinCareerFair(id): Observable<any> {

        let postData = { career_fair_application: { career_fair_id: id } }
        let url = ConfigService.getAPI() + 'jobseekers/' + this.authService.getUserId()
            + '/career_fair_applications';

        return this._http.post(url, JSON.stringify(postData), this.authService.AuthHeader2())
            .map((res) => res);

    }
    public deleteCareerFair(id): Observable<any> {
        let url = ConfigService.getAPI() + 'career_fairs/' + id;
        return this._http.delete(url, this.authService.AuthHeader2())
            .map((res) => res);

    }

    public createCareerFair(postDate): Observable<any> {

        let postData = { career_fair: postDate };
        let url = ConfigService.getAPI() + 'career_fairs/';

        return this._http.post(url, JSON.stringify(postData), this.authService.AuthHeader2())
            .map((res) => res);

    }
    public updateCareerFair(id, postDate): Observable<any> {

        let postData = { career_fair: postDate };
        let url = ConfigService.getAPI() + 'career_fairs/' + id;

        return this._http.put(url, JSON.stringify(postData), this.authService.AuthHeader2())
            .map((res) => res);

    }

    public registerCareerFair(postData): Observable<any> {
        let url = ConfigService.getAPI() + 'users/signup_jobseeker_career_fair';
        return this._http.post(url, postData, this.authService.AuthHeader2())
            .map((res) => res);

    }

    public updateJobseekerCareerFair(postData): Observable<any> {
        let url = ConfigService.getAPI() + 'users/signup_jobseeker_career_fair';
        return this._http.put(url, postData, this.authService.AuthHeader2())
            .map((res) => res);

    }

}
