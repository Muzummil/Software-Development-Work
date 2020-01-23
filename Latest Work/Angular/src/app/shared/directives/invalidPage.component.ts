import {OnInit,Component} from '@angular/core';
import {AccountService} from "../../core/account/services/account.service";
import {ProfileService} from "../../core/services/profile.service";


@Component({

    selector: "invalid-page",
    template: `
        <div class="main-tab load-data-js mobile-tab-top"></div>
           <div role="tabpanel" class="tab-pane active" id="my-profile">
                <div class="commen-container-less" id="followers">
                    <div class="block bottom-gap ">
                        <div class="block-title-2">
                            <h2>Let Your Friends Know About Us With a Click</h2>
                            <p>Please go back to the website home page and try to find your page from the website navigation.</p>
                        </div>
                    </div>
                        <section class="fournotfour"> 
                        <div class="error_pg"> 
                            <div class="four"> <img src="/assets/images/404.svg" [attr.alt]="(accountService.getPageAlt('404','404.svg') | async)"></div>
                            <div class="light">Something Went Wrong! Go Back to <a [routerLink]="['/']">Homepage</a> or  <a (click)="logout()">Logout</a> </div>   
                        </div>
                        </section>
                    
                </div>
            </div>
`
})


export class InvalidPageComponent implements OnInit {


    constructor (public accountService:AccountService, public _profileService:ProfileService) {
        this.accountService.setSwitchFlag(false);
        this.accountService.setPageSeo('404');
    }


    ngOnInit(){

        // this.accountService.getClearStorage();
    }

   onBack() {
        window.history.back();
   }

    logout() {
        this._profileService.getLogOutUser();
    }
}
