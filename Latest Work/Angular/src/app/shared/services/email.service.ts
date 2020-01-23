import {Injectable} from '@angular/core';
import { HttpClient} from '@angular/common/http';
import {ConfigService} from '../../shared/config.service';


@Injectable()
export class EmailService{

    public _url = "email.html";
    constructor(public _http:HttpClient){

    }

    public postemail(email_id:string,email_body:string)
    {
       let emailObj =  new email();
        emailObj.email_id = email_id;
        emailObj.email_body = email_body;

        this._http.post(ConfigService.getBloovoAPI()+this._url, JSON.stringify(emailObj))
    }


}



class email {

    email_id: string;
    email_body:string;

}
