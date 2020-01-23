// angular
import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';

// Components
import { SwitchLanguageComponent } from './switchLanguage.component';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
    imports: [CommonModule],
    declarations: [SwitchLanguageComponent],
    providers: [],
    exports: [SwitchLanguageComponent]
})
export class SwitchLanguageModule {

}
