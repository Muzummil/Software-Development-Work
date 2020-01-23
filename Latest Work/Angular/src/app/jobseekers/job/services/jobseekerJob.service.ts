import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../../shared/config.service';
import { Location } from '@angular/common';

import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AccountService } from '../../../core/account/services/account.service';

// Models
import { Job, JobStats, JobSearchTags, BenefitList, JobGraphs } from '../models/Job';
import { JobSearch } from '../models/JobSearch';
import { Company } from '../../../shared/models/Company';

@Injectable()
export class JobseekerJobService {

    public _url = 'jobs.html';
    public _saved_job_search_url = 'saved_job_search.html';

    public _alljobs_url = 'jobs/all_jobs';
    public _publicjobs_url = 'jobs';
    public _job_details_url = 'jobs';
    public _myjobs_url = '/job_applications';
    public _myjobsStats_url = '/dashboard_summary';
    public _suggestedjobs_url = 'jobs/suggested_jobs';

    public _savedsearchjobs_url = '/saved_job_searches';
    public _savedjobs_url = '/saved_jobs';
    public _deletesavedjobs_url = '/saved_jobs/delete_bulk';
    public _featuredjobs_url = '/jobs/featured_jobs';

    // members
    public AuthHeader;
    public AuthHeader2;
    public AuthHeader3;
    public userId;
    // Used in jobDetails Component Jobseeker
    public indeed_saudi_fix = 20000;
    public indeed_kuwait_fix = 50000;
    public indeed_uk_fix = 100000;

    // Cache
    public allJobsCache = null;
    public myJobsCache = null;
    public suggestedJobsCache = null;
    public suggestedJobsCacheURL = null;
    public savedJobsCache = null;
    public savedSearchJobsCache = null;
    public allJobsURLCache = null;
    public myJobsURLCache = null;
    public featuredJobsCache = null;

    // Variables
    public cachedTimeSec: number;

    public _paramHash = {
        locations: 'q[co_in][]=',
        cities: 'q[ci_in][]=',
        sectors: 'q[se_in][]=',
        fareas: 'q[fa_in][]=',
        jobtypes: 'q[jt_in][]=',
        salarylevels: 'q[sr_in][]=',
        edulevels: 'q[je_in][]=',
        explevels: 'q[jel_in][]=',
        companies: 'q[com_in][]='
    };

    constructor(public _http: HttpClient,
                @Inject(AccountService) public authService: AccountService,
                public location: Location) {
        this.AuthHeader = authService.AuthHeader();
        this.AuthHeader2 = authService.AuthHeader2();
        this.AuthHeader3 = authService.AuthHeader3();
        this.userId = authService.getUserId();

    }

    public getErrorCheck(error) {
        this.authService.getErrorCheck(error);
    }

    public _onBuildFilterParams(filterList) {

        let queryString: string = '';

        if (filterList['locations'] && filterList['locations'].length > 0) {
            filterList['locations'].forEach((selval) => {
                queryString += this._paramHash.locations + selval + '&';

            });
        }

        if (filterList['cities'] && filterList['cities'].length > 0) {
            filterList['cities'].forEach((selval) => {
                queryString += this._paramHash.cities + selval + '&';

            });
        }
        if (filterList['sectors'] && filterList['sectors'].length > 0) {
            filterList['sectors'].forEach((selval) => {
                queryString += this._paramHash.sectors + selval + '&';

            });
        }

        if (filterList['fareas'] && filterList['fareas'].length > 0) {
            filterList['fareas'].forEach((selval) => {
                queryString += this._paramHash.fareas + selval + '&';

            });
        }

        if (filterList['jobtypes'] && filterList['jobtypes'].length > 0) {
            filterList['jobtypes'].forEach((selval) => {
                queryString += this._paramHash.jobtypes + selval + '&';

            });
        }

        if (filterList['salarylevels'] && filterList['salarylevels'].length > 0) {
            filterList['salarylevels'].forEach((selval) => {
                queryString += this._paramHash.salarylevels + selval + '&';

            });
        }

        if (filterList['edulevels'] && filterList['edulevels'].length > 0) {
            filterList['edulevels'].forEach((selval) => {
                queryString += this._paramHash.edulevels + selval + '&';

            });
        }

        if (filterList['explevels'] && filterList['explevels'].length > 0) {
            filterList['explevels'].forEach((selval) => {
                queryString += this._paramHash.explevels + selval + '&';

            });
        }

        if (filterList['companies'] && filterList['companies'].length > 0) {
            filterList['companies'].forEach((selval) => {
                queryString += this._paramHash.companies + selval + '&';

            });
        }

        return queryString;

    }

