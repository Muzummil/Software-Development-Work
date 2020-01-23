import {
    Component,
    OnInit,
    Input,
    EventEmitter,
    Output,
    ChangeDetectionStrategy
} from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { AccountService } from '../../../core/account/services/account.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { JobSeekerSkills } from '../../profile/models/JobSeekerSkills';

@Component({
    selector: 'step-two-skills',
    templateUrl: 'stepTwoSkills.component.html',
    styleUrls: ['./stepTwoSkills.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush

})

export class StepTwoSkillsComponent implements OnInit {

    @Input()  public maxCount = 5;
    @Input()  public skillList = [];
    @Output() public selectSkills = new EventEmitter();
    @Output() public errorSkills = new EventEmitter(false);
    @Input()  public error: boolean = false;

    public skillListObs = new BehaviorSubject(null);
    public currentCnt = 1;
    public validMaxSkillLength = 50;
    public showErrors: boolean = false;
    public placeholder = '';
    public firstLoadFlags = true;
    public clearFlag = false;
    public currLan = 'en';
    public fixedTextHash = this.loaderService.getFixedText();
    public newSkill = new JobSeekerSkills();

    constructor(public accountService: AccountService,
                public loaderService: LoaderService) {

    }

    public ngOnInit() {
        this.currLan = this.accountService.getCurrLang();
        this.placeholder = this.fixedTextHash['add_skills'][this.currLan];
        window.scroll(0, 0);
        if (this.skillList.length > 0) {
            this.skillList = this.skillList.slice(0, this.maxCount);
        }
        this.skillListObs.next(this.skillList);
    }

    // Emitting Skills
    public getEmitSkills() {
        this.selectSkills.emit(this.skillList);
        this.getReset();
    }

    // Resetting Skills
    public getReset() {
        this.showErrors = false;
        this.firstLoadFlags = true;
    }

    // Setting skill name
    public setSkillName($event) {
        this.newSkill.name = $event['name'];
    }

    // Setting skill level
    public setSkillLevel(level) {
        this.newSkill.level = level;
    }

    // Adding new skill
    public addNewSkillName() {
        // if skill has a name and limit is less equal to max limit
        if (this.newSkill.name && this.newSkill.name.length <= this.validMaxSkillLength &&
        this.skillList.length < this.maxCount &&
            this.skillList.filter((selfil) => (selfil.name === this.newSkill.name))
                .length === 0 ) {
            this.skillList.push(this.newSkill);
            this.skillListObs.next(this.skillList);
            this.newSkill = new JobSeekerSkills();
            this.errorSkills.emit(false);
            this.getEmitSkills();
            this.clearFlag = true;
        } else {
            this.errorSkills.emit(true);
            this.showErrors = true;

        }

    }
    // Clear skill in text box
    public getResetClearFlag() {
        this.clearFlag = false;
    }

    // Removing a skill
    public getRemoveSkill(sIndex: number) {
        this.skillList.splice(sIndex, 1);
        this.skillListObs.next(this.skillList);
        this.getEmitSkills();
    }

    // Validate Unique Skill
    public getValidateUniqueSkill() {
        return (this.skillList.filter((selfil) => (selfil.name === this.newSkill.name))
            .length > 0);
    }
}
