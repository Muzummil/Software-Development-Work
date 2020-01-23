import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../shared/config.service';

import { Injectable, Inject } from '@angular/core';
import { AccountService } from '../account/services/account.service';

// Models
import {
    Job,
    JobStats,
    JobSearchTags,
    BenefitList,
    JobGraphs
} from '../../jobseekers/job/models/Job';
import { JobSearch } from '../../jobseekers/job/models/JobSearch';
import { Company } from '../../shared/models/Company';

@Injectable()
export class JobService {

    public _url = 'jobs.html';
    public _invited_applicants = 'invited_jobseekers';

    public _job_details_url = 'jobs';

    // members
    public authService;

    // Cache
    public allJobsCache = null;
    public myJobsCache = null;
    public suggestedJobsCache = null;
    public suggestedJobsCacheURL = null;
    public savedJobsCache = null;
    public savedSearchJobsCache = null;
    public allJobsURLCache = null;
    public myJobsURLCache = null;

    constructor(public _http: HttpClient, @Inject(AccountService) authService: AccountService) {

        this.authService = authService;

    }

    public applyJobNoAttach(jobId: number) {

        let postDate = { job_application: { job_id: jobId } };
        let url = ConfigService.getAPI() + 'jobseekers/' + this.authService.getUserId() +
            '/job_applications';

        return this._http.post(url, JSON.stringify(postDate), this.authService.AuthHeader2())
            .map((res) => res);
    }

    public _getBuildJobCharts(data) {
        let jobCharts = this._getBuildCharts(data['job']);
        return { jobCharts };
    }

    public _getBuildJobDetails(data) {
        let selJob = data.job;
        let selJobObj = new Job();

        selJobObj.id = selJob.id;
        selJobObj.title = selJob.title;
        selJobObj.startDate = selJob.start_date;
        selJobObj.endDate = selJob.end_date;

        selJobObj.appliedDate = (selJob.applied_date == null) ? null :
            new Date(selJob.applied_date);
        selJobObj.matchingPercent = selJob.matching_percentage;
        selJobObj.probabilitySuccess = selJob.probability_success;

        selJobObj.educationLevel = selJob.job_education.name;
        selJobObj.educationLevelId = selJob.job_education.id;

        selJobObj.employmentType = selJob.job_experience_level.name;
        selJobObj.employmentTypeId = selJob.job_experience_level.id;

        selJobObj.experienceFrom = selJob.experience_from;
        selJobObj.experienceTo = selJob.experience_to;
        selJobObj.drivingLicense = (selJob.license_required) ? true : false;

        selJobObj.salaryFrom = selJob.salary_from;
        selJobObj.isSaved = selJob.is_saved_by_current_user;
        selJobObj.salaryTo = selJob.salary_to;
        selJobObj.educationLevelId = selJob.job_education.id;
        selJobObj.educationLevel = selJob.job_education.name;
        selJobObj.genderType = selJob.gender_type;
        selJobObj.viewCount = selJob.views_count;
        selJobObj.numberApplicants = selJob.count_applications;

        selJobObj.rankListHigh = selJob.count_applications;

        selJobObj.jobDescription = selJob.description;
        selJobObj.jobRequirement = selJob.requirements;

        selJob.languages.forEach((x) => {
            selJobObj.languageList.push({ id: x.id, name: x.name });
        });

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

        return { selectedJobs: selJobObj };

    }

    public sendBulkFeedBack(id, from, to, applStatus, comment) {

        let url = ConfigService.getAPI() + this._job_details_url + '/' + id +
            '/job_application_status_changes/create_bulk';

        let postDate = {
            job_application_status_change: {
                comment,
                job_application_status_id: applStatus
            }, start_matching_percentage: from, end_matching_percentage: to
        };

        return this._http.post(url, JSON.stringify(postDate), this.authService.AuthHeader2())
            .map((res) => res);

    }

    public getJobDetails(id: number) {

        let url = ConfigService.getAPI() + this._job_details_url + '/' + id + '/show_details';
        url = this.authService.getBuildArabicUrl(url);
        return this._http.get(url, this.authService.AuthHeader())
            .map((res) => this._getBuildJobDetails(res));
    }

    public getJobApplicantsFilter(id: number) {
        let url = ConfigService.getAPI() + this._job_details_url + '/' + id + '/get_filters_with_applicants_count';
        url = this.authService.getBuildArabicUrl(url);

        return this._http.get(url, this.authService.AuthHeader())
            .map((res) => res);
    }

    public getJobApplicationStats(id: number) {

        let url = ConfigService.getAPI() + this._job_details_url + '/' + id +
            '/applicant_analytics';
        url = this.authService.getBuildArabicUrl(url);

        return this._http.get(url, this.authService.AuthHeader())
            .map((res) => [res['job']['total_applicants'], this._getBuildJobCharts(res)]);

    }


