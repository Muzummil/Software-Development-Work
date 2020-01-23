import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../shared/config.service';
import { AccountService } from '../../core/account/services/account.service';

import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

// Models
import { Company, CompanyPicture, Team } from '../../shared/models/Company';
import { Job } from '../../jobseekers/job/models/Job';

import 'rxjs/add/operator/map';
import * as moment from 'moment';
import { LoaderService } from '../../shared/services/loader.service';

@Injectable()
export class CompanyService {

    public static    allActiveJobsListCache$ = new BehaviorSubject( null);
    public static    allActiveJobsListDirty: boolean = true;
    public _url = 'all_companies.html';
    public _url_company = 'companies';
    public _url_jobseekers = 'jobseekers';
    public _url_jobs = 'jobs';
    public _url_company_user = 'company_users';

    // variables
    public cachedTimeSec: number;
    // Used in jobDetails Component Employer
    public indeed_saudi_fix = 20000;
    public indeed_kuwait_fix = 50000;
    public indeed_uk_fix = 100000;

    // cache
    public allCompaniesCache = null;
    public allCompaniesURLCache = null;
    public companyBranches = null;

    // cache
    public companiesUsersCache = new BehaviorSubject(null);
    public companiesUsersCacheDirty = true;


    // members
    public authService;

    public _paramHash = {
        locations: 'q[co_in][]=',
        cities: 'q[ci_in][]=',
        sectors: 'q[se_in][]=',
        fareas: 'q[fa_in][]=',
        jobtypes: 'q[jt_in][]=',
        salarylevels: 'q[sr_in][]=',
        edulevels: 'q[je_in][]=',
        explevels: 'q[jel_in][]=',
        name: 'q[name_cont]=',
        companies: 'q[id_in][]='
    };

    constructor(public _http: HttpClient,
                @Inject(AccountService) authService: AccountService) {

        this.authService = authService;

    }

    public _getSpaceToDash(name: string) {
        return name.trim().replace(/\s+/g, '-');
    }

    public deleteProfileImage(user_id = null) {
        return this._http.delete(ConfigService.getAPI() + 'companies/' + user_id
            + '/delete_avatar', this.authService.AuthHeader3()).map((res) => res);
    }

    public deleteProfileCoverImage(user_id = null) {
        return this._http.delete(ConfigService.getAPI() + 'companies/' + user_id
            + '/delete_cover', this.authService.AuthHeader3()).map((res) => res);
    }

    public getCompanyProfileImage() {
        return (AccountService.profileHeader && AccountService.profileHeader.avatar) ?
            AccountService.profileHeader.avatar : null;
    }

    public _getBuildCompany(data, mode = '') {
        let companyList = Array();

        data.companies.forEach((res) => {
            let company = new Company();

            company.id = res.id;
            company.name = res.name;
            company.name_url = this._getSpaceToDash(res.name);

            company.sector = res.sector;
            company.jobsOpen = res.opened_jobs_count;

            company.follower = res.followers_count;
            company.followingFlag = res.is_follow_by_current_user;

            company.country = res.current_country;
            company.city = res.current_city;
            company.cityId = ((res.current_city != null)) ? res.current_city['id'] : null;
            company.profileImage = res.avatar;
            company.coverType = res.cover_content_type;
            company.coverScreenShot = res.video_cover_screenshot;
            company.managementVideo = res.video_our_management;

            companyList.push(company);
        });
        return {companies: companyList, meta: data['meta']};
    }

    public _getBuildCompanyJobs(data) {

        let jobList = Array();

        data.forEach((val) => {
            let job = new Job();
            val = this.clean(val);
            job.id = val.id;
            job.title = val.title;
            job.title_url = this._getSpaceToDash(val.title);
            job.avatar = val.company['avatar'];
            job.deleted = val.deleted;
            job.branch = val.branch;
            job.endDate = val.end_date;
            job.postDate = val.created_at;
            job.numberApplicants = val.count_applications;
            job.appliedFlag = val.is_applied_by_current_user;
            job.is_featured = val.is_featured;
            job.sector = val.sector['name'];
            job.city = val.city.name;
            job.cityId = val.city.id;
            job.countryId = val.country.id;
            job.countryCountry = val.country.name;
            job.sectorId = val.sector['id'];
            job.viewCount = val.views_count;
            job.jobStatus = val.status;
            job.user = val.user;
            job.appliedDate = val.applied_date;
            job.is_internal_hiring = val.is_internal_hiring;
            jobList.push(job);

        });

        return jobList;

    }

