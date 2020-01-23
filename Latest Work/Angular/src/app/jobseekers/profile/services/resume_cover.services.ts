import { HttpClient} from '@angular/common/http';
import {ConfigService} from '../../../shared/config.service';

import {Injectable,Inject} from '@angular/core';

//Model
import {File1} from '../../../shared/models/File';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {AccountService} from  '../../../core/account/services/account.service';


@Injectable()
export class ResumeCoverService {

    public _url_resume ="resume.html";
    public _url_cover ="cover.html";

    public resumeFileObs: BehaviorSubject<File1[]> =  new BehaviorSubject(null);
    public coverletterFileObs: BehaviorSubject<File1[]> =  new BehaviorSubject(null);

    public fileList:File1[] = new Array();
    public authService;


    constructor(public _http: HttpClient,@Inject(AccountService) authService:AccountService) {

        this.authService = authService;

    }

    getCoverLetterList() : BehaviorSubject<File1[]>{


        let url = ConfigService.getAPI()+'jobseekers/'+this.authService.getUserId()+ '/jobseeker_coverletters';


        this._http.get(url,this.authService.AuthHeader())
            .subscribe(file=> {


                this.fileList = [];

                file["jobseeker_coverletters"].forEach(selFile=>{
                    let fileNew = new File1();
                    fileNew.id = selFile.id;
                    fileNew.name = selFile.document_file_name;
                    fileNew.desc = selFile.document_file_name;
                    fileNew.url = selFile.document;
                    fileNew.size = null;
                    fileNew.default = false;
                    if(selFile.default)
                    {
                        fileNew.default = true;
                    }

                    this.fileList.push(fileNew);

                });
                this.coverletterFileObs.next(this.fileList);

            });

        return this.coverletterFileObs;
    }



    getResumeList() : BehaviorSubject<File1[]>{

        let url = ConfigService.getAPI()+'jobseekers/'+this.authService.getUserId()+ '/jobseeker_resumes';
        this._http.get(url,this.authService.AuthHeader())
            .subscribe(file=> {

                this.fileList = [];

                file["jobseeker_resumes"].forEach(selFile=>{
                    let fileNew = new File1();
                    fileNew.id = selFile.id;
                    fileNew.name = selFile.document_file_name;
                    fileNew.desc = selFile.document_file_name;
                    fileNew.url = selFile.document;
                    fileNew.size = null;
                    fileNew.default = false;
                    if(selFile.default)
                    {
                        fileNew.default = true;
                    }

                    this.fileList.push(fileNew);

                });
                this.resumeFileObs.next(this.fileList);

            });

                return this.resumeFileObs;
    }




}
