import { Injectable } from '@angular/core';

@Injectable()
export class AppConfig {

    constructor() { }

    public getBaseUrl(): string {

        // return "http://192.168.11.12/ezrentllc_dev/portal_ezrentllc/public/";
        return "http://devportal.ezrentllc.com";
    }

    public getEntityId(): string {
        return "5a435052a20eb6423868d818";
    }

    public getShareLink(): string {
        return "http://www.jhear.com";
    }


}