    public _getBuildCompanyCulture(data) {

        let pictureList = Array();

        data.forEach((val) => {

            let picture = new CompanyPicture();
            picture.id = val.id;
            picture.name = val.title;
            picture.description = val.title;
            picture.image_url = val.avatar;
            picture.image_thumb_url = val.avatar;
            pictureList.push(picture);

        });

        return pictureList;

    }

    public _getBuildCompanyMembers(data) {

        let teamList = Array();

        data.forEach((val) => {

            let team = new Team();
            team.id = val.id;
            team.name = val.name;
            team.designation = val.position;
            team.googlePlusUrl = val.google_plus_url;
            team.linkedinUrl = val.linkedin_url;
            team.facebookUrl = val.facebook_url;
            team.twitterUrl = val.twitter_url;
            team.profileImage = val.avatar;
            team.profileVideo = val.video;
            teamList.push(team);
        });

        return teamList;
    }

    public _getBuildCompanyDetails(data) {

        let company = new Company();
        company.id = data.id;
        company.name = data.name;
        company.name_url = this._getSpaceToDash(data.name);
        company.summary = data.summary;
        company.aboutUs = data.summary;
        if (data.sector) {
            company.sectorId = data.sector.id;
            company.sector = data.sector.name;
        }

        company.facebookUrl = data.facebook_page_url;
        company.linkedInUrl = data.linkedin_page_url;
        company.twitterUrl = data.twitter_page_url;
        company.googlePlusUrl = data.google_plus_page_url;
        company.contactEmail = data.contact_email;

        company.follower = data.followers_count;
        company.followingFlag = data.is_followed_by_current_user;
        company.establishmentDate = data.establishment_date;
        company.coverImage = data.cover;
        company.maleCount = data.total_male_employees;
        company.femaleCount = data.total_female_employees;
        company.coverType = data.cover_content_type;
        company.coverScreenShot = data.video_cover_screenshot;
        company.managementVideo = data.video_our_management;
        company.profileImage = data.avatar;
        company.addressLine = data.address_line1;
        company.addressLine2 = data.address_line2;
        company.poBox = data.po_box;
        company.ownerDesignation = data.owner_designation;
        company.ownerName = data.owner_name;
        company.isPremium = data.is_premium;

        company.city = data.current_city;

        company.country = data.current_country;
        company.websiteUrl = data.website;
        company.phoneNo = data.phone;
        company.faxNo = data.fax;
        company.lat = data.latitude;
        company.long = data.longitude;
        if (data.type) {
            company.companyType = data.type.name;
            company.companyTypeId = data.type.id;
        }
        if (data.size) {
            company.companySizeId = data.size.id;
            company.companySize = data.size.size;
        }
        if (data.classification) {
            company.classification = data.classification.name;
            company.classificationId = data.classification.id;
        }

        let jobList = Array();
        company.jobList = jobList;

        let teamList = Array();
        company.team = teamList;

        let pictureList = Array();

        company.pictures = pictureList;
        return company;
    }

    public getGoogleCoOrdinates(address = '') {

        return this._http.get('https://maps.google.com/maps/api/geocode/json?address=' +
            address + '&key=' + ConfigService.GOOGLE_MAP_API_KEY)
            .map((res) => res);

    }

    public getDeleteJob(companyId: number, jobId: number, currentPage: number = 1) {

        return this._http.delete(ConfigService.getAPI() + this._url_jobs + '/' +
            jobId, this.authService.AuthHeader3())
            .map((res) => res);

    }

    public getCompanyJob(id: number) {
        let url = ConfigService.getAPI() + this._url_jobs + '/' + id +
            '/show_details';
        url += (this.authService.getCurrLang() === ConfigService.langHash['arabic']) ? '?ar=true' :
            '';
        return this._http.get(url, this.authService.AuthHeader())
            .map((res) => res);
    }

