import { Component } from '@angular/core';
import { NavController, App,NavParams } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { UserService,CacheService,GeneralService} from '../../app/shared/services';
import { SharedModule } from '../../app/shared';
import { AttendancePage } from '../attendance/attendance';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
	public classesData:any;
	public subjectsData:any;
	public firstDataIndex:any;
	public subjectPart:boolean=false;
  public name:string;
  public selectedClass:any;
  public selectedSubject:any;

  constructor(public app:App,public navCtrl: NavController,
              public navParams: NavParams,public generalService:GeneralService,
              public userService:UserService,public shared:SharedModule,
              public cacheService:CacheService
             )  {}
  ionViewDidLoad() {
    this.name = this.cacheService.getIndependent('user_name');
    // console.log("na",this.name);
  	let login = this.shared.loginCheck();
  	if(login==false){
  		this.navCtrl.push(LoginPage);
  	}else{
      this.generalService.getClasses().subscribe(response=>{
    	console.log("john",response);
    	this.classesData = response.data;
    	console.log("lll",this.classesData);
      });
    }
  }
  onClassChange(e:any){
    console.log(this.selectedClass);
  	this.subjectPart  = true;
  	this.subjectsData = [];
  	console.log("ww",e);
  	this.generalService.getSubjects(this.selectedClass).subscribe(response=>{
  		console.log("subj",response);
  		this.subjectsData = response.data;
  	})
  }
  onSubjectChange(eventValues:any){
    console.log(this.selectedSubject);
    let twoValues = this.selectedSubject.split(",");
    this.navCtrl.push(AttendancePage,{subject_id:twoValues[0],batch_id:twoValues[1]});
    console.log(twoValues);
  }
  goToLogin(){
  	console.log("login");
  	this.navCtrl.push(LoginPage);
  }
  logout(){
  	this.userService.logout().subscribe(response=>{
  		console.log(response);
  		const root = this.app.getRootNav();
        root.popToRoot();
	  	this.navCtrl.push(LoginPage);
  	})
  }

}
