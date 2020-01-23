import { Injectable } from "@angular/core";
import { HttpClient } from "../providers/http-client";
import { Observable } from "rxjs/Observable";
import { AppConfig } from "../config/app-config";

@Injectable()
export class DisputesService {
    constructor(
        private http: HttpClient,
        private appConfig: AppConfig
    ) {
    }
    getAllDisputes(): Observable<any> {
        return this.http
            .get(this.appConfig.getBaseUrl() + "/app/disputes")
            .map(response => response.json())
    }
    
    getSpecificDispute(id:any): Observable<any> {
        return this.http
            .get(this.appConfig.getBaseUrl() + "/app/view-dispute/"+id)
            .map(response => response.json())
    }
    createDispute(data:any): Observable<any> {
        return this.http
            .post(this.appConfig.getBaseUrl() + "/app/create-dispute",{
                title: data.Title,
                description: data.Description,
                dispute_with_id:data.User
            })
            .map(response => response.json())
    }
    updateDispute(data:any,id:any): Observable<any> {
        return this.http
            .post(this.appConfig.getBaseUrl() + "/app/update-dispute" ,{
                id:id,
                recipient_id:data.User,
                title:data.Title,
                description:data.Description
            })
            .map(response => response.json())
    }
    deleteDispute(id:any): Observable<any> {
        return this.http
            .get(this.appConfig.getBaseUrl() + "/app/delete-dispute/" + id)
            .map(response => response.json())
    }
    getAllLandlords(): Observable<any> {
        return this.http
            .get(this.appConfig.getBaseUrl() + "/app/get-landlords")
            .map(response => response.json())
    }
    
}