    public getCompanyBranches() {
        let url = ConfigService.getAPI() + this._url_company + '/' + this.authService.getCompanyId()
            + '/branches';
        url += (this.authService.getCurrLang() === ConfigService.langHash['arabic']) ? '?ar=true' :
            '';
        if (this.companyBranches) {
            return Observable.of(this.companyBranches);
        } else {
            return this._http.get(url, this.authService.AuthHeader2())
                .map((res) => {
                    this.companyBranches = res['branches'];
                    return res['branches'];
                });
        }
    }
    public getCompanyJobAnalysis(id: number) {

        let url = ConfigService.getAPI() + this._url_jobs + '/' + id
            + '/job_applications_analysis';
        url += (this.authService.getCurrLang() === ConfigService.langHash['arabic']) ? '?ar=true' :
            '';
        return this._http.get(url, this.authService.AuthHeader())
            .map((res) => res);
    }

    public getCompanyJobsWithFilter(id: number, params = [], pageNo = 1) {

        let paramsUrl = '?page=' + pageNo;
        params.forEach((selparam) => {

            if (selparam['name'] === 'sector') {
                paramsUrl += '&q[se_eq]=' + selparam['id'];
            } else if (selparam['name'] === 'farea') {
                paramsUrl += '&q[fa_eq]=' + selparam['id'];
            } else if (selparam['name'] === 'jobtypes') {
                paramsUrl += '&q[jt_eq]=' + selparam['id'];
            } else if (selparam['name'] === 'jobstatus') {
                if (selparam['id'] === 'draft') {
                    paramsUrl += '&q[js_eq]=1&q[del_eq]=false';
                } else if (selparam['id'] === 'expired') {
                    paramsUrl += '&q[js_not_eq]=1&q[act_eq]=true&q[del_eq]=false&q[end_date_lt]='
                        + Date();
                } else if (selparam['id'] === 'active') {
                    paramsUrl += '&q[act_eq]=true&q[del_eq]=false&q[end_date_gteq]=' + Date();
                } else if (selparam['id'] === 'deleted') {
                    paramsUrl += '&q[del_eq]=true';
                }

            } else if (selparam['name'] === 'title') {
                paramsUrl += '&q[ti_cont]=' + selparam['value'];
            }
        });

        let headers = (this.authService.getAuth()) ? this.authService.AuthHeader() : '';
        let url = ConfigService.getAPI() + this._url_company + '/' + id
            + '/' + 'jobs' + paramsUrl;
        url += (this.authService.getCurrLang() === ConfigService.langHash['arabic']) ? '&ar=true' :
            '';
        return this._http.get(url, headers)
            .map((res) => {
                let rnt = [this._getBuildCompanyJobs(res['jobs']), res['meta']];
                return rnt;
            });
    }

    public clean(obj) {
        for (let propName in obj) {

            if (obj[propName] === null || obj[propName] === undefined) {

                if (propName !== 'views_count' && propName !== 'applied_date') {
                    obj[propName] = {};
                } else {
                    obj[propName] = 0;
                }
            }
        }
        return obj;
    }

    public addCompanyUserDetails(params) {

        return this._http.post(ConfigService.getAPI() + this._url_company_user, params,
            this.authService.AuthHeader2())
            .map((res) => res);
    }

    public updateCompanyUserDetails(employerId: number, params) {

        return this._http.put(ConfigService.getAPI() + this._url_company_user + '/'
            + employerId, params, this.authService.AuthHeader2())
            .map((res) => res);
    }

    public getAddJobs(postJson) {
        return this._http.post(ConfigService.getAPI() + 'jobs/',
            postJson, this.authService.AuthHeader2())
            .map((res) => {CompanyService.allActiveJobsListDirty = true; return res; });
    }

    public getUpdateJobs(jobId: number, postJson) {

        return this._http.put(ConfigService.getAPI() + 'jobs/'
            + jobId, postJson, this.authService.AuthHeader2())
            .map((res) => {CompanyService.allActiveJobsListDirty = true; return res; });
    }

    public getCompanyUserDetails(employerId: number) {

        let url = ConfigService.getAPI() + this._url_company_user + '/' + employerId;
        url += (this.authService.getCurrLang() === ConfigService.langHash['arabic']) ? '?ar=true' :
            '';
        return this._http.get(url, this.authService.AuthHeader2())
            .map((res) => res);
    }

