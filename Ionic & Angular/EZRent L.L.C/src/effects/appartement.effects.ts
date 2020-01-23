
import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';

import { AppartementActions } from '../actions';
import { AppartementService } from '../services/appartement.service';

import { of } from 'rxjs/observable/of';

@Injectable()
export class AppartementEffects {
    constructor(
        private update$: Actions,
        private appartementActions: AppartementActions,
        private svc: AppartementService
    ) {

    }
    @Effect() addAppartement$ = this.update$
        .ofType(AppartementActions.ADD_APPARTEMENT)
        .switchMap((data) => this.svc.addAppartement(data)
            .map(data => this.appartementActions.addAppartementSuccess(data))
            .catch(err => of(this.appartementActions.addAppartementFailure(err)))
        );

    @Effect() clearAppartementError$ = this.update$
        .ofType(AppartementActions.CLEAR_ADD_APPARTEMENT)
        .map(() => this.appartementActions.clearaddAppartement());

    @Effect() getAppartementById$ = this.update$
        .ofType(AppartementActions.GET_APPARTEMENT_BY_ID)
        .switchMap((data) => this.svc.getAppartementById(data)
            .map(data => this.appartementActions.getAppartementByIdSuccess(data))
            .catch(err => of(this.appartementActions.getAppartementByIdFailure(err)))
        );

    @Effect() clearAppartementByIdError$ = this.update$
        .ofType(AppartementActions.CLEAR_GET_APPARTEMENT_BY_ID)
        .map(() => this.appartementActions.cleardGetAppartementById());

    @Effect() getAllAppartement$ = this.update$
        .ofType(AppartementActions.GET_All_Apartments)
        .switchMap((data) => this.svc.getAllAppartement()
            .map(data => this.appartementActions.getAllAppartementSuccess(data))
            .catch(err => of(this.appartementActions.getAllAppartementFailure(err)))
        );

    @Effect() clearAllAppartement$ = this.update$
        .ofType(AppartementActions.CLEAR_GET_All_Apartments)
        .map(() => this.appartementActions.cleardgetAllAppartement());
}
