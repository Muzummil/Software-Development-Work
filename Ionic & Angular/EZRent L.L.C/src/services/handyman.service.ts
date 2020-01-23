import { Injectable } from "@angular/core";
import { HttpClient } from "../providers/http-client";
import { Observable } from "rxjs/Observable";
import { AppConfig } from "../config/app-config";

@Injectable()
export class HandymanService {
    constructor(
        private http: HttpClient,
        private appConfig: AppConfig
    ) {
    }
    getAllHandymans(): Observable<any> {
        return this.http
            .get(this.appConfig.getBaseUrl() + "/app/handymen")
            .map(response => response.json())
    }
    getSpecificHandyman(id:any): Observable<any> {
        return this.http
            .get(this.appConfig.getBaseUrl() + "/app/view-handyman/"+id)
            .map(response => response.json())
    }
    createHandyman(data:any): Observable<any> {
        return this.http
            .post(this.appConfig.getBaseUrl() + "/app/create-handyman",{
                name: data.name,
                skills: data.skills,
                contact: data.contact,
                location: data.location,
                apartment_id:data.apartment
            })
            .map(response => response.json())
    }
    updateHandyman(data:any,id:any): Observable<any> {
        return this.http
            .post(this.appConfig.getBaseUrl() + "/app/update-handyman" ,{
                id:id,
                name: data.name,
                skills: data.skills,
                contact: data.contact,
                location: data.location,
                apartment_id:data.apartment
            })
            .map(response => response.json())
    }
    deleteHandyman(id:any): Observable<any> {
        return this.http
            .get(this.appConfig.getBaseUrl() + "/app/delete-handyman/" + id)
            .map(response => response.json())
    }
    getAllApartments(): Observable<any> {
        return this.http
            .get(this.appConfig.getBaseUrl() + "/app/user-apartments")
            .map(response => response.json())
    }
    
}