import { Injectable, OnDestroy } from '@angular/core';

@Injectable()
export class AppLocalStorage implements OnDestroy{
    private storage = window.localStorage;

    ngOnDestroy(){
        this.storage = null;
    }

    public set(key: any, value: any): void{
        this.storage.setItem(key, JSON.stringify(value));
    }

    public get(key?: any): object | null{
        let data = this.storage[key] || undefined;

        if(data)
            return JSON.parse(data);
        else    
            return null;
    }

    public remove(key:any){
        this.storage.removeItem(key);
    }
}