    public _getBuildCharts(stats) {
        let jobGraphs1 = new JobGraphs();
        jobGraphs1.mainLabel = 'by_country';

        jobGraphs1.options = { colors: ['#142130', '#26384c', '#374b61', '#4b6076', '#f1f1f1'] };
        jobGraphs1.data = Array(['Heading', '']);
        let cnt1 = 0;

        stats.analysis_applications_by_country.labels.forEach((sel) => {

            jobGraphs1.data.push([sel, stats.analysis_applications_by_country.data[cnt1]]);
            cnt1++;
        });

        let jobGraphs2 = new JobGraphs();
        jobGraphs2.mainLabel = 'by_education_level';

        jobGraphs2.options = { colors: ['#142130', '#26384c', '#374b61', '#4b6076', '#f1f1f1'] };

        jobGraphs2.data = Array(['Heading', '']);
        let cnt2 = 0;

        stats.analysis_applications_by_job_education.labels.forEach((sel) => {

            jobGraphs2.data.push([sel, stats.analysis_applications_by_job_education.data[cnt2]]);
            cnt2++;
        });

        let jobGraphs3 = new JobGraphs();
        jobGraphs3.mainLabel = 'by_sector';

        jobGraphs3.options = { colors: ['#31596c', '#40697d', '#507a8e', '#648b9d', '#f1f1f1'] };

        jobGraphs3.data = Array(['Heading', '']);
        let cnt3 = 0;

        stats.analysis_applications_by_sector.labels.forEach((sel) => {
            jobGraphs3.data.push([sel, stats.analysis_applications_by_sector.data[cnt3]]);
            cnt3++;
        });

        let jobGraphs4 = new JobGraphs();
        jobGraphs4.mainLabel = 'by_age_group';

        jobGraphs4.options = { colors: ['#629ad1', '#87b6e4', '#9fc9f2', '#badcfd', '#f1f1f1'] };
        jobGraphs4.data = Array(['Heading', '']);
        let cnt4 = 0;

        stats.analysis_applications_by_age.labels.forEach((sel) => {
            jobGraphs4.data.push([sel, stats.analysis_applications_by_age.data[cnt4]]);
            cnt4++;
        });

        let jobGraphs5 = new JobGraphs();
        if (stats['analysis_applications_by_nationality']) {

            jobGraphs5.mainLabel = 'By Nationality';

            jobGraphs5.options = { colors: ['#142130', '#26384c', '#374b61', '#4b6076', '#f1f1f1'] };
            jobGraphs5.data = Array(['Heading', '']);
            let cnt1 = 0;

            stats.analysis_applications_by_nationality.labels.forEach((sel) => {

                jobGraphs5.data.push([sel, stats.analysis_applications_by_nationality.data[cnt1]]);
                cnt1++;
            });
        }
        let jobGraphs6 = new JobGraphs();
        if (stats['analysis_applications_by_gender']) {

            jobGraphs6.mainLabel = 'By Gender';

            jobGraphs6.options = { colors: ['#142130', '#26384c', '#374b61', '#4b6076', '#f1f1f1'] };
            jobGraphs6.data = Array(['Heading', '']);
            let cnt1 = 0;

            stats.analysis_applications_by_gender.labels.forEach((sel) => {

                jobGraphs6.data.push([sel, stats.analysis_applications_by_gender.data[cnt1]]);
                cnt1++;
            });
        }

        return {
            country: jobGraphs1,
            education: jobGraphs2,
            sector: jobGraphs3,
            age: jobGraphs4,
            nationality: jobGraphs5,
            gender: jobGraphs6
        };
    }

    public sendApplyInvitation(postData: any) {

        return this._http.post(ConfigService.getAPI() + this._invited_applicants,
            postData, this.authService.AuthHeader2())
            .map((res) => res);
    }


    public changeCandidateJobStatus(postData: any, applicationId: number) {
        let url = ConfigService.getAPI() + 'job_applications/' + applicationId + '/job_application_status_changes';

        return this._http.post(url, JSON.stringify(postData),
            this.authService.AuthHeader2()).map((res) => res);
    }

    public getUniversitiesByName(searchName: string, jobId: number, exceptNames: any) {
        let exceptParams = "";
        if (exceptNames != [] && exceptNames != undefined && exceptNames.length > 0) {
            exceptNames.forEach(element => {
                exceptParams += "&q[school_not_in][]=" + element;
            });
        }
        let url = ConfigService.getAPI() + 'jobs/' + jobId + '/' + 'search_applicants_education_school?q[school_cont]=' + searchName + exceptParams;
        url = this.authService.getBuildArabicUrl(url);

        return this._http.get(url, this.authService.AuthHeader())
            .map((res) => res);
    }

    public getDegreeCourseByName(searchName: string, jobId: number, exceptNames: any) {
        let exceptParams = "";
        if (exceptNames != [] && exceptNames != undefined && exceptNames.length > 0) {
            exceptNames.forEach(element => {
                exceptParams += "&q[field_of_study_not_in][]=" + element;
            });
        }
        let url = ConfigService.getAPI() + 'jobs/' + jobId + '/' + 'search_applicants_education_field_study?q[field_of_study_cont]=' + searchName + exceptParams;
        url = this.authService.getBuildArabicUrl(url);

        return this._http.get(url, this.authService.AuthHeader())
            .map((res) => res);
    }
}
