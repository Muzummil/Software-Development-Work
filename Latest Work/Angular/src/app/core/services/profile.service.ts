import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ConfigService } from '../../shared/config.service';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ErrorHandling } from '../../core/services/errorHandling.service';
import { AccountService } from '../account/services/account.service';

let moment = require('moment-timezone');

@Injectable()
export class ProfileService {

    // Cache
    public static tagsListDirty: boolean = true;
    public static tagsListCache$ = new BehaviorSubject( null);

    public url = 'jobseekers/';
    public update_jobseeker_url = 'jobseekers/';
    public errorHandling;
    public authService;
    public userId: string;

    constructor(public _http: HttpClient,
                public _router: Router,
                @Inject(AccountService) authService: AccountService,
                @Inject(ErrorHandling) errorHandling: ErrorHandling) {

        this.authService = authService;
        this.errorHandling = errorHandling;
    }

    public getProfileObj(): any {
        return AccountService.profileCache;
    }

    public getProfileHeader(): any {
        return AccountService.profileHeader;
    }

    public setProfileHeader(full_name: string, avatar: string) {
        let names = full_name.split(' ');
        AccountService.profileHeader = {
            full_name,
            avatar,
            first_name: names[0],
            last_name: names[1]
        };
    }

    public getLogOutUser() {
        this.authService.getLogOutUser();
    }

    public getChangeStatusList(jobAppId = null) {

        let url = ConfigService.getAPI()
            + 'job_applications/' + jobAppId + '/job_application_status_changes';
        return this._http.get(this.authService.getBuildArabicUrl(url),
            this.authService.AuthHeader()).map((res) => res);

    }

    public postEduWork(postParams) {
        let url = ConfigService.getAPI() + this.url + this.authService.getUserId();
        return this._http.put(url, JSON.stringify(postParams),
            this.authService.AuthHeader2()).map((res) => {
                this.authService.setProfileCache(res['jobseeker_profile']);
                return res;
            });
    }

    public updateCombinedProfile(profile_data) {
        return this._http.put(this.authService.getBuildArabicUrl(ConfigService.getAPI()
            + this.url + this.authService.getUserId()),
            JSON.stringify(profile_data), this.authService.AuthHeader2())
            .map((res) => {
                this.authService.setProfileCache(res['jobseeker_profile']);
                let profile = res;
                let full_name = profile['jobseeker_profile']['first_name'] + ' ' +
                    profile['jobseeker_profile']['last_name'];
                this.setProfileHeader(full_name, profile['jobseeker_profile']['avatar']);
                this.authService.setProfileCache(profile['jobseeker_profile']);
                return profile;
            });
    }

    public getNoteList(jobAppId = null) {

        let url = ConfigService.getAPI() + 'job_applications/' + jobAppId + '/notes';
        return this._http.get(this.authService.getBuildArabicUrl(url),
            this.authService.AuthHeader()).map((res) => res);

    }

    public postApplicationFeedBack(jobId, status, comment, notifyMe = null) {
        let url = ConfigService.getAPI()
            + 'job_applications/' + jobId + '/job_application_status_changes';
        let postParams = {
            job_application_status_change: {
                job_application_status_id: status,
                comment
            }
        };
        if (notifyMe) {
            postParams['job_application_status_change']['notify_jobseeker'] = notifyMe;
        }
        return this._http.post(url, JSON.stringify(postParams),
            this.authService.AuthHeader2()).map((res) => res);
    }

    public postApplicationGenerateOfferLetter(jobId, status, comment, title, content,
                                              notifyMe = null) {

        let url = ConfigService.getAPI()
            + 'job_applications/' + jobId + '/job_application_status_changes';
        let postParams = {
            job_application_status_change: {
                job_application_status_id: status,
                comment,
                offer_letter_attributes: {title, content}
            }
        };
        if (notifyMe) {
            postParams['job_application_status_change']['notify_jobseeker'] = notifyMe;
        }
        return this._http.post(url, JSON.stringify(postParams),
            this.authService.AuthHeader2()).map((res) => res);
    }

