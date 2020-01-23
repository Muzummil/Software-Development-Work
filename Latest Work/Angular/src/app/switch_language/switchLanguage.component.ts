import { Component, Input } from '@angular/core';
import { AccountService } from '../core/account/services/account.service';
import { ConfigService } from '../shared/config.service';

@Component({
    selector: 'switch-language',
    templateUrl: 'switchLanguage.component.html',
    styleUrls: ['./switchLanguage.scss']
})
export class SwitchLanguageComponent {

    @Input() public showWhiteGlobe: boolean = false;
    @Input() public customClass: boolean = false;
    @Input() public customClass2: boolean = false;
    public showTranslation: boolean = (ConfigService.SHOW_TRANSLATION === 'true');
    constructor(public accountService: AccountService) {

    }

}