    public clearSavedJobCache() {
        this.savedJobsCache = null;
    }

    public getDeleteSavedJobList(jobIdList: any = []): Observable<any> {

        let url = ConfigService.getAPI() + 'jobseekers/' + this.userId + this._deletesavedjobs_url;
        let querystring: string = '';
        jobIdList.forEach((id) => {
            querystring += 'job_ids[]=' + id + '&';
        });
        return this._http.delete(url + '?' + querystring, this.AuthHeader3)
            .map((res) => res)
            .map((res) => {
                this.clearSavedJobCache();
                return true;
            });
    }

    public getSavedJobList(page: number = 1, flag: boolean = false,
                           order_string: string = ''): Observable<any> {

        let url = ConfigService.getAPI() + 'jobseekers/' + this.userId + this._savedjobs_url +
            '?page=' + page + '&';
        url += (this.authService.getCurrLang() === ConfigService.langHash['arabic']) ? 'ar=true&' :
            '';
        if (order_string != null && order_string !== '') {
            url += 'order=' + order_string + '&';
        }

        return this._http.get(url, this.AuthHeader)
            .map((res) => res)
            .map((res) => {
                this.savedJobsCache = res;
                return this.getJobs(this.savedJobsCache, flag, 'jobs');
            });
    }

    public _clearSavedJobSearchCache() {
        this.savedSearchJobsCache = null;
    }

    public getDeleteAllSavedSearchJobList(page: number = 1, ids: any[] = null) {

        let queryString = '';
        let url = ConfigService.getAPI() + 'jobseekers/' + this.userId + this._savedsearchjobs_url +
            '/delete_bulk?';
        if (ids['length'] > 0) {

            ids.forEach((selId) => {
                queryString += 'saved_job_search_ids[]=' + selId + '&';
            });

        }

        return this._http.delete(url + queryString, this.AuthHeader3)
            .map((res) => res)
            .map((res) => {
                this._clearSavedJobSearchCache();
                this.savedSearchJobsCache = res;
                return this._getSavedSearchJobs(this.savedSearchJobsCache, false);
            });

    }

    public getDeleteSavedSearchJobList(page: number = 1, id: number = null): Observable<any> {

        let url = ConfigService.getAPI() + 'jobseekers/' + this.userId + this._savedsearchjobs_url
            + '/' + id;

        return this._http.delete(url, this.AuthHeader3)
            .map((res) => res)
            .map((res) => {
                this._clearSavedJobSearchCache();
                this.savedSearchJobsCache = res;
                return this._getSavedSearchJobs(this.savedSearchJobsCache, false);
            });
    }

    public getSavedSearchJobList(page: number = 1, flag: boolean = false,
                                 clearCache: boolean = false): Observable<any> {
        let url = ConfigService.getAPI() + 'jobseekers/' + this.userId + this._savedsearchjobs_url
            + '?page=' + page;
        url += (this.authService.getCurrLang() === ConfigService.langHash['arabic']) ? '&ar=true' :
            '';

        return this._http.get(url, this.AuthHeader)
            .map((res) => res)
            .map((res) => {
                this.savedSearchJobsCache = res;
                return this._getSavedSearchJobs(this.savedSearchJobsCache, flag);
            });

    }

