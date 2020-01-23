import {Input,OnInit,Output,EventEmitter,Component,ChangeDetectionStrategy} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Subscription} from 'rxjs/Subscription';

/**
 * Services
 */
import {ProfileService} from '../../core/services/profile.service';

//Models
import {JobSeekerSkills} from './models/JobSeekerSkills';
import {AccountService} from "../../core/account/services/account.service";
import {LoaderService} from "../../shared/services/loader.service";
import {ConfigService} from '../../shared/config.service'
import {Observable} from "rxjs/Observable";

@Component({
    selector: "profile-skills",
    templateUrl: "skills.component.html",
    styleUrls: ['./skills.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})


export class SkillsComponent  implements OnInit{


    @Output() onUpdateProfileStatus= new EventEmitter();
    @Input() skills:BehaviorSubject<any>;
    public skills_status = "read";

    //Flags
    public savingmode = false;
    public cancelmode = false;
    public validSkillLength = 50;

    //Obervable flags
    public savingmode$:BehaviorSubject<any> = new BehaviorSubject(false);
    public errorflag$:BehaviorSubject<any> = new BehaviorSubject(false);

    //Observables
    public skills$:BehaviorSubject<any> = new BehaviorSubject(null);


    public skillList:JobSeekerSkills[] = [];
    public skillListBackup:JobSeekerSkills[] = [];
    public newSkill;
    public profileCacheDirty = false;
    public clearSkillFlag = false;
    public checkboxkeycnt = 0;

    public screenwidth=0;
    public mobileScreen=ConfigService.mobileScreen;


    //Subscriptions
    public skillsSubscription:Subscription;
    public skills2Subscription:Subscription;
    public updateskillsSubscription:Subscription;
    public timerSubscription:Subscription;
    public currLan = "en";
    public fixedTextHash = this.loaderService.getFixedText();

    ngOnDestroy() {

        if(this.skillsSubscription)
            this.skillsSubscription.unsubscribe();

        if(this.skills2Subscription)
            this.skills2Subscription.unsubscribe();

        if(this.updateskillsSubscription)
            this.updateskillsSubscription.unsubscribe();

        if(this.timerSubscription)
            this.timerSubscription.unsubscribe();


        if(this.profileCacheDirty){
            AccountService.profileCacheDirty = true;
        }
    }

    constructor(public _profileservice:ProfileService,
                public loaderService:LoaderService,
                public accountService:AccountService) {

        this.createNewSkill();
    }


   public getCreateSkills() {


       this.skillsSubscription = this.skills.subscribe(res => {

           if(res != null) {

               let listskills = [];
               res.forEach(obj=>{
                   listskills.push(this.getSkill(obj));
               })

               this.skillListBackup = listskills.slice();
               this.skillList = listskills;

               this.skills$.next(this.skillList);


           }
       });
   }

    ngOnInit(): void {
        window.scroll(0,0);
        this.errorflag$.next(false);
        this.getCreateSkills();
        this.currLan = this.accountService.getCurrLang();
    }

    createNewSkill()
    {

        this.checkboxkeycnt++;
        this.newSkill = new JobSeekerSkills();
        this.newSkill.level = 1;
        this.newSkill.name = "";
        this.newSkill.checkboxkey = this.checkboxkeycnt;
    }


    getSkill(obj){
        this.checkboxkeycnt++;
        let newSkill = new JobSeekerSkills();
         newSkill.level = obj.level;
         newSkill.name = obj.name;
         newSkill.checkboxkey = this.checkboxkeycnt;

         return newSkill;
    }



    onRead() {
        this.skills_status = "read";
    }

    addNewSkillLevel(level:number){
        this.newSkill.level =level;
    }

    addNewSkillName($event){

        this.newSkill.id = $event["id"];
        this.newSkill.name = $event["name"];
    }


    onCancel() {
        this.onRead();
        this.cancelmode = true;
        this.skillList = this.skillListBackup.slice();
        this.skills$.next(this.skillList);



    }

    onEdit() {
        this.skills_status = "edit";
    }


    onSave() {

        if(this.skillList.length == 0)
        {
            this.profileCacheDirty = true;
            return;

        }

        this.savingmode = true;
        this.savingmode$.next(true);
        this.errorflag$.next(false);
        this.skills_status = "read";

        this.skills2Subscription = this.skills$.subscribe(val =>{

        });
        let postData = {"jobseeker":{"skills":this.skillList}};


        this.updateskillsSubscription = this._profileservice.updatSkills(postData)
            .subscribe(res=>{
                            this.profileCacheDirty = true;
                            this.skillList = [];
                            res["jobseekers"].forEach(res1=>{

                                this.checkboxkeycnt++;
                               let selJobseeker = new JobSeekerSkills();
                                selJobseeker.id = res1.id;
                                selJobseeker.name = res1.name;
                                selJobseeker.level = res1.level;
                                selJobseeker.checkboxkey = this.checkboxkeycnt;
                                this.skillList.push(selJobseeker);


                            });

                            this.skillListBackup = this.skillList.slice();
                            this.skills$.next(this.skillList);
                            this.onUpdateProfileStatus.emit({"update":true});
            },error=> {
                this.savingmode$.next(false);this.errorflag$.next(true);
                if (error.status == 401) {
                   this._profileservice.getLogOutUser();
                }
            }, () => this.savingmode$.next(false));
    }



    onAdd() {

        if(this.newSkill.name != "" &&this.newSkill.name.length <= this.validSkillLength )
        {
            this.skillList.unshift(this.newSkill);
            this.skills$.next(this.skillList);
            this.clearSkillFlag = true;
            this.timerSubscription = Observable.timer(2000).subscribe(cnt=>{
               this.clearSkillFlag = false;
            });

            this.createNewSkill();
        }


    }

    onDel(id:number) {

        this.skillList.splice(id, 1);
        this.skills$.next(this.skillList);

    }
}