/*
 * Angular 2 decorators and services
 */
import {
  Component,
  ViewEncapsulation
} from '@angular/core';

import {AppEngComponent} from "./app.eng.component";

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app-arb',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './app.eng.ar.component.html',
  styleUrls: ['./scss_arabic/main_arabic.scss']

})
export class AppArbComponent extends AppEngComponent {


  setchangeOrientation(){
    this.accountService.setchangeOrientation('ar');
  }

}
