import { Injectable } from "@angular/core";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
@Injectable()
export class LocalStorageService {
    public userUpdate = new BehaviorSubject<any>("null");
    constructor(
    ) {
    }

    set(key:string,value:any){
        if(key=="roleID"){
            this.userUpdate.next(value);
        }
        localStorage.setItem(key,value);
    }
    get(key:string){
        return localStorage.getItem(key);
    }
    clear(){
        return localStorage.clear();
    }
}