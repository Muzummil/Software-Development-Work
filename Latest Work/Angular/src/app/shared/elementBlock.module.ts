import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { SelectBoxComponent } from '../shared/directives/selectBox.component';
import { AutoComplete1Component } from '../shared/directives/autoComplete1.component';
import { AutoCompDropdownComponent } from '../shared/directives/autoCompDropdown.component';
import { AutoCompleteCityComponent } from '../shared/directives/autoCompleteCity.component';
import { AutoCompleteComponent } from '../shared/directives/autoComplete.component';
import { AutoCompleteCustom } from '../shared/directives/autoCompleteCustom.component';
import { DatePickerComponent } from '../shared/directives/datePicker.component';
import { timePickerComponent } from '../shared/directives/timePicker.component';
import { IntComponent } from '../shared/directives/int.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MultiSelectAutoCompleteComponent    } from '../shared/directives/multiSelectAutoComplete.component';
import { SharedModule } from '../shared/shared.module';

// Directive
import { FocusDirective } from '../shared/directives/focus.directive';
import { MultiSelectBoxComponent } from './directives/multiSelectBox.component';
import { TimeZoneComponent } from './directives/timeZone.component';
import { TimeDurationComponent } from './directives/timeDuration.component';
import { QrCodeComponent } from './directives/qrcode.component';
@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        RouterModule,
        NgbModule,
        SharedModule
        
    ],
    declarations: [
        SelectBoxComponent,
        MultiSelectBoxComponent,
        FocusDirective,
        AutoComplete1Component,
        AutoCompleteCityComponent,
        AutoCompDropdownComponent,
        AutoCompleteComponent,
        AutoCompleteCustom,
        TimeZoneComponent,
        TimeDurationComponent,
        DatePickerComponent,
        timePickerComponent,
        IntComponent,
        QrCodeComponent,
        MultiSelectAutoCompleteComponent

    ],
    exports: [
        SelectBoxComponent,
        FocusDirective,
        AutoComplete1Component,
        AutoCompleteCityComponent,
        AutoCompleteComponent,
        MultiSelectBoxComponent,
        AutoCompDropdownComponent,
        AutoCompleteCustom,
        QrCodeComponent,
        TimeZoneComponent,
        TimeDurationComponent,
        DatePickerComponent,
        timePickerComponent,
        IntComponent,
        MultiSelectAutoCompleteComponent
    ]
})

export class ElementBlockModule {

}
