import { Injectable } from "@angular/core";
import { HttpClient } from "../providers/http-client";
import { Observable } from "rxjs/Observable";
import { Storage } from "@ionic/storage";
import { AppConfig } from "../config/app-config";

@Injectable()
export class TenantInvitationService {
  constructor(
    private http: HttpClient,
    private appConfig: AppConfig,
    public storage: Storage
  ) {

  }

  // sendInvite(data: any): Observable<string> {
  //   return this.http
  //     .post(this.appConfig.getBaseUrl() + "/twilio/send-invitation", {
  //       phone_number: data.payload.phone_number,
  //       apartment_id: data.payload.appartmentID,
  //     })
  //     .map(response => response.json())
  // }


  sendInvitation(phNumber:any,id:any): Observable<any> {
    return this.http
      .post(this.appConfig.getBaseUrl() + "/twilio/send-invitation", {
        phone_number: phNumber,
        apartment_id: id,
      })
      .map(response => response.json())
  }


  verifyInvitaion(varCode: any): Observable<string> {
    return this.http
      .post(this.appConfig.getBaseUrl() + "/twilio/verify-invitation", {
        verification_code: varCode,
      })
      .map(response => response.json())
  }
  
  // verifyInvitaion(data: any): Observable<string> {
  //   return this.http
  //     .post(this.appConfig.getBaseUrl() + "/twilio/verify-invitation", {
  //       verification_code: data.payload.code_number,
  //     })
  //     .map(response => response.json())
  // }

  acceptInvitaion(codeNumber:any): Observable<string> {
    return this.http
      .post(this.appConfig.getBaseUrl() + "/twilio/accept-invitation", {
        verification_code: codeNumber,
      })
      .map(response => response.json())
  }
  varificationExpiry(no_of_days:any,invId:any): Observable<string> {
    return this.http
      .post(this.appConfig.getBaseUrl() + "/twilio/set-expiry-time", {
        no_of_days:no_of_days,
        invitation_id:invId
      })
      .map(response => response.json())
  }
  // acceptInvitaion(data: any): Observable<string> {
  //   return this.http
  //     .post(this.appConfig.getBaseUrl() + "/twilio/accept-invitation", {
  //       verification_code: data.payload.code_number,
  //     })
  //     .map(response => response.json())
  // }

}
