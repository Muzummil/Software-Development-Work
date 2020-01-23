import { Injectable } from "@angular/core";
import { HttpClient } from "../providers/http-client";
import { Observable } from "rxjs/Observable";
import { AppConfig } from "../config/app-config";

@Injectable()
export class AppartementService {
    constructor(
        private http: HttpClient,
        private appConfig: AppConfig
    ) {
    }
    addAppartement(data: any): Observable<string> {
        return this.http
            .post(this.appConfig.getBaseUrl() + "/app/apartment/add", {
                apart_no: data.payload.data.AppartmentNumber,
                tenants: data.payload.data.​​​Tenants,
                bedrooms: data.payload.data.BedRoom,
                bathrooms: data.payload.data.BathRoom,
                rent_price: data.payload.data.rentPrice,
                first_payment_due: data.payload.data.firstPayment,
                due_date: data.payload.data.firstDueDate,
                grace_days: data.payload.data.GraceDays,
                late_fee_surcharge: data.payload.data.LateFee,
                building_id: data.payload.buildingID,
            })
            .map(response => response.json())
    }
    addAppartement2(data: any,id): Observable<string> {
        return this.http
            .post(this.appConfig.getBaseUrl() + "/app/apartment/add", {
                apart_no: data.AppartmentNumber,
                tenants: data.​​​Tenants,
                bedrooms: data.BedRoom,
                bathrooms: data.BathRoom,
                rent_price: data.rentPrice,
                first_payment_due: data.firstPayment,
                due_date: data.firstDueDate,
                grace_period: data.GraceDays,
                late_fee_surcharge: data.LateFee,
                building_id: id,
            })
            .map(response => response.json())
    }

    getAppartementById(data: any): Observable<any> {
        return this.http
            .get(this.appConfig.getBaseUrl() + "/app/apartment/" + { data })
            .map(response => response.json())
    }

    getAllAppartement(): Observable<any> {
        return this.http
            .get(this.appConfig.getBaseUrl() + "/app/user-apartments")
            .map(response => response.json())
    }
    
    delBuilding(id:any):Observable<any> {
        return this.http.get(this.appConfig.getBaseUrl() + "/app/delete-building/"+id)
        .map(response=>response.json())
    }

    delappartment(id:any):Observable<any> {
        return this.http.get(this.appConfig.getBaseUrl() + "/app/delete-apartment/"+id)
        .map(response=>response.json())
    }
}