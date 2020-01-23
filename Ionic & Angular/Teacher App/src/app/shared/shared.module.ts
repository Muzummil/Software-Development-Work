import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import * as _ from 'underscore';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: []
})
export class SharedModule { 
  public static API_URL   = 'http://api.brainery.pk/app.php/';
  // public static API_URL 	= 'http://stag.aiis.pk/app.php/';
  // public static API_URL   = 'https://is.brainery.pk/app.php/';
  // public static NEW_URL   = "https://is.brainery.pk/";
  // public static API_URL   = 'http://localhost/aiis/app.php/';
  // public static NEW_URL   = "http://localhost/aiis/";
  // public static NEW_URL   = "http://stag.aiis.pk/";
  public static NEW_URL   = "http://api.brainery.pk/";
  public static addToken(url:any): any {
    console.log("in add token");
		let token = localStorage.getItem('token');
    token = token.replace("\"","");
    token = token.replace("\"","");
		//let conType = token.includes('?');
		//if(conType==true){
			return url + '&token=' + token;
		// }else{
		// 	return url + '?token=' + token;
		// }
	}
	
  public loginCheck():boolean{
    let token     = localStorage.getItem("token");
    // let branch_id = localStorage.getItem("branch_id");
    let user_id   = localStorage.getItem("user_id");
    if(token && user_id){
      return true;
    }
    else{
      return false;
    }
  }
}
