
import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';

import { UserSelectionActions } from '../actions';
import { UserSelectionService } from '../services/user-selection-service';

import { of } from 'rxjs/observable/of';

@Injectable()
export class userSelectionEffects {
    constructor(
        private update$: Actions,
        private userActions: UserSelectionActions,
        private svc: UserSelectionService
    ) { }


    @Effect() userSelection$ = this.update$
        .ofType(UserSelectionActions.USER_SELECTION)
        .switchMap((data) => this.svc.userSelection(data)
            .map(token => this.userActions.userSelectionSuccess(token))
            .catch(err => of(this.userActions.userSelectionFailure(err)))
        );

    @Effect() clearError$ = this.update$
        .ofType(UserSelectionActions.CLEAR_USER_SELECTION)
        .map(() => this.userActions.clearUserSelection());

}
