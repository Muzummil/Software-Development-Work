import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Language } from '../models/Language';
import { LoaderService } from "../services/loader.service";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { AccountService } from '../../core/account/services/account.service';


@Component({
    selector: 'mob-lang-tag',
    styleUrls: ['./mobLanguageTag.scss'],
    templateUrl: 'mobLanguageTag.component.html'
})

export class MobLanguageTagComponent implements OnInit {

    @Input() languageList: Array<Language> = [];
    @Input() errorFlag: boolean = false;

    @Input() maxCount: number = 3;
    @Output() onLanChange = new EventEmitter();

    public languages = [];
    public languages_bkup = [];
    public languages$ = new BehaviorSubject([]);
    public currLan = 'en';
    public fixedTextHash = this.loaderService.getFixedText();

    constructor(public loaderService: LoaderService, public accountService: AccountService) {
        this.currLan = this.accountService.getCurrLang();
    }

    public onRemoveElement(index: number) {
        if (index > -1) {

            this.languageList.splice(index, 1);
            this.rebuidList();
            this.onLanChange.emit({languageList: this.languageList});
        }
    }

    public rebuidList() {
        Object.assign(this.languages, this.languages_bkup);

        this.languages.forEach((selval, index) => {

            this.languageList.forEach((val) => {

                if (selval.id === val.id) {
                    let lang1 = new Language();
                    lang1.id = selval.id;
                    lang1.name = selval.name;
                    this.languages.splice(index, 1);
                }
            });
        });
    }

    public onAddElement($event) {

        let lang1 = new Language();
        lang1.id = $event.id;
        lang1.name = $event.name;
        this.languageList.push(lang1);
        this.onLanChange.emit({languageList: this.languageList});
    }

    public  onAddElement2(value) {
        let newLangList = [];
        this.languages$.subscribe((lang) => {
            lang.forEach((selval, index) => {
                newLangList.push(selval);
                if (selval.id == value) {
                    let lang1 = new Language();
                    lang1.id = selval.id;
                    lang1.name = selval.name;
                    this.languageList.push(lang1);
                    lang.splice(index, 1);
                    this.onLanChange.emit({languageList: this.languageList});
                }
            });
        });
    }

    public ngOnInit() {

        AccountService.s3Loaded$.subscribe((resFlag) => {
            if (resFlag) {
                let lanRes = this.loaderService.getLanguages();

                lanRes.forEach((selval) => {

                    let lang1 = new Language();

                    lang1.id = selval['id'];
                    lang1.name = selval['name'];
                    this.languages.push(lang1);
                });

                Object.assign(this.languages_bkup, this.languages);
                this.languages$.next(this.languages);
            }
        });

    }

}
