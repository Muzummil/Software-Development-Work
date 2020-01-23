import { Injectable } from "@angular/core";
import { HttpClient } from "../providers/http-client";
import { Observable } from "rxjs/Observable";
import { Storage } from "@ionic/storage";
import { AppConfig } from "../config/app-config";

@Injectable()
export class UserSelectionService {
    constructor(
        private http: HttpClient,
        private appConfig: AppConfig,
        public storage: Storage
    ) {
    }
    userSelection(data: any): Observable<string> {
        return this.http
            .post(this.appConfig.getBaseUrl() + "/app/update-detail", {
                date_of_birth: data.payload.data.date,
                education: data.payload.data.education,
                race: data.payload.data.ethnicity,
                gender: data.payload.data.gender,
                marital_status: data.payload.data.maritalStatus,
                yearly_income: data.payload.data.yearlyIncome,
                role_id: data.payload.role
            })
            .map(response => response.json())
    }
}