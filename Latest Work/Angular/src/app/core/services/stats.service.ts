import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../shared/config.service';

import { Injectable, Inject } from '@angular/core';
import { AccountService } from '../../core/account/services/account.service';

@Injectable()
export class StatsService {

    public previousPollList: BarStat[];
    public authService;

    private _url = 'jobseekers';

    private AuthHeader;
    private AuthHeader2;
    private AuthHeaderPdf;
    private AuthHeader3;
    private userId;

    constructor(private _http: HttpClient, @Inject(AccountService) authService: AccountService) {
        this.AuthHeader = authService.AuthHeader();
        this.AuthHeader2 = authService.AuthHeader2();
        this.AuthHeaderPdf = authService.AuthHeaderPDF();
        this.AuthHeader3 = authService.AuthHeader3();
        this.userId = authService.getUserId();
        this.authService = authService;

    }

    public getJobApplicationDailyWeeklyMonthlyStats() {

        return this._http.get(this.authService
            .getBuildArabicUrl(ConfigService.getAPI() +
            this._url + '/' + this.userId + '/job_applications_graph'), this.AuthHeader)
            .map((res) => res);

    }

    public getProfileViewDailyWeeklyMonthlyStats() {

        return this._http.get(this.authService
            .getBuildArabicUrl(ConfigService.getAPI() +
            this._url + '/' + this.userId + '/profile_views_graph'), this.AuthHeader)
            .map((res) => res);

    }

    public getFollowersDailyWeeklyMonthlyStats() {

        return this._http.get(this.authService
            .getBuildArabicUrl(ConfigService.getAPI() + this._url
            + '/' + this.userId + '/followed_companies_graph'), this.AuthHeader)
            .map((res) => res);

    }

    public getNumericStats() {

        return this._http.get(this.authService
            .getBuildArabicUrl(ConfigService.getAPI() + this._url + '/'
            + this.userId + '/dashboard_summary'), this.AuthHeader)
            .map((res) => res);

    }

    public getJobsCountryStats() {

        return this._http.get(this.authService
            .getBuildArabicUrl(ConfigService.getAPI() + this._url +
            '/' + this.userId + '/job_applications_by_country'), this.AuthHeader)
            .map((res) => res);

    }

    public getTopViewedProfiles(currentPage: number = 1) {

        return this._http.get(this.authService.getBuildArabicUrl(ConfigService.getAPI() +
            this._url + '?order=viewers&page=' + currentPage), this.AuthHeader)
            .map((res) => res);

    }

    public getTopViewedJobs(currentPage: number = 1) {
        return this._http.get(this.authService.getBuildArabicUrl(ConfigService.getAPI() +
            'jobs/top_viewed_jobs?page=' + currentPage), this.AuthHeader)
            .map((res) => res);
    }

    public getCompanyFollowersPercentageStats(companyId: number = 1) {

        return this._http.get(this.authService.getBuildArabicUrl(ConfigService.getAPI() +
            'companies/' + companyId + '/followers_percentage'), this.AuthHeader)
            .map((res) => res);
    }

    public getCompanyGraphStats(companyId: number = 1) {

        return this._http.get(this.authService.getBuildArabicUrl(ConfigService.getAPI()
            + 'companies/' + companyId + '/jobs_graph'), this.AuthHeader)
            .map((res) => res);
    }

    public getJobApplicantStats(companyId: number = 1) {

        return this._http.get(ConfigService.getAPI() +
            'companies/' + companyId + '/job_applicants_graph',this.AuthHeader)
            .map((res) => res);
    }

    public getCompanyJobStats(companyId: number = 1) {
        return this._http.get(this.authService.getBuildArabicUrl(ConfigService.getAPI()
            + 'companies/' + companyId + '/job_applications_percentage'), this.AuthHeader)
            .map((res) => res);
    }

    public getJobsSectorStats() {
        return this._http.get(this.authService
            .getBuildArabicUrl(ConfigService.getAPI() + this._url + '/'
            + this.userId + '/job_applications_by_sector'), this.AuthHeader)
            .map((res) => res);
    }

}

class BarStat {

    public id: number;
    public shortDesc: string;
    public longDesc: string;
    public pollVal: number;

    constructor(id, shortDesc, longDesc, pollVal) {
        this.id = id;
        this.shortDesc = shortDesc;
        this.longDesc = longDesc;
        this.pollVal = pollVal;
    }
}
