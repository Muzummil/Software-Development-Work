import { Injectable } from "@angular/core";
import { HttpClient } from "../providers/http-client";
import { Observable } from "rxjs/Observable";
import { AppConfig } from "../config/app-config";

@Injectable()
export class BuildingService {
    constructor(
        private http: HttpClient,
        private appConfig: AppConfig
    ) {
    }
    addBuilding(data: any): Observable<string> {
        return this.http
            .post(this.appConfig.getBaseUrl() + "/app/building/add", {
                name: data.payload.data.BuildingName,
                address: data.payload.data.Address,
                state: data.payload.data.State,
                city: data.payload.data.City,
                zip_code: data.payload.data.Entercode,
                no_of_apartments: data.payload.data.Noapartments,
                apart_no_format: data.payload.data.formatApartments
            })
            .map(response => response.json())
    }

    getBuildingById(data: any): Observable<any> {
        return this.http
            .get(this.appConfig.getBaseUrl() + "/app/get-building/" + data.payload)
            .map(response => response.json())
    }

    getAllBuildings(): Observable<any> {
        return this.http
            .get(this.appConfig.getBaseUrl() + "/app/user-buildings")
            .map(response => response.json())
    }
}