    public postApplicationOfferLetter(jobId, status, comment, file, notifyMe = null) {

        return Observable.create((observer) => {

            let formData: FormData = new FormData();

            formData.append('job_application_status_change[job_application_status_id]', status);
            formData.append('job_application_status_change[comment]', comment);
            if (file) {
                formData.append(
                    'job_application_status_change[offer_letter_attributes][document]', file, file);
            }
            if (notifyMe) {
                formData.append('job_application_status_change[notify_jobseeker]', notifyMe);
            }

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

            let url = ConfigService.getAPI() +
                'job_applications/' + jobId + '/job_application_status_changes';
            let method = 'POST';

            xhr.open(method, url, true);
            xhr.setRequestHeader('Authorization', this.authService.getAuthKey());
            xhr.send(formData);
        });

    }

    public postApplicationInterview(jobId, status, comment, date,
                                    time, timeZone, duration, additionalComment,
                                    interviewee, mode, modevalue) {
        let url = ConfigService.getAPI() + 'job_applications/' + jobId +
            '/job_application_status_changes';
        let postParams = {
            job_application_status_change:
                {
                    job_application_status_id: status, comment: additionalComment,
                    interview_attributes: {
                        appointment: moment(date + ' ' + time).tz(timeZone),
                        time_zone: timeZone,
                        comment,
                        interviewer_id: parseInt(interviewee, 10),
                        channel: mode,
                        contact: modevalue,
                        duration,
                        status: 'invite'
                    }
                }
        };
        return this._http.post(url, JSON.stringify(postParams),
            this.authService.AuthHeader2()).map((res) => res);
    }

    public postNote(jobAppId = null, note = '') {

        let url = ConfigService.getAPI() + 'job_applications/' + jobAppId + '/notes';
        return this._http.post(url, JSON.stringify({note: {note}}),
            this.authService.AuthHeader2()).map((res) => {
            return res;
        });

    }

    // Get History for given Jobseeker
    public getHistory(userId, page = 1) {
        let url = ConfigService.getAPI() + this.url +
            userId + '/job_applications_history?page=' + page;

        return this._http.get(this.authService
            .getBuildArabicUrl(url), this.authService.AuthHeader());
    }

    public getTags(): Observable<any> {
        let url = ConfigService.getAPI() + 'hash_tags';

        if (ProfileService.tagsListDirty) {
            ProfileService.tagsListDirty = false;
            return this._http.get(this.authService
                .getBuildArabicUrl(url), this.authService.AuthHeader()).map((res) => {
                 ProfileService.tagsListCache$.next(res);
                return res;
            });
        } else {
            return ProfileService.tagsListCache$;
        }

    }

    public addUpdateDeleteTags(jobseekerId, tagList: any[]) {
        return this._http.post(this.authService
                .getBuildArabicUrl(ConfigService.getAPI() + 'jobseeker_hash_tags/create_bulk'),
            JSON.stringify({jobseeker_id: jobseekerId, hash_tags_attributes: tagList}),
            this.authService.AuthHeader2())
            .map((res) => {
                ProfileService.tagsListDirty = true;
                return res;
            });
    }


    public getProfile(userId: number = null, jobId: number = null, highlights: string = '') {

        let url = '';
        if (userId == null) {
            url = ConfigService.getAPI() + this.url + this.authService.getUserId()
                + '/display_profile';
        } else {
            url = ConfigService.getAPI() + this.url + userId + '/display_profile';
        }
        let urlJob = '';
        if (jobId != null) {
            urlJob = '?job_id=' + jobId;
        }
        if (highlights !== '') {

            if (urlJob === '') {
                urlJob = '?highlights=' + highlights;
            } else {
                urlJob = '&highlights=' + highlights;
            }

        }

        return this._http.get(this.authService
            .getBuildArabicUrl(url + urlJob), this.authService.AuthHeader())
            .map((res) => {

                let profile1 = res;
                let profile = profile1['jobseeker_profile'];

                if (profile == null) {
                    let error = {status: 404};
                    this.errorHandling.errorHandler(error);
                }

                if (!this.authService.getCheckEmployer()) {
                    AccountService.profileCache = profile;
                }

                if (!this.authService.getCheckEmployer()) {
                    let full_name = profile['first_name'] + ' ' + profile['last_name'];
                    this.setProfileHeader(full_name, profile['avatar']);
                }
                return profile;
            });
    }

