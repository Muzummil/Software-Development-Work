import { Injectable } from "@angular/core";
import { Http, Headers } from "@angular/http";
import { Observable } from "rxjs";
import "rxjs/add/operator/mergeMap";
import "rxjs/add/observable/fromPromise";

import { Storage } from "@ionic/storage";
import { Store } from "@ngrx/store";
import { AppState } from "../reducers";

@Injectable()
export class HttpClient {
  authToken: any;
  constructor(
    private http: Http,
    private store: Store<AppState>,
    public storage: Storage
  ) {
    this.store.select("auth").subscribe((auth: any) => {
      this.authToken = auth.id_token;
    });
  }

  private getHeaders() {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Accept", "application/json");
    if (this.authToken) {
      headers.append("Authorization", "Bearer " + this.authToken);
    }
    return headers;
  }

  get(url: string): Observable<any> {
    let headers = this.getHeaders();
    return this.http
      .get(url, {
        headers: headers
      })
      .catch(this.handleError);
  }

  post(url: string, data: Object): Observable<any> {
    let headers = this.getHeaders();

    return this.http
      .post(url, data, {
        headers: headers
      })
      .catch(this.handleError);
  }

  put(url: string, data: Object): Observable<any> {
    let headers = this.getHeaders();
    return this.http
      .put(url, data, {
        headers: headers
      })
      .catch(this.handleError);
  }

  delete(url: string): Observable<any> {
    let headers = this.getHeaders();
    return this.http
      .delete(url, {
        headers: headers
      })
      .catch(this.handleError);
  }

  private handleError(error: Response | any) {
    const errMsg = error.json();
    return Observable.throw(errMsg);
  }
}