    public getSuggestedJobList(page: number = 1, order_string = ''): Observable<any> {
        let url = ConfigService.getAPI() + this._suggestedjobs_url + '?page=' + page + '&';

        url += (this.authService.getCurrLang() === ConfigService.langHash['arabic']) ? 'ar=true&' :
            '';
        if (order_string != null && order_string !== '') {
            url += 'order=' + order_string + '&';
        }

        if (this.suggestedJobsCache != null && this.suggestedJobsCacheURL === url) {
            return Observable.of(this.suggestedJobsCache);
        }
        return this._http.get(url, this.AuthHeader)
            .map((res) => res)
            .map((res) => {
                this.suggestedJobsCacheURL = url;
                this.suggestedJobsCache = this.getJobs(res, [], 'jobs');
                return this.suggestedJobsCache;
            });
    }

    public getJobseekerProbabilitySuccess(jobId): Observable<any> {

        let url = ConfigService.getAPI() + 'jobseekers/' + this.authService.getUserId() +
            '/success_probability?job_id=' + jobId;
        url += (this.authService.getCurrLang() === ConfigService.langHash['arabic']) ? '&ar=true' :
            '';
        return this._http.get(url, this.AuthHeader)
            .map((res) => res);

    }

    public getAllJobList(search_string = '', loctitle = '', order_string = '',
                         dataVal: any = null, page: number = 1, perPage = null): Observable<any> {
        let searchQry = '';
        if (dataVal != null) {
            searchQry = this._onBuildFilterParams(dataVal);
        }

        let url = '';
        if (this.getCheckPublic()) {
            url = ConfigService.getAPI() + this._publicjobs_url + '?page=' + page;
        } else {
            url = ConfigService.getAPI() + this._alljobs_url + '?page=' + page;
        }
        url += (this.authService.getCurrLang() === ConfigService.langHash['arabic']) ? '&ar=true' :
            '';

        if (searchQry && searchQry.length > 0) {
            url += '&' + searchQry;
        }

        if (order_string != null && order_string != '') {

            url += '&order=' + order_string;
        }

        if (search_string != '' && search_string != null) {
            url += '&q[title_cont]=' + search_string;
        }

        if (loctitle != '' && loctitle != null) {
            url += '&q[country_name_or_city_name_cont]=' + loctitle;
        }

        if (perPage != '' && perPage != null) {
            url += '&per_page=' + perPage;
        }

        if (this.allJobsCache != null && this.allJobsURLCache == url) {
            return Observable.of(this.allJobsCache);
        }
        return this._http.get(url, this.AuthHeader)
            .map((res) => res)
            .map((res) => {
                this.allJobsCache = this.getJobs(res, dataVal, 'jobs', dataVal);
                this.allJobsURLCache = url;
                return this.allJobsCache;
            });

    }

    public getCheckPublic() {

        let isPublic = !this.authService.getAuth();

        return isPublic;
    }

    public acceptRejectInterview(jobApplicationId, InterviewId, jobseekerReply, contact = null):
        Observable<any> {

        let postData = {};

        if (contact != null) {
            postData = {
                interview: {
                    jobseeker_contact: contact,
                    status: 'accept',
                    jobseeker_reply: jobseekerReply
                }
            };
        } else {
            postData = {
                interview: {
                    jobseeker_contact: contact,
                    status: 'reject',
                    jobseeker_reply: jobseekerReply
                }
            };
        }

        let url = ConfigService.getAPI() + 'job_applications/' + jobApplicationId + '/interviews/'
            + InterviewId;
        url += (this.authService.getCurrLang() === ConfigService.langHash['arabic']) ? '?ar=true' :
            '';
        return this._http.put(url, postData, this.AuthHeader2)
            .map((res) => res);
    }

    public posteSavedSearchJob(web_url: string, title: string, alert_type_id: number) {

        let postData = {
            saved_job_search: {
                title,
                alert_type_id,
                web_url
            }
        };
        let url = ConfigService.getAPI() + 'jobseekers/' + this.userId + this._savedsearchjobs_url;

        return this._http.post(url, postData, this.AuthHeader2)
            .map((res) => res);

    }

