import { RouterModule } from '@angular/router';

import { InterviewComponent } from './interview/interview.component';

export const VideoInterviewRoutes = RouterModule.forChild([
    {path: '', component: InterviewComponent}
]);
