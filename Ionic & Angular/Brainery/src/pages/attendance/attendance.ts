import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserService,CacheService,GeneralService} from '../../app/shared/services';
import { SharedModule } from '../../app/shared';
import { LoginPage } from '../login/login';

/**
 * Generated class for the AttendancePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-attendance',
  templateUrl: 'attendance.html',
})
export class AttendancePage {
  public subject_id:any;
  public batch_id:any;
  public studentsList:any;
  public unSelected:boolean=false;
  public selectedStudents = new Array();
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public generalService:GeneralService,
              public sharedModule:SharedModule) {
    this.subject_id = navParams.get('subject_id');
  	this.batch_id = navParams.get('batch_id');
  	console.log("att",this.subject_id,this.batch_id);
  }
  ionViewDidLoad() {
    let loginCheck = this.sharedModule.loginCheck();
  	if(loginCheck){
      this.generalService.getSudents(this.subject_id).subscribe(response=>{
  		console.log(response);
  		this.studentsList = response.data;
  	  });
    }
    else{
      this.navCtrl.push(LoginPage);
    }
  }
  checkBoxValue(e:any){
  	console.log("klkk",e.target.value);
    this.selectedStudents.push(e.target.value);
    // console.log("mark",this.selectedStudents[0]);    
    // let checkIfExist   = this.selectedStudents[0].find(x=>x[0]==e.target.value);
    // console.log(checkIfExist);
  }
  checkAll(){
    console.log(this.unSelected);
    if (this.unSelected) {
        this.unSelected = false;
    } else {
        this.unSelected = true;
    }
    this.studentsList.forEach(item=>{
      item.selected = this.unSelected;
      // console.log(item.id);
      this.selectedStudents.push(item.id);
    });
    // console.log(this.studentsList);
  }
  markAttendance(){
    
    let loginCheck = this.sharedModule.loginCheck();
    
    if(loginCheck){
      let data = {
        batch_id:this.batch_id,
        st_att: this.selectedStudents
      }
      console.log(data);
      this.generalService.saveAttendance(data).subscribe(response=>{
        console.log(response);
      })
    }
   console.log("markAttendance",this.selectedStudents);
  }

}
