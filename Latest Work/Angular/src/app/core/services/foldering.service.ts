import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../shared/config.service';
import { AccountService } from '../../core/account/services/account.service';

import { Injectable, Inject } from '@angular/core';

import 'rxjs/add/operator/map';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class FolderingService {

    public static  FoldersDirty: boolean = true;
    public  static foldersCandidatesDirty: boolean = true;
    public static allFoldersListCache$ = new BehaviorSubject( null);

    public  foldersDetailsDirty: boolean = true;
    public  foldersDetailsListCache$ = new BehaviorSubject( null);
    public  currentFolderDetailsPage = 1;
    public  currentFolderId;

    public  foldersCandidatesCache$ = new BehaviorSubject( null);
    public  currentfoldersCandidatesPage = 1;
    public  currentfolderCandidatesId;

    public folderDetailList = null;
    public folderUrl = 'folders';
    public jobeekerFolderUrl = 'jobseeker_folders';
    public currentFolderPage = 1;

    constructor(public _http: HttpClient, public authService: AccountService) {

    }

    public getAllFolders(page = 1, merge = false): Observable<any>  {

        if (FolderingService.FoldersDirty || this.currentFolderPage !== page) {
            FolderingService.FoldersDirty = false;
            this.currentFolderPage = page;

            let url = ConfigService.getAPI() + this.folderUrl + '?page=' + this.currentFolderPage;
            return this._http.get(url, this.authService.AuthHeader())
                .map((res) => {

                    let folders = FolderingService.allFoldersListCache$.value;
                    if (merge === true && folders) {
                        res['folders'] = folders['folders'].concat(res['folders']);
                    }
                    FolderingService.allFoldersListCache$.next(res);
                    return res;
                });
        } else {
            return FolderingService.allFoldersListCache$;
        }
    }

    public deleteFolder(folderId) {
        let url = ConfigService.getAPI() + this.folderUrl + '/' + folderId;
        return this._http.delete(url, this.authService.AuthHeader3())
            .map((res) => { this.resetCache(); return res; });
    }

    public createFolder(postJson) {
        let url = ConfigService.getAPI() + this.folderUrl;
        return this._http.post(url, postJson, this.authService.AuthHeader())
            .map((res) => { this.resetCache(); return res; });
    }
    public editFolder(folderId, postJson) {
        let url = ConfigService.getAPI() + this.folderUrl + '/' + folderId;
        return this._http.put(url, postJson, this.authService.AuthHeader())
            .map((res) => { this.resetCache(); return res; });
    }

    public getFolderDetails(folderId, page = 1, merge = false): Observable<any> {

        if (this.foldersDetailsDirty || this.currentFolderDetailsPage !== page
            || this.currentFolderId !== folderId) {
            this.foldersDetailsDirty = false;
            this.currentFolderDetailsPage = page;
            this.currentFolderId = folderId;

            let url = ConfigService.getAPI() + this.folderUrl + '/' + folderId + '/sub_folders'
                + '?page=' + page;
            return this._http.get(url, this.authService.AuthHeader())
                .map((res) => {
                    if (merge === true && this.folderDetailList) {
                        res['folders'] = this.folderDetailList['folders'].concat(res['folders']);
                    }
                    this.foldersDetailsListCache$.next(res);
                    return res;
                });
        } else {
            return this.foldersDetailsListCache$;
        }

    }

    // Move jobseeker to another folder
    // Body: {jobseeker_folders: {jobseeker_id: 1, folder_id: 2}}
    public editJobseekerFolder(id, postJson) {
        let url = ConfigService.getAPI() + this.jobeekerFolderUrl + '/' + id;
        return this._http.put(url, postJson, this.authService.AuthHeader())
            .map((res) => { this.resetCache(); return res; });
    }

    //  Add Jobseeker to Folder
    //  Copy Jobseeker to Folder
    // Body: {jobseeker_folders: {jobseeker_id: 1, folder_id: 2}}
    public createJobseekerFolder(postJson) {
        let url = ConfigService.getAPI() + this.jobeekerFolderUrl;
        return this._http.post(url, postJson, this.authService.AuthHeader())
            .map((res) => { this.resetCache(); return res; });
    }

    //  Remove Jobseeker from Folder
    public deleteJobseekerFolder(folderId) {
        let url = ConfigService.getAPI() + this.jobeekerFolderUrl + '/' + folderId;
        return this._http.delete(url, this.authService.AuthHeader3())
            .map((res) => { this.resetCache(); return res; });
    }

    // Get Folder Candidate Details
    public getFolderCandidateDetails(folderId, page = 1): Observable<any>  {

        if (FolderingService.foldersCandidatesDirty || this.currentfoldersCandidatesPage !== page
            || this.currentfolderCandidatesId !== folderId) {
            FolderingService.foldersCandidatesDirty = false;
            this.currentfoldersCandidatesPage = page;
            this.currentfolderCandidatesId = folderId;

            let url = ConfigService.getAPI() + this.folderUrl + '/' + folderId
                + '/jobseeker_folders?page=' + page;
            return this._http.get(url, this.authService.AuthHeader())
                .map((res) => {
                    this.foldersCandidatesCache$.next(res);
                    return res;
                });
        } else {
            return this.foldersCandidatesCache$;
        }

    }

    // Get Candidate in folder by search tag
    public getCandidateInFolderByTags(parentFolderId, tagList = [], page = 1) {

        let url = ConfigService.getAPI() + 'folders/all_jobseekers?q[hash_tags_id_in]='
            + tagList + '&page=' + page;
        url += (parentFolderId) ? '&q[folder_id_in]=' + parentFolderId : '';

        return this._http.get(url, this.authService.AuthHeader())
            .map((res) => {
                return res;
            });

    }

    public resetCache() {
        FolderingService.FoldersDirty = true;
        FolderingService.foldersCandidatesDirty = true;
        this.foldersDetailsDirty = true;
    }

}
