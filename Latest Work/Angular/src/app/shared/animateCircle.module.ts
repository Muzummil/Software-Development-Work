// angular
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { JobSeekerRoutes } from './jobseeker.routes';
import { AnimateCircleComponent } from './animateCircle.component';


/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
    imports: [],
    declarations: [
        AnimateCircleComponent
    ],
    providers: [],

    exports: [
        AnimateCircleComponent
    ]
})
export class AnimateCircleModule {

    constructor(@Optional() @SkipSelf() parentModule: AnimateCircleModule) {
        if (parentModule) {
            throw new Error('AnimateCircleModule already loaded; Import in root module only.');
        }
    }
}
