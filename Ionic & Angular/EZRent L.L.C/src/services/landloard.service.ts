import { Injectable } from "@angular/core";
import { HttpClient } from "../providers/http-client";
import { Observable } from "rxjs/Observable";
import { AppConfig } from "../config/app-config";

@Injectable()
export class LandloardService {
    constructor(
        private http: HttpClient,
        private appConfig: AppConfig
    ) {
    }
    landloardBuildings(): Observable<any> {
        return this.http
            .get(this.appConfig.getBaseUrl() + "/app/landlord-buldings")
            .map(response => response.json())
    }
}