    public updateSavedSearchJob(id: number, web_url: string, title: string, alert_type_id: number) {

        let postData = JSON.stringify({
            saved_job_search: {
                title,
                alert_type_id,
                web_url
            }
        });
        let url = ConfigService.getAPI() + 'jobseekers/' + this.userId + this._savedsearchjobs_url
            + '/' + id;

        return this._http.put(url, postData, this.AuthHeader2)
            .map((res) => res);

    }

    public saveJob(job_id: number) {

        let postData = {saved_job: {job_id}};

        let url = ConfigService.getAPI() + 'jobseekers/' + this.userId + this._savedjobs_url;

        return this._http.post(url, JSON.stringify(postData), this.AuthHeader2)
            .map((res) => res);

    }

    public buildJobs(job, checkallFlag, mode = 'short') {
        let jobListArry = new Array();

        let statusMapper = ['Applied', 'Reviewed', 'Shortlisted', 'Interview', 'Successful',
            'Unsuccessful'];
        job.forEach((record) => {
            let selJob = null;
            let selJobApplication = null;
            if (mode === 'myjobs') {
                selJob = record.job;
                selJobApplication = record;
            } else {
                selJob = record;
            }

            let selJobObj = new Job();
            selJobObj.id = selJob.id;
            selJobObj.jobAppId = record.id;
            selJobObj.title = selJob.title;

            selJobObj.matchingPercent = selJob['matching_percentage'];
            if (selJob['salary_range'] != null) {
                selJobObj.salaryFrom = selJob['salary_range']['salary_from'];
                selJobObj.salaryTo = selJob['salary_range']['salary_to'];
            } else {
                selJobObj.salaryFrom = selJobObj.salaryTo = 0;
            }
            if (selJob['city']) {
                selJobObj.cityId = selJob['city'].id;
                selJobObj.city = selJob['city'].name;
            }

            if (selJob['sector']) {
                selJobObj.sector = selJob['sector'].name;
                selJobObj.sectorId = selJob['sector'].id;
            }

            if (selJob['country']) {
                selJobObj.countryCode = selJob['country'].id;
                selJobObj.countryCountry = selJob['country'].name;
            }

            if (selJob['branch']) {
                selJobObj.branch = selJob['branch'];
            }
            selJobObj.numberApplicants = selJob['job_applications_count'];
            selJobObj.probabilitySuccess = selJob.probability_success;

            selJobObj.startDate = selJob.start_date;
            selJobObj.createdDate = selJob.created_at;

            if (mode === 'myjobs') {
                selJobObj.startDate = selJobApplication.start_date;
                selJobObj.interviewDate = selJobApplication.interview_date;
                selJobObj.interviewTime = selJobApplication.interview_time;
                selJobObj.trackingId = statusMapper
                    .indexOf(selJobApplication['job_application_status']['en_status']);
                selJobObj.statusId = statusMapper
                    .indexOf(selJobApplication['job_application_status']['en_status']);
                selJobObj.interviewStatusFlag = statusMapper
                    .indexOf(selJobApplication['job_application_status']['en_status']);
                selJobObj.interviewVenue = selJobApplication.interview_venue;
                selJobObj.employersComment = selJobApplication.interview_comment;
                selJobObj.appliedFlag = selJobApplication.applied_flag;
                selJobObj.appliedDate = (selJobApplication.applied_date == null) ? null :
                    new Date(selJobApplication.applied_date);

                selJobObj.employersFeedbackList = [];

                let wasRejected = false;
                if (selJobApplication['employer_feedbacks'] &&
                    selJobApplication['employer_feedbacks'].length > 0) {

                    selJobApplication['employer_feedbacks'].forEach((selFeed) => {

                        if (selFeed['offer_letter'] != null) {
                            let obj = {
                                id: selFeed['id'],
                                comment: selFeed['comment'],
                                created_at: selFeed['created_at'],
                                employer_name: selFeed['employer_name'],
                                employer_id: selFeed['employer_id'],
                                job_application_status: selFeed['job_application_status']
                            };
                            selJobObj.employersInterviewComment = obj;
                            selJobObj.employersFeedbackOfferLetter = selFeed['offer_letter'];
                        } else if (selFeed['interview'] != null) {
                            let obj = {
                                id: selFeed['id'],
                                comment: selFeed['comment'],
                                created_at: selFeed['created_at'],
                                employer_name: selFeed['employer_name'],
                                employer_id: selFeed['employer_id'],
                                interviewee: selFeed['interview']['interviewee'],
                                channel: selFeed['interview']['channel'],
                                interview_comment: selFeed['interview']['comment'],
                                job_application_status: selFeed['job_application_status'],
                                status: selFeed['interview']['status']
                            };
                            selJobObj.employersInterviewComment = obj;
                            selJobObj.employersFeedbackInterview = selFeed['interview'];

                        }

                        let obj = {
                            id: selFeed['id'],
                            comment: selFeed['comment'],
                            created_at: selFeed['created_at'],
                            employer_name: selFeed['employer_name'],
                            employer_id: selFeed['employer_id'],
                            job_application_status: selFeed['job_application_status']
                        };
                        if (selFeed['interview'] != null) {
                            obj['interviewee'] = selFeed['interview']['interviewee'];
                            obj['channel'] = selFeed['interview']['channel'];
                            obj['appointment'] = selFeed['interview']['appointment'];
                            obj['time_zone'] = selFeed['interview']['time_zone'];
                            obj['interview_comment'] = selFeed['interview']['comment'];
                            obj['interview_status'] = selFeed['interview']['status'];
                            obj['jobseeker_reply'] = selFeed['interview']['jobseeker_reply'];
                        }

                        selJobObj.employersFeedbackList.push(obj);

                    });
                }
            }

            if (Date.now() > Date.parse(selJob.end_date)) {
                selJobObj.openFlag = false;
            }
            /**
             * Check all flag set
             */
            if (checkallFlag === true) {
                selJobObj.checkedFlag = true;
            }

            let selCompany = new Company();
            selCompany.name = selJob['company']['name'];
            selCompany.id = selJob['company']['id'];

            if (selJob.company.sector) {
                selCompany.sector = selJob['company']['sector']['name'];
            }

            selJobObj.companyObj = selCompany;
            selJobObj.companyObj.profileImage = selJob.company.avatar;

            jobListArry.push(selJobObj);
        });
        return jobListArry;
    }

