import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable } from "@angular/core";
import { HttpClient } from "../providers/http-client";
import { Observable } from "rxjs/Observable";
import { AppConfig } from "../config/app-config";

@Injectable()
export class NotificationService {
    public notificationSubject = new BehaviorSubject<any>(0);
    constructor(
        private http: HttpClient,
        private appConfig: AppConfig
    ) {
    }
    getAllNotifications(): Observable<any> {
        return Observable.create(observer => {
            this.http.get(this.appConfig.getBaseUrl() + "/app/notifications").subscribe(response => {
                const data = response.json();
                if(data['notifications'].unread.length>0){
                    this.notificationSubject.next(data['notifications'].unread.length);
                }else{
                    this.notificationSubject.next(0);
                }
                observer.next(data);
                observer.complete();
            }, (error) => {
            });
        });
    }
    // getAllNotifications(): Observable<any> {
    //     return this.http
    //         .get(this.appConfig.getBaseUrl() + "/app/notifications")
    //         .map(response => { 
    //             let res = response.json();
    //             if(res['notifications'].unread.length>0){
    //                 this.notificationSubject.next(res['notifications'].unread.length);
    //             }
    //         })
    // }
    readNotification(id:any): Observable<any> {
        return this.http
            .get(this.appConfig.getBaseUrl() + "/app/read-notification/"+id)
            .map(response => response.json())
    }
    deleteNotification(id:any): Observable<any> {
        return this.http
            .get(this.appConfig.getBaseUrl() + "/app/delete-notification/" + id)
            .map(response => response.json())
    }
}