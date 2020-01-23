import { Component } from '@angular/core';
import { NavController, App,NavParams,AlertController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { UserService,CacheService,GeneralService} from '../../app/shared/services';
import { SharedModule } from '../../app/shared';
import { AttendancePage } from '../attendance/attendance';
import { SettingsPage } from '../settings/settings';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
	public classesData:any;
	public subjectsData:any;
	public firstDataIndex:any;
  public subjectPart:boolean=false;
	public noClass:boolean=false;
  public name:string;
  public selectedClass:any;
  public selectedSubject:any;
  public selectedValues:any;

  constructor(public app:App,public navCtrl: NavController,
              public navParams: NavParams,public generalService:GeneralService,
              public userService:UserService,public shared:SharedModule,
              public cacheService:CacheService,public unSelectedClass: AlertController,
             )  {}
  settingPage(){
    // console.log("sett");
    this.navCtrl.push(SettingsPage);
  }
  ionViewDidLoad() {
    this.name = this.cacheService.getIndependent('user_name');
    // console.log("na",this.name);
  	let login = this.shared.loginCheck();
  	if(login==false){
  		this.navCtrl.setRoot(LoginPage);
  	}else{
      this.generalService.getClasses().subscribe(response=>{
    	// console.log("john",response);
    	this.classesData = response.data;
      // console.log("sabri",response);
      if(!response.success || !this.classesData){
        this.noClass = true;
      }else{
        this.noClass = false;
      }
    	// console.log("lll",this.classesData);
      });
    }
  }
  onClassChange(e:any){
    // console.log(this.selectedClass);
    this.selectedValues = this.selectedClass.split(",");
    // console.log("changed");
  	// this.subjectPart  = true;
  	// this.subjectsData = [];
  	// this.generalService.getSubjects(this.selectedClass).subscribe(response=>{
  	// 	console.log("subj",response);
  	// 	this.subjectsData = response.data;
  	// })
  }
  // onSubjectChange(eventValues:any){
  //   console.log(this.selectedSubject);
  //   this.selectedValues = this.selectedSubject.split(",");
  // }
  goToAttendance(){
    if(this.selectedValues==undefined || this.selectedValues==null){
      let unselected = this.unSelectedClass.create({
        title:'Un selected Class',
        message:'Please select a class first',
        buttons:[{
          text: 'Cancel',
          handler: data => {
            // console.log('Cancel clicked');
          }
        }]
      });
      unselected.present();
    }else{
      this.navCtrl.push(AttendancePage,{course_id:this.selectedValues[0],
      session_id:this.selectedValues[1],batch_id:this.selectedValues[2]});
    }

    // console.log(this.selectedValues);
//      student_id:this.selectedValues[3]});
    // this.navCtrl.push(AttendancePage,{subject_id:this.selectedValues[0],batch_id:this.selectedValues[1]});
  }
  logout(){
  	this.userService.logout().subscribe(response=>{
  		// console.log(response);
  		const root = this.app.getRootNav();
        root.popToRoot();
	  	this.navCtrl.push(LoginPage);
  	})
  }

}