    public updateMyInformation(info: any) {
        return this._http.put(this.authService.getBuildArabicUrl(ConfigService.getAPI() +
            this.update_jobseeker_url + this.authService.getUserId()),
            JSON.stringify({jobseeker: info}), this.authService.AuthHeader2())
            .map((res) => res);
    }

    public setDefaultCoverLetter(id: number) {
        return this._http.put(this.authService.getBuildArabicUrl(ConfigService.getAPI()
            + this.update_jobseeker_url + this.authService.getUserId()
            + '/jobseeker_coverletters/' + id),
            JSON.stringify({jobseeker_coverletter: {default: true}}),
            this.authService.AuthHeader2())
            .map((res) => res);
    }

    public setDefaultResume(id: number) {
        return this._http.put(this.authService.getBuildArabicUrl(ConfigService.getAPI()
            + this.update_jobseeker_url + this.authService.getUserId() + '/jobseeker_resumes/' + id),
            JSON.stringify({jobseeker_resume: {default: true}}), this.authService.AuthHeader2())
            .map((res) => res);
    }

    public updateContactDetails(contact: any) {
        return this._http.put(this.authService.getBuildArabicUrl(ConfigService.getAPI() +
            this.update_jobseeker_url + this.authService.getUserId()), JSON.stringify(contact),
            this.authService.AuthHeader2())
            .map((res) => res);
    }

    public updateTags(tags: any) {
        return this._http.post(this.authService
                .getBuildArabicUrl(ConfigService.getAPI() + this.url +
                    this.authService.getUserId()
            + '/update_tags'),
            JSON.stringify({jobseeker: tags}), this.authService.AuthHeader2())
            .map((res) => res);
    }

    public updateSummary(summary: string) {
        return this._http.put(this.authService
                .getBuildArabicUrl(ConfigService.getAPI() + this.url +
                    this.authService.getUserId()),
            JSON.stringify({jobseeker: summary}), this.authService.AuthHeader2())
            .map((res) => res);
    }

    public updateAddressDetails(address: any) {
        return this._http.put(this.authService.getBuildArabicUrl(ConfigService.getAPI()
            + this.url + this.authService.getUserId()), JSON.stringify({jobseeker: address}),
            this.authService.AuthHeader2())
            .map((res) => res);
    }

    public updatSkills(skills: any) {
        return this._http.post(this.authService
                .getBuildArabicUrl(ConfigService.getAPI() + this.url +
                    this.authService.getUserId() + '/update_skills'), JSON.stringify(skills),
            this.authService.AuthHeader2())
            .map((res) => res);
    }

    public postWorkExperience(jobseeker_experience) {
        let postData = JSON.stringify({jobseeker_experience});

        return this._http.post(this.authService
                .getBuildArabicUrl(ConfigService.getAPI() + this.url +
                    this.authService.getUserId() + '/jobseeker_experiences'),
            postData, this.authService.AuthHeader2())
            .map((res) => res);
    }

    public putWorkExperience(jobId, jobseeker_experience) {
        let postData = JSON.stringify({jobseeker_experience});

        return this._http.put(this.authService.getBuildArabicUrl(ConfigService.getAPI() +
            this.url + this.authService.getUserId()  + '/jobseeker_experiences/' + jobId),
            postData, this.authService.AuthHeader2())
            .map((res) => res);
    }

