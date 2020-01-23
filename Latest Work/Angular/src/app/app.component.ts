import { Component, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';

import { AccountService } from './core/account/services/account.service';
import { MetaService } from 'ng2-meta';

declare let ga: Function;

/*
 * App Component
 * Top Level Component
 */
@Component({
    selector: 'app',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './app.component.html',
})
export class AppComponent {

    public language = 'en';
    constructor(private location: Location, public accountService: AccountService) {

    }

}
