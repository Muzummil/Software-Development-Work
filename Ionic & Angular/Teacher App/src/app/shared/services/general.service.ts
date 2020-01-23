import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { SharedModule } from '../shared.module';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
// import { Router } from '@angular/router';
// import * as FileSaver from '@types/file-saver';
// import * as _ from 'underscore';
// import { IDrupalLoginResponse, IDrupalUser } from '../interfaces/drupal-user';
import { CacheService } from './cache.service';

@Injectable()

export class GeneralService {
  public reportParameters:Array<any>;

  public menuUpdate = new BehaviorSubject < any > ({});
  public generalData = new BehaviorSubject < any > ({});
  public selectedMenuUpdate = new BehaviorSubject < any > ({});
  public widgetUpdate = new BehaviorSubject < any > ({});
  public widgetChechk = new BehaviorSubject < any > ({});
  public EOWidgets = new BehaviorSubject < any >({});
  public option:Boolean=false;


  constructor(private http: Http, private cache: CacheService) {
  }
  //function to trigger widgetChechk observer
  
  public getClasses() {
    // console.log("injy");
    let url: string = SharedModule.NEW_URL+'api/get_classes.php?test=1';
    let requestParameters = {
      user_id:this.cache.getIndependent('user_id'),
      user_branch:this.cache.getIndependent('user_branch'),
      is_new: 1
    }
    // console.log(type);
    url = SharedModule.addToken(url);
    return Observable.create(observer => {
      this.http.post(url, requestParameters, this.getRequestOptions()).subscribe(response => {
        // console.log(response);
        let data = this.parseResponse(response);
       if(data && data.hasOwnProperty('data')){
        // this.cache.set('MainData', data.data);
        observer.next(data);
        observer.complete();
        // console.log(data);
        // this.generalData.next(data);
       }
       else{
        //generate error
       }
      }, (error) => {
        // const errorBody = JSON.parse(error['_body']);
      }).remove;
    });
  }
  public getSubjects(course_id:any) {
    console.log("injy",course_id);
    let url: string = SharedModule.NEW_URL+'api/get_teacher_subjects.php?test=1';
    let requestParameters = {
      course_id:course_id,
      branch_id:this.cache.getIndependent('user_branch'),
      is_new: 1
    }
    // console.log(type);
    // console.log(requestParameters);
    url = SharedModule.addToken(url);
    return Observable.create(observer => {
      this.http.post(url, requestParameters, this.getRequestOptions()).subscribe(response => {
        // console.log(response);
        let data = this.parseResponse(response);
       if(data && data.hasOwnProperty('data')){
        // this.cache.set('MainData', data.data);
        observer.next(data);
        observer.complete();
        // console.log(data);
        // this.generalData.next(data);
       }
       else{
        //generate error
       }
      }, (error) => {
        // const errorBody = JSON.parse(error['_body']);
      }).remove;
    });
  }
  public getSudents(course_id:any,session_id:any) {
    console.log("injy");
    // let url: string = SharedModule.NEW_URL+'api/get_teacher_students.php?subject_id='+subject_id;
    let url: string = SharedModule.API_URL+'Students/Get?test=1';
    // let url: string = SharedModule.API_URL+'Students/Get?test=1';
    let requestParameters = {
      course_id:course_id,
      session_id:session_id,
      // user_branch:this.cache.getIndependent('user_branch'),
      is_new: 1
    }
    // console.log(type);
    // console.log(requestParameters);
    url = SharedModule.addToken(url);
    return Observable.create(observer => {
      this.http.post(url, requestParameters, this.getRequestOptions()).subscribe(response => {
        let data = this.parseResponse(response);
        console.log(data);
       if(data && data.hasOwnProperty('data')){
        // this.cache.set('MainData', data.data);
        observer.next(data);
        observer.complete();
        // console.log(data);
        // this.generalData.next(data);
       }else{
        observer.next(response);
        observer.complete();
       }

      }, (error) => {
        // const errorBody = JSON.parse(error['_body']);
      }).remove;
    });
  }
  public saveAttendance(data:any) {
    let url: string = SharedModule.NEW_URL + "api/save_attd.php?test=1";
    // let url: string = SharedModule.API_URL+'Students/Get?test=1';
    // console.log(type);
    // console.log(data);
    //let param = JSON.stringify(data);
    // console.log(requestParameters);
    url = SharedModule.addToken(url);
    //console.log("attendance",param);
    return Observable.create(observer => {
      this.http.post(url,data,this.getRequestOptions()).subscribe(response => {
        console.log(response);
        let data = this.parseResponse(response);
       if(data && data.hasOwnProperty('data')){
        // this.cache.set('MainData', data.data);
        observer.next(data);
        observer.complete();
        // console.log(data);
        // this.generalData.next(data);
       }
       else{
        observer.next(data);
        observer.complete();
       }
      }, (error) => {
        // const errorBody = JSON.parse(error['_body']);
      }).remove;
    });
  }
  

  // public typedRequest(selectedObj:any){
  //  let url = SharedModule.API_URL;
  //  // alert(this.consts.limit);
  //  // this.router.navigate(['/login']);
  //  // console.log(selectedObj);
  //  if(this.router.url!="/general"){
  //    this.router.navigate(['/general']);     
  //  }
  //  this.cache.set('selectedObj',selectedObj);
  //  this.selectedMenuUpdate.next({});
  //  let type =  selectedObj['viewApi'];
  //  // console.log(type);
  //  let requestParameters={
  //    page:this.consts.page,start:this.consts.start,limit:this.consts.limit,is_new:1
  //  }
  //  let postUrl = url +type;
  //  postUrl = SharedModule.addToken(postUrl);
  //  // console.log(postUrl);
  //  return Observable.create(observer=>{
  //            // console.log(postUrl);
  //            this.http.post(postUrl,requestParameters,this.getRequestOptions()).subscribe(response=>{
  //            let data = this.parseResponse(response);
  //            // console.log(data);
  //            // this.cache.setSideBar(package_id,localStorage.getItem('user_id'),data);
  //            this.cache.set('MainData',data.data);
  //            observer.next(data);
  //            observer.complete();
  //            // this.menuUpdate.next({});
  //            this.generalData.next({});
  //         }, (error)=>{
  //            const errorBody = JSON.parse(error['_body']);
  //      }).remove;
  //   });  
  // }
  private getRequestOptions(): RequestOptions {
    const requestOptions = new RequestOptions({
      headers: new Headers({
        'content-type': 'application/json'
      })
    });

    return requestOptions;
  }

  private parseResponse(response) {
    // console.log(response);
    try {
      let data = JSON.parse(response['_body']);
    return data;
    } catch(e){
      // console.log("catch",response['_body']);
      return false;
    }
    // if(this.isJson(response)){
    //   console.log(response['_body']);
    //   let data = JSON.parse(response['_body']);
    //   return data;
    // }
    // return null;
  }
  public getDateTime () {
    let now = new Date();
    let year = "" + now.getFullYear();
    let month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
    let day = "" + now.getDate(); if (day.length == 1) { day = "0" + day; }
    let hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour; }
    let minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
    let second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second; }
    return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
  }
  public saveItems(data: any,url:string){
    let host = SharedModule.API_URL;
    let postUrl = host + url;
    postUrl = SharedModule.addToken(postUrl);
    return Observable.create(observer => {
      this.http.post(postUrl, data, this.getRequestOptions()).subscribe(response => {
        // console.log(data);
        observer.next(response);
        observer.complete();
      }, (error) => {
        // const errorBody = JSON.parse(error['_body']);
      }).remove;
    });
  }
}
