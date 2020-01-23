import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { userCategory } from '../user-category/user-category';

@Component({
  selector: 'page-terms-conditions',
  templateUrl: 'terms-conditions.html'
})
export class TermsCondtionsPage {


  constructor(
    public nav: NavController,
  ) {

  }
  ngOnInit() {

  }
  showItem = true;
  toggleCheckbox() {
    this.showItem = !this.showItem;
  }
  customLabelFunc(e) {
  }

  userCategory() {
    this.nav.setRoot(userCategory);
  }
}
