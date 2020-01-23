import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Language } from '../models/Language';
import { LoaderService } from '../services/loader.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AccountService } from '../../core/account/services/account.service';


@Component({

    selector: 'lang-tag',
    templateUrl: 'languageTag.component.html',
    styleUrls: ['./languageTag.scss'],
})

export class LanguageTagComponent implements OnInit {

    @Input() languageList: Array<Language> = [];

    @Input() maxCount: number = 3;
    @Output() onLanChange = new EventEmitter();

    public languages = [];
    public languages$ = new BehaviorSubject([]);
    public currLan = 'en';
    public fixedTextHash = this.loaderService.getFixedText();

    constructor(public loaderService: LoaderService, public accountService: AccountService) {

    }


    onRemoveElement(index: number) {

        if (index > -1) {
            this.languageList.splice(index, 1);
            this.onLanChange.emit({"languageList": this.languageList});
        }


    }

    onAddElement($event) {

        let lang1 = new Language();
        lang1.id = $event.id;
        lang1.name = $event.name;
        this.languageList.push(lang1);
        this.onLanChange.emit({"languageList": this.languageList});
    }


    excludeList(id) {
        let found = false;
        this.languageList.forEach(val => {
            if (val['id'] == id) {
                found = true;
            }
        });

        return found;
    }

    public ngOnInit() {
        AccountService.s3Loaded$.subscribe((resFlag) => {
            if (resFlag) {
                let lanRes = this.loaderService.getLanguages();
                this.currLan = this.accountService.getCurrLang();
                lanRes.forEach((selval) => {
                    let lang1 = new Language();
                    lang1.id = selval['id'];
                    lang1.name = selval['name'];
                    this.languages.push(lang1);
                });

                this.languages$.next(this.languages);
            }
        });

    }

}