    public getDeleteCompanyUser(employerId: number) {

        return this._http.delete(ConfigService.getAPI() + this._url_company_user
            + '/' + employerId, this.authService.AuthHeader3())
            .map((res) => res);
    }

    public getCachedCompanyUsers(companyId: number, pageNo: number, all: boolean = false): any {

        if (this.companiesUsersCacheDirty) {
            this.companiesUsersCacheDirty = false;
            return this.getCompanyUsers(companyId, pageNo, all);
        } else {
            return this.companiesUsersCache;
        }

    }

    public getCompanyUsers(companyId: number, pageNo: number, all: boolean = false) {
        if (all === true) {
            let url = ConfigService.getAPI() + this._url_company + '/' + companyId
                + '/users?all=' + true;
            url += (this.authService.getCurrLang() === ConfigService.langHash['arabic'])
                ? '&ar=true' : '';
            return this._http.get(url, this.authService.AuthHeader())
                .map((res) => {
                    this.companiesUsersCache.next(res);
                    return res;
                });
        } else {
            let url = ConfigService.getAPI() + this._url_company
                + '/' + companyId + '/users?page=' + pageNo;
            url += (this.authService.getCurrLang() === ConfigService.langHash['arabic'])
                ? '&ar=true' : '';
            return this._http.get(url, this.authService.AuthHeader())
                .map((res) => {
                    this.companiesUsersCache.next(res);
                    return res;
                });
        }

    }

    public getCompanyEmployerJobs(employerId: number, pageNo: number = 1) {
        let url = ConfigService.getAPI() + this._url_company_user
            + '/' + employerId + '/jobs?page=' + pageNo;
        url += (this.authService.getCurrLang() === ConfigService.langHash['arabic'])
            ? '&ar=true' : '';
        return this._http.get(url, this.authService.AuthHeader())
            .map((res) => res);

    }

    public getCompanyEmployerAllActiveJobs(employerId: number): Observable<any> {
        if (CompanyService.allActiveJobsListDirty) {
            CompanyService.allActiveJobsListDirty = false;

            let url = ConfigService.getAPI() + this._url_company
                + '/' + employerId + '/jobs?all=true&q[active_eq]=true&q[job_status_id_eq]=2&' +
                '&q[deleted_eq]=false' +
                'q[start_date_lteq]=' + moment(new Date()).format('DD/MM/YYYY')
                + '&q[end_date_gteq]=' + moment(new Date()).format('DD/MM/YYYY');
            url += (this.authService.getCurrLang() === ConfigService.langHash['arabic'])
                ? '&ar=true' : '';
            return this._http.get(url, this.authService.AuthHeader())
                .map((res) => {
                    CompanyService.allActiveJobsListCache$.next(res);
                    return res;
                });
        } else {
            return CompanyService.allActiveJobsListCache$;
        }

    }

    public getCompanyEmployerBlogs(employerId: number, pageNo: number = 1) {
        let url = ConfigService.getAPI() + this._url_company_user
            + '/' + employerId + '/blogs?page=' + pageNo;
        url += (this.authService.getCurrLang() === ConfigService.langHash['arabic'])
            ? '&ar=true' : '';
        return this._http.get(url, this.authService.AuthHeader())
            .map((res) => res);

    }

