import { Injectable } from "@angular/core";
import { HttpClient } from "../providers/http-client";
import { Observable } from "rxjs/Observable";
import { AppConfig } from "../config/app-config";

@Injectable()
export class TenantService {
    constructor(
        private http: HttpClient,
        private appConfig: AppConfig
    ) {
    }
    getTenantBuildings(): Observable<any> {
        return this.http
            .get(this.appConfig.getBaseUrl() + "/app/tenant-buldings")
            .map(response => response.json())
    }
    getAllTenant(): Observable<any> {
        return this.http
            .get(this.appConfig.getBaseUrl() + "/app/get-tenants")
            .map(response => response.json())
    }
    getAllTenantApprtmentId(data): Observable<any> {
        return this.http
            .get(this.appConfig.getBaseUrl() + "/app/get-apartment-tenants/" + data.payload)
            .map(response => response.json())
    }
}