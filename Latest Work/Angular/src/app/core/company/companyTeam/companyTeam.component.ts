import { File } from '../../../shared/models/File';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Team } from '../../../shared/models/Company';

// Services
import { CompanyService } from '../../../core/services/company.service';
import { AccountService } from '../../../core/account/services/account.service';
import { LoaderService } from '../../../shared/services/loader.service';

declare var jQuery: any;

@Component({
    selector: 'company-team',
    templateUrl: 'companyTeam.component.html',
    styleUrls: ['./companyTeam.scss']
})

export class CompanyTeamComponent implements OnInit {

    // Forms
    @Input()  public companyTeamObs: BehaviorSubject<any> = new BehaviorSubject(null);
    @Input()  public companyId: number = null;

    @Output()  public backEmit: EventEmitter<any> = new EventEmitter();

    // Behavior Subject
    public pristineFlag$: BehaviorSubject<any> = new BehaviorSubject(true);
    public teamPicUpdatedObs: BehaviorSubject<any> = new BehaviorSubject(false);
    public postSuccessFull: boolean = false;
    public file_team;
    public fileTeamList = [];
    public currLan = 'en';
    public fixedTextHash = this.loaderService.getFixedText();
    public  viewMeetOurTeamFlag: boolean = true;
    public isPublic: boolean = false;
    public isEmployer: boolean = false;

    constructor(public _router: Router,
                public accountService: AccountService,
                public loaderService: LoaderService,
                public _companyservice: CompanyService,
                public _fb: FormBuilder) {
        this.currLan = this.accountService.getCurrLang();

    }

    public onBuildFileList() {
        this.companyTeamObs.subscribe((res) => {

            res.forEach((selteam, teamIndex) => {

                this.fileTeamList[teamIndex] =
                    new File(this.fixedTextHash['edit_team'][this.currLan], 'profile',
                        'PNG, JPG', 3, 'MB');
                this.fileTeamList[teamIndex].classMap = 'myteamprofile_desk' + teamIndex;
                this.fileTeamList[teamIndex].mode = 'profile_member';
                this.fileTeamList[teamIndex].formParams.push({
                    title: 'name',
                    value: selteam['name'],
                    placeholder: 'name'
                });
                this.fileTeamList[teamIndex].formParams.push({
                    title: 'position',
                    value: selteam['designation'],
                    placeholder: 'position'
                });
                this.fileTeamList[teamIndex].selId = selteam['id'];
                this.fileTeamList[teamIndex].method = 'PUT';
                this.fileTeamList[teamIndex].rootTag = 'company_member';
                this.fileTeamList[teamIndex].root = 'company_member[avatar]';
                this.fileTeamList[teamIndex].cropperSettings_croppedWidth = 300;
                this.fileTeamList[teamIndex].cropperSettings_croppedHeight = 300;
                this.fileTeamList[teamIndex].cropperSettings_width = 300;
                this.fileTeamList[teamIndex].file_optional = true;
                this.fileTeamList[teamIndex].cropperSettings_height = 300;

            });

            this.file_team =
                new File(this.fixedTextHash['add_new_team'][this.currLan], 'profile',
                    'PNG, JPG', 3, 'MB.');
            this.file_team.classMap = 'myteamprofile_desk';
            this.file_team.mode = 'profile_member';
            this.file_team.formParams.push({title: 'name', value: '', placeholder: 'name'});
            this.file_team.formParams.push({
                title: 'position',
                value: '',
                placeholder: 'position'
            });
            this.file_team.selId = '';
            this.file_team.method = 'POST';
            this.file_team.rootTag = 'company_member';
            this.file_team.root = 'company_member[avatar]';
            this.file_team.cropperSettings_croppedWidth = 300;
            this.file_team.cropperSettings_croppedHeight = 300;
            this.file_team.cropperSettings_width = 300;
            this.file_team.cropperSettings_height = 300;
        });
    }

    public ngOnInit(): void {
        this.currLan = this.accountService.getCurrLang();
        this.isPublic = !this.accountService.getAuth();
        this.isEmployer = this.accountService.getCheckEmployer();
        window.scroll(0, 0);
        this.onBuildFileList();
    }

    public onBack() {
        this.backEmit.emit({operation: 'back'});
    }

    public onTeamPicUploaded($event) {

        if ($event['result']['company_member']) {
            let newFlag = true;
            this.companyTeamObs.value.forEach((selval, selIndex) => {
                if (selval.id === $event['result']['company_member']['id']) {
                    newFlag = false;
                    this.companyTeamObs.value[selIndex]['profileImage'] =
                        $event['result']['company_member']['avatar'];

                    this.companyTeamObs.value[selIndex]['name'] =
                        $event['result']['company_member']['name'];
                    this.companyTeamObs.value[selIndex]['designation'] =
                        $event['result']['company_member']['position'];

                }

                this.teamPicUpdatedObs.next(true);
            });

            if (newFlag === true) {
                let team = new Team();
                team.id = $event['result']['company_member']['id'];
                team.name = $event['result']['company_member']['name'];
                team.designation = $event['result']['company_member']['position'];

                team.profileImage = $event['result']['company_member']['avatar'];
                team.profileVideo = $event['result']['company_member']['video'];
                this.companyTeamObs.value.unshift(team);
            }

            this.onBuildFileList();
        }
    }

    public onDelete(id, index) {
        this._companyservice.getDeleteTeamMember(this.companyId,
            this.companyTeamObs.value[index]['id']).subscribe((res) => {
            this.companyTeamObs.next(res);
            jQuery('.close_delete').modal('hide');

        });
    }

}
