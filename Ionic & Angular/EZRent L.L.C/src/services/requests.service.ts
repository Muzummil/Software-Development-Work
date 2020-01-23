import { Injectable } from "@angular/core";
import { HttpClient } from "../providers/http-client";
import { Observable } from "rxjs/Observable";
import { AppConfig } from "../config/app-config";

@Injectable()
export class RequestsService {
    constructor(
        private http: HttpClient,
        private appConfig: AppConfig
    ) {
    }
    getAllRequests(): Observable<any> {
        return this.http
            .get(this.appConfig.getBaseUrl() + "/app/requests")
            .map(response => response.json())
    }
    getAllMaintenanceRequests(): Observable<any> {
        return this.http
            .get(this.appConfig.getBaseUrl() + "/app/maintenance-requests")
            .map(response => response.json())
    }
    getSpecificRequest(id:any): Observable<any> {
        return this.http
            .get(this.appConfig.getBaseUrl() + "/app/view-request/"+id)
            .map(response => response.json())
    }
    getSpecificMaintenanceRequest(id:any): Observable<any> {
        return this.http
            .get(this.appConfig.getBaseUrl() + "/app/view-maintenance-request/"+id)
            .map(response => response.json())
    }
    createRequest(data:any): Observable<any> {
        return this.http
            .post(this.appConfig.getBaseUrl() + "/app/create-request",{
                title: data.Title,
                description: data.Description,
                recipient_id:data.User
            })
            .map(response => response.json())
    }
    createMaintenanceRequest(data:any): Observable<any> {
        return this.http
            .post(this.appConfig.getBaseUrl() + "/app/create-maintenance-request",{
                title: data.Title,
                description: data.Description,
                recipient_id:data.User
            })
            .map(response => response.json())
    }
    updateRequest(data:any,id:any): Observable<any> {
        return this.http
            .post(this.appConfig.getBaseUrl() + "/app/update-request" ,{
                id:id,
                recipient_id:data.User,
                title:data.Title,
                description:data.Description
            })
            .map(response => response.json())
    }
    updateMaintenanceRequest(data:any,id:any): Observable<any> {
        return this.http
            .post(this.appConfig.getBaseUrl() + "/app/update-maintenance-request" ,{
                id:id,
                recipient_id:data.User,
                title:data.Title,
                description:data.Description
            })
            .map(response => response.json())
    }
    deleteRequest(id:any): Observable<any> {
        return this.http
            .get(this.appConfig.getBaseUrl() + "/app/delete-request/" + id)
            .map(response => response.json())
    }
    deleteMaintenanceRequest(id:any): Observable<any> {
        return this.http
            .get(this.appConfig.getBaseUrl() + "/app/delete-maintenance-request/" + id)
            .map(response => response.json())
    }
    getAllLandlords(): Observable<any> {
        return this.http
            .get(this.appConfig.getBaseUrl() + "/app/get-landlords")
            .map(response => response.json())
    }
    
}