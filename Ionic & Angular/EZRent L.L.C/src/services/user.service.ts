import { Injectable } from "@angular/core";
import { HttpClient } from "../providers/http-client";
import { Observable } from "rxjs/Observable";
import { Storage } from "@ionic/storage";
import { AuthActions } from "../actions";
import { Store } from "@ngrx/store";
import { AppState } from "../reducers";
import { AppConfig } from "../config/app-config";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class UserService {
  public logoutUser = new BehaviorSubject<any>(false);
  constructor(
    private http: HttpClient,
    private appConfig: AppConfig,
    public storage: Storage,
    private authActions: AuthActions,
    private store: Store<AppState>
  ) {
    this.getToken().then((token: string) => {
      if (token) {
        this.store.dispatch(this.authActions.loginSuccess(token));
      }
    });
  }

  login(data: any): Observable<string> {
    return this.http
      .post(this.appConfig.getBaseUrl() + "/app/login", {
        username: data.payload.username,
        password: data.payload.password
      })
      .map(response => response.json())
      .map(response => {
        this.storage.set("auth_token", response.access_token);
        return response.access_token;
      });
  }

  logout(): Observable<string> {
    return this.http
      .post(this.appConfig.getBaseUrl() + "/app/logout", {})
      .map(response => response.json());
  }

  register(data: any): Observable<string> {
    return this.http
      .post(this.appConfig.getBaseUrl() + "/app/register", {
        name: data.payload.name,
        email: data.payload.email,
        phone: data.payload.number,
        password: data.payload.password,
        role_id: data.payload.role_id,
      })
      .map(response => response.json())
  }

  changePassword(data: any): Observable<string> {
    return this.http
      .post(this.appConfig.getBaseUrl() + "/app/change-password", {
        current_password: data.payload.changeCurrentPassword,
        new_password: data.payload.changeNewPassword
      })
      .map(response => response.json())
  }

  verifyNumber(data: any): Observable<string> {
    return this.http
      .post(this.appConfig.getBaseUrl() + "/twilio/send-sms", {
        phone_number: data.payload.phone_number,
      })
      .map(response => response.json())
      
  }

  verifyCode(data: any): Observable<string> {
    return this.http
      .post(this.appConfig.getBaseUrl() + "/twilio/verify-phone", {
        verification_code: data.payload.code_number,
      })
      .map(response => response.json())
  }

  getUsername(): Promise<string> {
    return this.storage.get("username").then(value => {
      return value;
    });
  }

  getUser(): Observable<any> {
    // this.store.dispatch(this.authActions.clearLogin());
    // this.storage.remove("auth_token");
    // localStorage.clear();
    return this.http
      .get(this.appConfig.getBaseUrl() + "/app/get-user"
      )
      .map(response => {
        try{
          this.storage.set("user", response);
          if(response['message']=="Unauthenticated"){
            this.store.dispatch(this.authActions.clearLogin());
            this.storage.remove("auth_token");
            localStorage.clear();
          }
        }catch(e){
        }
        return response.json();
      })
      
  }

  private getToken(): Promise<String> {
    return this.storage.get("auth_token").then(value => {
      return value;
    });
  }
  checkTenancy(){
    return this.http
      .get(this.appConfig.getBaseUrl() + "/app/has-tenancy")
      .map(response => response.json())
      .map(response => {
        if(response['message']=="Unauthenticated"){
          this.logoutUser.next(true);
        }
      });
  }
}
