import { SearchCandidatesComponent } from './searchCandidates/searchCandidates.component';
import { ListCandidatesComponent } from './listCandidates/listCandidates.component';
import { CandidateProfileComponent } from './candidateProfile/candidateProfile.component';
import { CandidateProfileComComponent } from './candidateProfileCom/candidateProfileCom.component';

import { RouterModule } from '@angular/router';

// Guards
import { CanEmpActivateGuard } from '../../canEmpActivateGuard.guard';
import { CandidateHistoryComponent } from './candidateHistory/candidateHistoryComponent';
import { EvaluationFormComponent } from '../evaluationForm/evaluationForm.component';

export const CandidateRoutingModule = RouterModule.forChild([
    {
        path: '',
        component: SearchCandidatesComponent
    }, {
        path: 'list',
        component: ListCandidatesComponent
    },
    {
        path: ':id/profile',
        component: CandidateProfileComponent
        , canActivate: [CanEmpActivateGuard]
    }
    , {
        path: ':id/:candidate_name/profile',
        component: CandidateProfileComponent
        , canActivate: [CanEmpActivateGuard]
    },
    {
        path: ':id/:candidate_name/history',
        component: CandidateHistoryComponent
        , canActivate: [CanEmpActivateGuard]
    },
    {
        path: ':id/communication',
        component: CandidateProfileComComponent
        , canActivate: [CanEmpActivateGuard]
    }, {
        path: ':id/:candidate_name/communication',
        component: CandidateProfileComComponent
        , canActivate: [CanEmpActivateGuard]
    }
    , {
        path: 'evaluation-form',
        component: EvaluationFormComponent
        , canActivate: [CanEmpActivateGuard]
    }

]);
