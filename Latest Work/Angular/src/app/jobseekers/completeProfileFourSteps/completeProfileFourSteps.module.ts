// angular
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

// Routes

// Modules
import { VideoModule } from '../../shared/video.module';
import { LanguageModule } from '../../shared/language.module';
import { UploadModule } from '../../shared/upload.module';
import { SharedModule } from '../../shared/shared.module';
import { ElementBlockModule } from '../../shared/elementBlock.module';
import { DatePipeModule } from '../../shared/datePipe.module';
import { ImageCropperModule } from 'ng2-img-cropper/src/imageCropperModule';
import { SafePipeModule } from '../../shared/safePipe.module';

// Services

// Components
import { CompleteProfileFourStepsRoutes } from './completeProfileFourSteps.routes';
import { StepOneComponent } from './stepOne/stepOne.component';
import { ProgressBarComponent } from './progressBar/progressBar.component';
import { StepTwoComponent } from './stepTwo/stepTwo.component';
import { StepThreeComponent } from './stepThree/stepThree.component';
import { AddEducationComponent } from './addEducation/addEducation.component';
import { StepTwoSkillsComponent } from './stepTwoSkills/stepTwoSkills.component';
import { WorkExperienceStepTwoComponent } from './workExperienceStepTwo/workExperienceStepTwo.component';
import { StepFourComponent } from './stepFour/stepFour.component';
import { CombinedStepsComponent } from './combinedSteps/combinedSteps.component';
/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        UploadModule,
        SharedModule,
        LanguageModule,
        VideoModule,
        ReactiveFormsModule,
        ElementBlockModule,
        DatePipeModule,
        SafePipeModule,
        ImageCropperModule,
        CompleteProfileFourStepsRoutes,
    ],
    declarations: [
        ProgressBarComponent,
        AddEducationComponent,
        StepOneComponent,
        StepTwoComponent,
        StepThreeComponent,
        StepFourComponent,
        CombinedStepsComponent,
        StepTwoSkillsComponent,
        WorkExperienceStepTwoComponent
    ],
    providers: [
    ],
    exports: []
})
export class CompleteProfileFourStepsModule {

    constructor(@Optional() @SkipSelf() parentModule: CompleteProfileFourStepsModule) {
        if (parentModule) {
            throw new Error('CompleteProfileFourStepsModule already loaded; ' +
                'Import in root module only.');
        }
    }
}