    public getJobs(jobList, dataVal: any, mode = 'short', filtersObj = {}): any {
        if (mode === 'jobs') {

            let jobListArry = this.buildJobs(jobList.jobs, dataVal);
            let jobOnlyListArry = {
                jobs: jobListArry,
                search_tags: filtersObj,
                meta: jobList['meta']
            };
            return jobOnlyListArry;

        } else if (mode === 'myjobs') {

            let jobListArry = this.buildJobs(jobList.job_applications, dataVal, 'myjobs');
            let jobOnlyListArry = {
                jobs: jobListArry,
                search_tags: filtersObj,
                meta: jobList['meta']
            };
            return jobOnlyListArry;

        } else if (mode === 'long') {
            let jobListArry = this.buildJobs(jobList.jobs, dataVal);

            let jobStats = new JobStats();
            jobStats.totalApplication = jobList.stats.applications;
            jobStats.inProgress = jobList.stats.in_progress;
            jobStats.successful = jobList.stats.success;
            jobStats.unSuccessful = jobList.stats.un_successful;

            let jobSearchTags = new JobSearchTags();

            jobSearchTags.searchtagName = jobList.search_tags;

            let featuredJobListArry = this.buildJobs(jobList.featured_jobs, dataVal);

            let longJobListArry = {
                matching_jobs: jobList.matching_jobs,
                help_message: jobList.help_message,
                stats: jobStats,
                featured_jobs: featuredJobListArry,
                jobs: jobListArry,
                search_tags: jobSearchTags
            };

            return longJobListArry;
        }
    }