    public getOfferLetter(jobAppId, title, content, fileName) {

        let returnObs = new BehaviorSubject(null);
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                return returnObs.next('success');
            } else {
                return returnObs.next('error');
            }
        };

        let url = ConfigService.getAPI() + 'job_applications/' + jobAppId
            + '/offer_letters/generate';
        let params = {offer_letter: {title, content}};
        xhr.open('POST', url, this.authService.AuthHeader2());

        xhr.setRequestHeader('Authorization', this.authService.getAuthKey());
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.responseType = 'arraybuffer';
        xhr.onload = function (e) {
            if (this['status'] === 200) {
                let blob = new Blob([this['response']], {type: 'application/pdf'});
                let link = document.createElement('a');
                // Add the element to the DOM
                document.body.appendChild(link);
                link.setAttribute('type', 'hidden'); // make it hidden if needed

                link.href = window.URL.createObjectURL(blob);
                link['download'] = fileName.replace(/\s/g, '') + '.pdf';
                link.click();
            }
        };

        xhr.send(JSON.stringify(params));
        return returnObs;

    }

    public getCompanyAnalytics(id: number) {
        let url = ConfigService.getAPI() + this._url_company + '/' + id + '/' + 'show_analytics';
        url += (this.authService.getCurrLang() === ConfigService.langHash['arabic'])
            ? '?ar=true' : '';
        return this._http.get(url)
            .map((res) => res['company_analytics']);
    }

    public getCompanyCulture(id: number) {

        let url = ConfigService.getAPI() + this._url_company + '/' + id + '/'
            + 'cultures';
        url += (this.authService.getCurrLang() === ConfigService.langHash['arabic'])
            ? '?ar=true' : '';
        return this._http.get(url)
            .map((res) => this._getBuildCompanyCulture(res['cultures']));
    }

    public getDeleteCultureMember(companyId: number, cultureMemberId: number) {

        return this._http.delete(ConfigService.getAPI() + this._url_company + '/'
            + companyId + '/' + 'cultures/' + cultureMemberId, this.authService.AuthHeader3())
            .map((res) => this._getBuildCompanyCulture(res['cultures']));
    }

    public updateCompanyCulture(companyId: number, cultureId: number, postData) {

        if (cultureId) {
            return this._http.put(ConfigService.getAPI() + this._url_company
                + '/' + companyId + '/' + 'cultures/' + cultureId, JSON.stringify(postData),
                this.authService.AuthHeader2())
                .map((res) => this._getBuildCompanyCulture([res['culture']]));
        } else {
            return this._http.post(ConfigService.getAPI() +
                this._url_company + '/' + companyId + '/' + 'cultures/', JSON.stringify(postData),
                this.authService.AuthHeader2())
                .map((res) => this._getBuildCompanyCulture([res['culture']]));
        }

    }

    public getDeleteTeamMember(companyId: number, teamMemberId: number) {
        return this._http.delete(ConfigService.getAPI() + this._url_company + '/'
            + companyId + '/' + 'company_members/' + teamMemberId, this.authService.AuthHeader3())
            .map((res) => this._getBuildCompanyMembers(res['company_members']));
    }

    public updateCompanyTeamMember(companyId: number, teamMemberId: number, postData) {

        if (teamMemberId) {
            return this._http.put(ConfigService.getAPI() + this._url_company + '/'
                + companyId + '/' + 'company_members/' + teamMemberId, JSON.stringify(postData),
                this.authService.AuthHeader2())
                .map((res) => this._getBuildCompanyMembers([res['company_member']]));
        } else {
            return this._http.post(ConfigService.getAPI() + this._url_company + '/'
                + companyId + '/' + 'company_members/', JSON.stringify(postData),
                this.authService.AuthHeader2())
                .map((res) => this._getBuildCompanyMembers([res['company_member']]));
        }

    }

    public getCompanyTeam(id: number) {
        let url = ConfigService.getAPI() + this._url_company + '/' + id + '/' + 'company_members';
        url += (this.authService.getCurrLang() === ConfigService.langHash['arabic'])
            ? '?ar=true' : '';
        return this._http.get(url, this.authService.AuthHeader())
            .map((res) => this._getBuildCompanyMembers(res['company_members']));
    }

    public getCompanyDetails(id: number, isPublic: boolean = false) {
        if (isPublic) {
            let url = ConfigService.getAPI() + this._url_company + '/' + id;
            url += (this.authService.getCurrLang() === ConfigService.langHash['arabic'])
                ? '?ar=true' : '';
            return this._http.get(url)
                .map((res) => this._getBuildCompanyDetails(res['company']));

        } else {
            let url = ConfigService.getAPI() + this._url_company + '/'
                + id + '/show_details';
            url += (this.authService.getCurrLang() === ConfigService.langHash['arabic'])
                ? '?ar=true' : '';
            return this._http.get(url, this.authService.AuthHeader())
                .map((res) => this._getBuildCompanyDetails(res['company']));

        }
    }

    public updateCompanyDetails(id: number, companyData) {
        return this._http.put(ConfigService.getAPI() + this._url_company + '/'
            + id, JSON.stringify(companyData), this.authService.AuthHeader2())
            .map((res) => this._getBuildCompanyDetails(res['company']));

    }

    public _onBuildFilterParams(filterList) {
        let queryString: string = '';
        if (!filterList) {
            return queryString;
        }

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
        if (filterList['name']) {
            queryString += this._paramHash.name + filterList['name'] + '&';
        }

        return queryString;
    }

    public getAllCompanyList(orderString = '', dataVal: any = null, page: number = 1) {
        let searchQry = '';

        if (dataVal != null) {
            searchQry = this._onBuildFilterParams(dataVal);
        }
        let url = ConfigService.getAPI() + this._url_company + '?page=' + page + '&' + searchQry;
        url += (this.authService.getCurrLang() === ConfigService.langHash['arabic'])
            ? 'ar=true&' : '';
        if (orderString != null && orderString !== '') {
            url += 'order=' + orderString + '&';
        }

        if (this.allCompaniesCache != null && this.allCompaniesURLCache === url) {

            return Observable.of(this.allCompaniesCache);
        }

        return this._http.get(url, this.authService.AuthHeader())
            .map((res) => {
                this.allCompaniesCache = this._getBuildCompany(res);
                this.allCompaniesURLCache = url;
                return this.allCompaniesCache;
            });
    }

    public getFollowCompany(companyId) {

        let geturl = ConfigService.getAPI() + this._url_company + '/' + companyId + '/' + 'follow';
        return this._http.put(geturl, '', this.authService.AuthHeader2())
            .map((res) => res['company']);
    }

    public getUnfollowCompany(companyId) {
        let geturl = ConfigService.getAPI() + this._url_company + '/' + companyId
            + '/' + 'unfollow';
        return this._http.put(geturl, '', this.authService.AuthHeader2())
            .map((res) => res['company']);
    }

    public getJobseekersAppliedAnalysis(jobId) {

        let geturl = ConfigService.getAPI() + this._url_jobs + '/' + jobId
            + '/job_applications_analysis';
        geturl += (this.authService.getCurrLang() === ConfigService.langHash['arabic'])
            ? '?ar=true' : '';
        return this._http.get(geturl, this.authService.AuthHeader())
            .map((res) => res);
    }

    public getJobseekersApplied(jobId, pageNo = 1, orderBy, postQuery = '') {

        let geturl = ConfigService.getAPI() + this._url_jobs + '/' + jobId
            + '/applicants?page=' + pageNo + '&order=' + orderBy + postQuery;
        geturl += (this.authService.getCurrLang() === ConfigService.langHash['arabic'])
            ? '&ar=true' : '';
        return this._http.get(geturl, this.authService.AuthHeader())
            .map((res) => res);
    }

    public getJobseekersSuggested(jobId, pageNo = 1, orderBy, postQuery = '') {
        let geturl = ConfigService.getAPI() + this._url_jobs + '/' + jobId
            + '/suggested_jobseekers?page=' + pageNo + '&order=' + orderBy + postQuery;
        geturl += (this.authService.getCurrLang() === ConfigService.langHash['arabic'])
            ? '&ar=true' : '';
        return this._http.get(geturl, this.authService.AuthHeader())
            .map((res) => res);
    }

    public getCompanyFollowers(companyId, pageNo = 1, searchString = '', params = {}) {
        let urlParams = '';
        if (searchString !== '') {
            urlParams += '&q[full_name_cont]=' + searchString;
        }

        for (let key in params) {
            if (params.hasOwnProperty(key)) {

                if (key === 'locations') {
                    params[key].toString().split(',').forEach((res) => {
                        urlParams += '&q[loc_co_in][]=' + res;
                    });

                }
                if (key === 'cities') {
                    params[key].toString().split(',').forEach((res) => {
                        urlParams += '&q[loc_ci_in][]=' + res;
                    });

                }
                if (key === 'sectors') {
                    params[key].toString().split(',').forEach((res) => {
                        urlParams += '&q[se_in][]=' + res;
                    });

                }
            }
        }

        let geturl = ConfigService.getAPI() + this._url_company + '/' + companyId
            + '/' + 'followers?page=' + pageNo + urlParams;
        geturl += (this.authService.getCurrLang() === ConfigService.langHash['arabic'])
            ? '&ar=true' : '';
        return this._http.get(geturl, this.authService.AuthHeader())
            .map((res) => res);

    }
}
