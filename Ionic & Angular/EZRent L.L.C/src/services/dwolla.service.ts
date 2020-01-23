import { Injectable } from "@angular/core";
import { HttpClient } from "../providers/http-client";
import { Observable } from "rxjs/Observable";
import { AppConfig } from "../config/app-config";

@Injectable()
export class DwollaService {
    constructor(
        private http: HttpClient,
        private appConfig: AppConfig
    ) {
    }

    dwollaCheckAccount(): Observable<string> {
        return this.http
            .get(this.appConfig.getBaseUrl() + "/dwolla/check-account")
            .map(response => response.json())
    }
    dwollaCreateCustomer(data: any): Observable<string> {
        return this.http
            .post(this.appConfig.getBaseUrl() + "/dwolla/create-customer", {
            })
            .map(response => response.json())
    }

    dwollaCreateUnverifiedCustomer(data: any): Observable<string> {
        return this.http
            .post(this.appConfig.getBaseUrl() + "/dwolla/create-unverified-customer", {
                first_name: data.FirstName,
                last_name: data.LastName,
                email: data.Email,
            })
            .map(response => response.json())
    }
    dwollaUpdateUnverifiedCustomer(data: any): Observable<string> {
        return this.http
            .post(this.appConfig.getBaseUrl() + "/dwolla/update-unverified-customer", {
                first_name: data.FirstName,
                last_name: data.LastName,
                email: data.Email,
                type: data.type,
                address: data.address
            })
            .map(response => response.json())
    }

    dwollaCreateVerifiedCustomer(data: any): Observable<string> {
        return this.http
            .post(this.appConfig.getBaseUrl() + "/dwolla/create-verified-customer", {
            })
            .map(response => response.json())
    }

    dwollaFunding(data: any): Observable<string> {
        return this.http
            .post(this.appConfig.getBaseUrl() + "/dwolla/attach-funding-source", {
                routing_number:data.RoutingNumber,
                account_number:data.AccountNumber,
                bank_account_type:data.AccountType,
                name:data.AccountName,
            })
            .map(response => response.json())
    }

    dwollaTransferFunding(data: any): Observable<string> {
        return this.http
            .post(this.appConfig.getBaseUrl() + "/dwolla/transfer-fund", {
            })
            .map(response => response.json())
    }

    dwollaGetIavToken(): Observable<string> {
        return this.http
            .get(this.appConfig.getBaseUrl() + "/dwolla/get-iav-token")
            .map(response => response.json())
    }
}