import { Injectable } from "@angular/core";
import { HttpClient } from "../providers/http-client";
import { Observable } from "rxjs/Observable";
import { AppConfig } from "../config/app-config";

@Injectable()
export class RemindersService {
    constructor(
        private http: HttpClient,
        private appConfig: AppConfig
    ) {
    }
    getReminders(): Observable<any> {
        return this.http
            .get(this.appConfig.getBaseUrl() + "/app/reminders")
            .map(response => response.json())
    }
    getSpecificReminder(id:any): Observable<any> {
        return this.http
            .get(this.appConfig.getBaseUrl() + "/app/view-reminder/"+id)
            .map(response => response.json())
    }
    createReminder(data:any): Observable<any> {
        return this.http
            .post(this.appConfig.getBaseUrl() + "/app/create-reminder",{
                title: data.Title,
                description: data.Description,
                recipient_id:data.User
            })
            .map(response => response.json())
    }
    updateReminder(data:any,id:any): Observable<any> {
        return this.http
            .post(this.appConfig.getBaseUrl() + "/app/update-reminder" ,{
                id:id,
                recipient_id:data.User,
                title:data.Title,
                description:data.Description
            })
            .map(response => response.json())
    }
    deleteReminder(id:any): Observable<any> {
        return this.http
            .get(this.appConfig.getBaseUrl() + "/app/delete-reminder/" + id)
            .map(response => response.json())
    }
}