    public deleteCoverLetterList(ids: any[]) {
        let postData = JSON.stringify({jobseeker_coverletter_ids: ids});

        let authHeader = this.authService.AuthHeader3();
        authHeader.body = postData;

        return this._http.delete(this.authService
            .getBuildArabicUrl(ConfigService.getAPI() + this.url + this.authService.getUserId()
                + '/jobseeker_coverletters/delete_bulk/'), authHeader)
            .map((res) => res);
    }

    public deleteResumeList(ids: any[]) {
        let postData = JSON.stringify({jobseeker_resume_ids: ids});

        let authHeader = this.authService.AuthHeader3();
        authHeader.body = postData;

        return this._http.delete(this.authService
            .getBuildArabicUrl(ConfigService.getAPI() + this.url + this.authService.getUserId()
                + '/jobseeker_resumes/delete_bulk/'), authHeader)
            .map((res) => res);
    }

    public deleteWorkExperience(id: any) {
        return this._http.delete(ConfigService.getAPI()
            + this.url + this.authService.getUserId() + '/jobseeker_experiences/' + id,
            this.authService.AuthHeader3()).map((res) => res);
    }

    public postEducation(jobseeker_education) {
        let postData = JSON.stringify({jobseeker_education});

        return this._http.post(this.authService
                .getBuildArabicUrl(ConfigService.getAPI() + this.url +
                    this.authService.getUserId() + '/jobseeker_educations'), postData,
            this.authService.AuthHeader2())
            .map((res) => res);
    }

    public deleteEduFile(id: any) {
        return this._http.delete(this.authService
                .getBuildArabicUrl(ConfigService.getAPI() + this.url +
                    this.authService.getUserId() + '/jobseeker_educations/' + id +
                    '/delete_document'),
            this.authService.AuthHeader3()).map((res) => res);
    }

    public deleteWorkFile(id: any) {
        return this._http.delete(this.authService.getBuildArabicUrl(ConfigService.getAPI() +
            this.url + this.authService.getUserId() + '/jobseeker_experiences/' + id +
            '/delete_document'), this.authService.AuthHeader3()).map((res) => res);
    }

    public deleteCertificateFile(id: any) {
        return this._http.delete(this.authService.getBuildArabicUrl(ConfigService.getAPI()
            + this.url + this.authService.getUserId() + '/jobseeker_certificates/'
            + id + '/delete_document'), this.authService.AuthHeader3()).map((res) => res);
    }

    public deleteCertificate(id: any) {
        return this._http.delete(this.authService.getBuildArabicUrl(ConfigService.getAPI()
            + this.url + this.authService.getUserId() + '/jobseeker_certificates/' + id),
            this.authService.AuthHeader3()).map((res) => res);
    }

    public deleteEducation(id: any) {
        return this._http.delete(this.authService.getBuildArabicUrl(ConfigService.getAPI()
            + this.url + this.authService.getUserId() + '/jobseeker_educations/' + id),
            this.authService.AuthHeader3()).map((res) => res);
    }

    public updateEducation(jobseeker_education) {
        let postData = JSON.stringify({jobseeker_education});

        return this._http.put(this.authService.getBuildArabicUrl(ConfigService.getAPI() +
            this.url + this.authService.getUserId() + '/jobseeker_educations/' +
            jobseeker_education.id), postData, this.authService.AuthHeader2())
            .map((res) => res);
    }

    public updateCertificate(jobseeker_certificate) {

        let postData = JSON.stringify({jobseeker_certificate});

        return this._http.put(this.authService.getBuildArabicUrl(ConfigService.getAPI() +
            this.url + this.authService.getUserId() + '/jobseeker_certificates/' +
            jobseeker_certificate.id), postData,
            this.authService.AuthHeader2())
            .map((res) => res);
    }

    public postCertificate(jobseeker_certitficate) {

        let postData = JSON.stringify({jobseeker_certificate: jobseeker_certitficate});
        return this._http.post(this.authService
            .getBuildArabicUrl(ConfigService.getAPI() + this.url + this.authService.getUserId()
                + '/jobseeker_certificates'), postData, this.authService.AuthHeader2())
            .map((res) => res);
    }

