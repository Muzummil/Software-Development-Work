import { Injectable, OnDestroy } from '@angular/core';
import { AppLocalStorage } from './app-local-storage.service';
// import * as _ from 'underscore';

@Injectable()
export class CacheService implements OnDestroy{
    private storageKey = 'cache';
    
    constructor(private storage: AppLocalStorage) {}

    ngOnDestroy(){
        this.storageKey = null;
    }
    
    /**
     * Save HTTP response/anything in local storage for caching.
     * @param key           Unique key constructed preferrably with base URL and parameters.
     * @param value         Object or string. Everything will be JSON.stringify().
     * @param expireTime    Time in seconds.
     */
    // public set(key: any, value: any, expireTime: number = 86400): void{
    //     let cache = this.getCache();

    //     let expiry = this.getExpireTime(expireTime);
    //     let data = {
    //         expire: expiry,
    //         data: value 
    //     };

    //     cache[key] = data;
    //     this.storage.set(this.storageKey, cache);
    // }

    public setIndependent(key:any,value:any){
        this.storage.set(key, value);        
    }

    public remove(key:any){
        this.storage.remove(key);
    }
    
    /**
     * Get the cache from local storage.
     * @param key   Key used in set() method while saving the cache.
     */
    // public get(key?: any): any{
    //     let cache = this.getCache(),
    //     data = !_.isUndefined(cache[key]) ? cache[key] : null,
    //     isExpired = false;

    //     if(_.isNull(data))
    //          return null;

    //     let expiry = data['expire'] || null;             

    //     if(!_.isNull(expiry))
    //         isExpired = this.getTime() - expiry >= 0 ? true : false;

    //     if(!_.isUndefined(data['response']) && !_.isUndefined(data['response']['code'])
    //         && data['response']["code"] !== 0) {

    //         isExpired = true;
    //     }
    
    //     return isExpired ? null : (data['data'] || null);
    // }

    public getIndependent(key?:any):any{
        return this.storage.get(key);
    }


    

    private getCache(): any{
        return this.storage.get(this.storageKey) || {};
    }
    // private getIndependentCache(): any{
    //     return this.storage.getIndependent(this.storageKey) || {};
    // }

    private getExpireTime(seconds: number): number{
        return this.getTime() + (seconds * 1000);  
    }

    private getTime(): any{
        if (!Date.now) {
            Date.now = function() { return new Date().getTime(); }
        }     

        return Date.now();
    }
}