import { Injectable } from "@angular/core";
import { HttpClient } from "../providers/http-client";
import { Observable } from "rxjs/Observable";
import { AppConfig } from "../config/app-config";

@Injectable()
export class TenancyService {
    constructor(
        private http: HttpClient,
        private appConfig: AppConfig
    ) {
    }
    createTenancy(data: any): Observable<string> {
        return this.http
            .post(this.appConfig.getBaseUrl() + "/app/create-tenancy", {
            })
            .map(response => response.json())
    }

    getTenancyById(data: any): Observable<any> {
        return this.http
            .get(this.appConfig.getBaseUrl() + "/app/get-tenancy/" + data.payload)
            .map(response => response.json())
    }

    deleteTenancy(id: any): Observable<any> {
        return this.http.get(this.appConfig.getBaseUrl() + "/app/delete-tenancy/" + id)
            .map(response => response.json())
    }
}