    public getMyJobStats(): Observable<any> {
        let url = ConfigService.getAPI() + 'jobseekers/' + this.userId + this._myjobsStats_url;
        url += (this.authService.getCurrLang() === ConfigService.langHash['arabic']) ? '?ar=true' :
            '';
        return this._http.get(url, this.AuthHeader)
            .map((res) => res);
    }

    public getMyJobList(search_string = '', order_string = '',
                        dataVal: any = null, page: number = 1, cached: boolean = true):
        Observable<any> {
        let searchQry = '';
        if (dataVal != null) {
            searchQry = this._onBuildFilterParams(dataVal);
        }

        let url = ConfigService.getAPI() + 'jobseekers/' + this.userId + this._myjobs_url +
            '?page=' + page + '&' + searchQry;
        url += (this.authService.getCurrLang() === ConfigService.langHash['arabic']) ? 'ar=true&' :
            '';
        if (order_string != null && order_string !== '') {

            url += 'order=' + order_string + '&';
        }

        if (search_string !== '' && search_string != null) {
            url += 'q[title_cont]=' + search_string + '&';
        }

        if (this.myJobsCache != null && this.myJobsURLCache === url && cached === true) {
            return Observable.of(this.myJobsCache);
        }

        return this._http.get(url, this.AuthHeader)
            .map((res) => res)
            .map((res) => {
                this.myJobsCache = this.getJobs(res, dataVal, 'myjobs', dataVal);
                this.myJobsURLCache = url;
                return this.myJobsCache;
            });
    }

    public _getBuildCompany(data) {
        let companyList = Array();

        data.forEach((res) => {

            let company = new Company();

            company.id = res.id;
            company.name = res.name;
            company.sector = res.sector.name;
            company.follower = res.followers_count;
            company.followingFlag = res.is_follow_by_current_user;
            company.countryCode = res.country_code;
            company.country = res.country;
            company.city = res.city;
            company.cityId = res.city_id;

            if (res.current_city) {
                company.city = res.current_city;
            }
            company.profileImage = res.avatar;
            companyList.push(company);

        });
        return companyList;
    }

    public _getBuildJobCharts(data) {
        let jobCharts = this._getBuildCharts(data['job']);
        return {jobCharts};
    }

    public _getBuildSimilarJobs(data) {

        let similarJobs = this.buildJobs(data.similar_jobs, false);

        return {similarJobs};
    }

    public _getBuildSimilarCompanies(data) {
        let similarCompanies = this._getBuildCompany(data.similar_companies);

        return {similarCompanies};
    }