    public updateWorkExperience(jobseeker_experience) {

        let postData = JSON.stringify({jobseeker_experience});

        return this._http.put(this.authService
                .getBuildArabicUrl(ConfigService.getAPI() + this.url +
                    this.authService.getUserId() + '/jobseeker_experiences/' +
                    jobseeker_experience.id), postData,
            this.authService.AuthHeader2())
            .map((res) => res);
    }

    public getProfilePdf(userId = null, userFullName = 'Candidate Resume') {

        let returnObs = new BehaviorSubject(null);
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                return returnObs.next('success');
            } else if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 500) {
                return returnObs.next('error');
            }
        };

        let url = '';
        if (userId == null) {
            url = ConfigService.getAPI() + this.url + this.authService.getUserId()
                + '/display_profile_pdf';
        } else {
            url = ConfigService.getAPI() + this.url + userId
                + '/display_profile_pdf';
        }
        url += (this.authService.getCurrLang() === ConfigService.langHash['arabic']) ? '?ar=true'
            : '';
        xhr.open('GET', url, this.authService.AuthHeaderPDF());

        xhr.setRequestHeader('Authorization', this.authService.getAuthKey());
        xhr.responseType = 'arraybuffer';
        xhr.onload = function (e) {
            if (this['status'] === 200) {
                let fileName = userFullName + '_' + moment().format('DD_MMM_YYYY');
                let blob = new Blob([this['response']], {type: 'application/pdf'});
                let link = document.createElement('a');

                // Add the element to the DOM
                document.body.appendChild(link);
                link.setAttribute('type', 'hidden'); // make it hidden if needed

                link.href = window.URL.createObjectURL(blob);
                link['download'] = fileName + '.pdf';
                link.click();
            }
        };

        xhr.send();

        return returnObs;
    }

    public updateProfile(profile_data) {

        return this._http.put(this.authService.getBuildArabicUrl(ConfigService.getAPI()
            + this.url + this.authService.getUserId()),
            JSON.stringify({jobseeker: profile_data}), this.authService.AuthHeader2())
            .map((res) => {
                let profile = res;
                let full_name = profile['jobseeker_profile']['first_name'] + ' ' +
                    profile['jobseeker_profile']['last_name'];
                this.setProfileHeader(full_name, profile['jobseeker_profile']['avatar']);
                this.authService.setProfileCache(profile['jobseeker_profile']);
                return profile;
            });

    }

    public updateProfileComplete(completeFlag = 1) {
        return this._http.put(this.authService.getBuildArabicUrl(ConfigService.getAPI()
            + this.url + this.authService.getUserId() +
            '/update_profile_status?status=' + completeFlag),
            JSON.stringify({jobseeker: {}}), this.authService.AuthHeader2())
            .map((res) => {
                let profile = res;
                let full_name = profile['jobseeker_profile']['first_name'] + ' ' +
                    profile['jobseeker_profile']['last_name'];
                this.setProfileHeader(full_name, profile['jobseeker_profile']['avatar']);
                this.authService.setProfileCache(profile['jobseeker_profile']);
                return profile;
            });
    }

    public getProfileStatus() {
        return this._http.get(this.authService.getBuildArabicUrl(ConfigService.getAPI()
            + this.url + this.authService.getUserId() + '/completion_percentage'),
            this.authService.AuthHeader())
            .map((res) => res['jobseeker']['completion_percentage']);
    }

    public setRateCandidate(jobseekerId, rate) {
        let url = ConfigService.getAPI()
            + 'ratings';
        let postParams = {
            rating: {
                jobseeker_id: jobseekerId,
                rate
            }
        };

        return this._http.post(url, JSON.stringify(postParams),
            this.authService.AuthHeader2()).map((res) => res);
    }
}
