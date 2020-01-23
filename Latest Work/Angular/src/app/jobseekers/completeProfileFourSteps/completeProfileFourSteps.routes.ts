import { RouterModule } from '@angular/router';
import { StepOneComponent } from './stepOne/stepOne.component';
import { StepTwoComponent } from './stepTwo/stepTwo.component';
import { StepThreeComponent } from './stepThree/stepThree.component';
import { StepFourComponent } from './stepFour/stepFour.component';
import { CombinedStepsComponent } from './combinedSteps/combinedSteps.component';

export const CompleteProfileFourStepsRoutes = RouterModule.forChild([
    {
        path: 'step-one',
        component: StepOneComponent
    },
    {
        path: 'step-two',
        component: StepTwoComponent
    },
    {
        path: 'step-three',
        component: StepThreeComponent
    },
    {
        path: 'step-four',
        component: StepFourComponent
    },
    {
        path:'complete-step-two',
        component:CombinedStepsComponent
    },
    {
        path: 'complete-step-three',
        component: StepFourComponent
    },
    {
        path: 'complete-step-one',
        component: StepOneComponent
    }
]);