    public _getBuildJobDetails(data) {
        let selJob = data.job;
        let selJobObj = new Job();

        if (selJob.skills) {
            selJobObj.skills = selJob.skills;
        }
        selJobObj.id = selJob.id;
        selJobObj.title = selJob.title;
        selJobObj.startDate = selJob.start_date;
        selJobObj.endDate = selJob.end_date;
        selJobObj.deleted = selJob.deleted;
        selJobObj.appliedDate = (selJob.applied_date == null) ? null :
            new Date(selJob.applied_date);
        selJobObj.createdDate = (selJob.created_at == null) ? null :
            new Date(selJob.created_at);
        selJobObj.count_applications = (selJob.count_applications == null) ? 0 :
            selJob.count_applications;
        selJobObj.views_count = (selJob.views_count == null) ? 0 : selJob.views_count;
        selJobObj.matchingPercent = selJob.matching_percentage;
        selJobObj.probabilitySuccess = selJob.probability_success;
        selJobObj.jobTypeName = selJob.job_type.name;
        selJobObj.jobStatus = selJob.job_status.status;

        selJobObj.educationLevel = selJob.job_education.name;
        selJobObj.educationLevelId = selJob.job_education.id;

        selJobObj.employmentType = selJob.job_experience_level.name;
        selJobObj.employmentTypeId = selJob.job_experience_level.id;

        selJobObj.experienceFrom = selJob.experience_from;
        selJobObj.experienceTo = selJob.experience_to;
        selJobObj.drivingLicense = (selJob.license_required) ? true : false;

        if (selJob.start_date) {
            selJobObj.howSoon = selJob.start_date;
        }
        selJobObj.join_date = selJob.join_date;
        if (selJob.salary_range) {
            selJobObj.salaryFrom = selJob.salary_range['salary_from'];
            selJobObj.salaryTo = selJob.salary_range['salary_to'];
        }
        selJobObj.branch = selJob.branch;
        selJobObj.isSaved = selJob.is_saved_by_current_user;
        selJobObj.educationLevelId = selJob.job_education.id;
        selJobObj.educationLevel = selJob.job_education.name;
        selJobObj.genderType = selJob.gender_type;
        selJobObj.viewCount = selJob.views_count;
        selJobObj.numberApplicants = selJob.count_applications;
        selJobObj.rankListHigh = selJob.count_applications;

        selJobObj.jobDescription = selJob.description;
        selJobObj.jobRequirement = selJob.requirements;

        selJobObj.certificates = selJob.certificates;
        if (selJob.languages) {
            selJob.languages.forEach((x) => {
                selJobObj.languageList.push({id: x.id, name: x.name});
            });
        }

        selJobObj.experienceLevel = selJob.job_experience_level.name;
        selJobObj.experienceLevelId = selJob.job_experience_level.id;

        selJob.benefits.forEach((x) => {
            let bl = new BenefitList();
            bl.id = x.id;
            bl.name = x.name;
            bl.icon_code = x.icon;
            selJobObj.jobBenefitList.push(bl);

        });

        if (selJob.city) {
            selJobObj.cityId = selJob.city.id;
            selJobObj.city = selJob.city.name;
        }

        if (selJob.sector) {
            selJobObj.sector = selJob.sector.name;
            selJobObj.sectorId = selJob.sector.id;
        }

        selJobObj.countryCode = selJob.country.id;
        selJobObj.countryId = selJob.country.id;
        selJobObj.countryCountry = selJob.country.name;

        selJobObj.companyObj = new Company();
        selJobObj.companyObj.id = selJob.company.id;
        selJobObj.companyObj.name = selJob.company.name;
        selJobObj.companyObj.followingFlag = selJob.company.is_follow_by_current_user;
        if (selJob.company.sector) {
            selJobObj.companyObj.sector = selJob.company.sector.name;
            selJobObj.companyObj.sectorId = selJob.company.sector.id;
        }
        if (selJob.functional_area) {
            selJobObj.companyObj.functionalArea = selJob.functional_area.name;
            selJobObj.companyObj.functionalAreaId = selJob.functional_area.id;
        }

        selJobObj.companyObj.profileImage = selJob.company.avatar;

         //Age Group
         if (selJob.age_group) {
            selJobObj.ageFrom = selJob.age_group['min_age'];
            selJobObj.ageTo = selJob.age_group['max_age'];
        }
        //Nationalities
        if (selJob.geo_countries) {
            selJob.geo_countries.forEach(element => {
                selJobObj.nationialities.push({ id: element.id, name: element.name });
            });
        }
        return {selectedJobs: selJobObj};
    }

    public getJobCharts(id: number) {

        let url = ConfigService.getAPI() + this._job_details_url + '/' + id + '/analysis';
        url += (this.authService.getCurrLang() === ConfigService.langHash['arabic']) ? '?ar=true' :
            '';
        return this._http.get(url, this.AuthHeader)
            .map((res) => this._getBuildJobCharts(res));
    }

    public getSimilarCareers(id: number) {

        let url = ConfigService.getAPI() + this._job_details_url + '/' + id + '/similar_careers';
        url += (this.authService.getCurrLang() === ConfigService.langHash['arabic']) ? '?ar=true' :
            '';
        return this._http.get(url, this.AuthHeader)
            .map((res) => {
                return {
                    similar_jobs: this._getBuildSimilarJobs(res['job']),
                    similar_companies: this._getBuildSimilarCompanies(res['job'])
                };
            });

    }

