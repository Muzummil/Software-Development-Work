import { Component } from '@angular/core';
import { NavController, NavParams,LoadingController,AlertController } from 'ionic-angular';
import { GeneralService} from '../../app/shared/services';
import { SharedModule } from '../../app/shared';
import { LoginPage } from '../login/login';

/**
 * Generated class for the AttendancePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-attendance',
  templateUrl: 'attendance.html',
})
export class AttendancePage {
  public course_id:any;
  public session_id:any;
  public batch_id:any;
  public student_id:any;
  public studentsList:any;
  public unSelected:boolean=false;
  public selectedStudents = new Array();
  public dataPart:boolean=true;
  public errorPart:boolean=false;
  public isSelected = new Array();
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public generalService:GeneralService,public loadingCtrl: LoadingController,
              public sharedModule:SharedModule,public markAtt: AlertController,
              public markCtrl: LoadingController,) {
    this.course_id  = navParams.get('course_id');
    this.session_id = navParams.get('session_id');
    this.batch_id   = navParams.get('batch_id');
    this.student_id   = navParams.get('student_id');
  	// this.student_id   = navParams.get('student_id');
  	// console.log("att",this.subject_id,this.batch_id);
  }
  ionViewDidLoad() {
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 1500
    });
    let loginCheck = this.sharedModule.loginCheck();
    // console.log("attendance",loginCheck);
  	if(loginCheck){
      loader.present();
      // console.log("checkAll");
      this.generalService.getSudents(this.course_id,this.session_id).subscribe(response=>{
      // console.log(response);
      if(response && response.success){
        // console.log("iffff");
        this.dataPart     = true; 
        this.errorPart    = false;
        loader.dismiss();
        this.studentsList = response.data;
      }else{
        loader.dismiss();
        // console.log("elseeee");
        this.dataPart  = false;
        this.errorPart = true;
        this.studentsList = [];
      }
      // this.unSelected   = false;
      this.checkAll();
      });
    }
    else{
      this.navCtrl.setRoot(LoginPage);
    }
  }
  checkBoxValue(e:any){
  	// console.log("klkk",e.target.value);
    // this.selectedStudents.push(e.target.value);
    let check = this.selectedStudents.find(x=>x.student_id==e.target.value);
    // console.log(check);
    let selectedStudentsTemp = new Array();
    if(check==undefined && !check){      
      selectedStudentsTemp = JSON.parse(JSON.stringify({student_id:e.target.value,selected:1}));
      this.selectedStudents.push(selectedStudentsTemp);
    }else{
      // console.log(check['student_id']);
      // check.selected = 0;
      this.selectedStudents.find(x=>x.student_id==check.student_id).selected = 0;
      // let id = check.student_id;
      // console.log(selectedStudentsTemp.id);
      // console.log(selectedStudentsTemp['student_id'].check['student_id']);
      // selectedStudentsTemp.check['student_id']= check; //JSON.parse(JSON.stringify({student_id:e.target.value,selected:0}));
      // this.selectedStudents.push(selectedStudentsTemp);
    }
    // console.log(this.selectedStudents);
    // console.log("mark",this.selectedStudents[0]);    
    // let checkIfExist   = this.selectedStudents[0].find(x=>x[0]==e.target.value);
    // console.log(checkIfExist);
  }
  checkAll(){
    // console.log(this.unSelected);
    if (this.unSelected) {
        this.unSelected = false;
    } else {
        this.unSelected = true;
    }
    this.studentsList.forEach(item=>{
      item.selected = this.unSelected;
      // console.log(item.id);
      // selectedStudentsTemp['student_id'] = item.id;
      // selectedStudentsTemp['selected']   = 1;
      // this.isSelected.push(1);
      // console.log('chaaa: ',selectedStudentsTemp);
      let selectedStudentsTemp = new Array();
      selectedStudentsTemp = JSON.parse(JSON.stringify({student_id:item.student_id,selected:1}));
      this.selectedStudents.push(selectedStudentsTemp);
      // console.log("in loop",this.selectedStudents);
    });
    //console.log(this.selectedStudents,JSON.stringify({data:this.selectedStudents}));
  }
  markAttendance(){
    let loader = this.markCtrl.create({
      content: "Please wait...",
      duration: 1500
    });
    
    let loginCheck = this.sharedModule.loginCheck();
    // console.log(this.selectedStudents);
    if(loginCheck){
      loader.present();
      let data = {
        batch_id:this.batch_id,
        st_att: this.selectedStudents,
        // st_att:[ { student_id:this.selectedStudents,selected:this.isSelected } ],
        // selected:this.isSelected
      }
      // console.log("data",data);
      this.generalService.saveAttendance(data).subscribe(response=>{
        console.log(response);
        let msg:string;
        loader.dismiss();
        if(response){
          msg = "Attendance Marked Successfully";
        }else{
          msg = "Error Occuered";
        }
        let att = this.markAtt.create({
        title:'Attendance',
        message:msg,
        buttons:[{
          text: 'Ok',
          handler: data => {
            // console.log('Cancel clicked');
          }
        }]
        });
        att.present();
      })
    }
   // console.log("markAttendance",this.selectedStudents);
  }

}