    public getJobDetails(id: number): Observable<any> {

        let url = '';
        if (this.getCheckPublic()) {
            url = ConfigService.getAPI() + this._job_details_url + '/' + id;
        } else {
            url = ConfigService.getAPI() + this._job_details_url + '/' + id + '/show_details';
        }
        url += (this.authService.getCurrLang() === ConfigService.langHash['arabic']) ? '?ar=true' :
            '';

        return this._http.get(url, this.AuthHeader)
            .map((res) => this._getBuildJobDetails(res));
    }

    public _getSavedSearchJobs(jobList, checkallFlag) {
        let jobListArry = new Array();

        jobList['saved_job_searches'].forEach((selJob) => {

            let selJobSearchObj = new JobSearch();
            selJobSearchObj.id = selJob.id;
            selJobSearchObj.title = selJob.title;
            selJobSearchObj.alertType = selJob.alert_type['name'];
            selJobSearchObj.web_url = selJob.web_url;
            selJobSearchObj.alertTypeId = selJob.alert_type['id'];
            selJobSearchObj.dateCreated = selJob.created_at;
            if (checkallFlag) {
                selJobSearchObj.checked = true;
            }

            jobListArry.push(selJobSearchObj);

        });

        let jobOnlyListArry = {jobs: jobListArry, meta: jobList['meta']};

        return jobOnlyListArry;
    }

    public applyJobNoAttach(jobId: number): Observable<any> {

        let postDate = {job_application: {job_id: jobId}};
        let url = ConfigService.getAPI() + 'jobseekers/' + this.userId + '/job_applications';

        return this._http.post(url, JSON.stringify(postDate), this.AuthHeader2)
            .map((res) => res);
    }

    public _getBuildCharts(stats) {

        let jobGraphs1 = new JobGraphs();
        jobGraphs1.mainLabel = 'by_country';

        jobGraphs1.options = {colors: ['#142130', '#26384c', '#374b61', '#4b6076', '#f1f1f1']};
        jobGraphs1.data = Array(['Heading', '']);
        let cnt1 = 0;

        stats.analysis_applications_by_country.labels.forEach((sel) => {

            jobGraphs1.data.push([sel, stats.analysis_applications_by_country.data[cnt1]]);
            cnt1++;
        });

        let jobGraphs2 = new JobGraphs();
        jobGraphs2.mainLabel = 'by_education_level';

        jobGraphs2.options = {colors: ['#142130', '#26384c', '#374b61', '#4b6076', '#f1f1f1']};

        jobGraphs2.data = Array(['Heading', '']);
        let cnt2 = 0;

        stats.analysis_applications_by_job_education.labels.forEach((sel) => {

            jobGraphs2.data.push([sel, stats.analysis_applications_by_job_education.data[cnt2]]);
            cnt2++;
        });

        let jobGraphs3 = new JobGraphs();
        jobGraphs3.mainLabel = 'by_sector';

        jobGraphs3.options = {colors: ['#31596c', '#40697d', '#507a8e', '#648b9d', '#f1f1f1']};

        jobGraphs3.data = Array(['Heading', '']);
        let cnt3 = 0;

        stats.analysis_applications_by_sector.labels.forEach((sel) => {
            jobGraphs3.data.push([sel, stats.analysis_applications_by_sector.data[cnt3]]);
            cnt3++;
        });

        let jobGraphs4 = new JobGraphs();
        jobGraphs4.mainLabel = 'by_age_group';

        jobGraphs4.options = {colors: ['#629ad1', '#87b6e4', '#9fc9f2', '#badcfd', '#f1f1f1']};
        jobGraphs4.data = Array(['Heading', '']);
        let cnt4 = 0;

        stats.analysis_applications_by_age.labels.forEach((sel) => {
            jobGraphs4.data.push([sel, stats.analysis_applications_by_age.data[cnt4]]);
            cnt4++;
        });

        return {
            country: jobGraphs1,
            education: jobGraphs2,
            sector: jobGraphs3,
            age: jobGraphs4
        };
    }

}
