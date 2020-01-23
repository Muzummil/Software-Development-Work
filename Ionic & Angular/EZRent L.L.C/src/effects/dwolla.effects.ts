
import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';

import { DwollaActions } from '../actions';
import { DwollaService } from '../services/dwolla.service';

import { of } from 'rxjs/observable/of';

@Injectable()
export class DwollaEffects {
    constructor(
        private update$: Actions,
        private dwollaActions: DwollaActions,
        private svc: DwollaService
    ) {

    }
    @Effect() dwollaCreate$ = this.update$
        .ofType(DwollaActions.DWOLLA_CREATE)
        .switchMap((data) => this.svc.dwollaCreateCustomer(data)
            .map(data => this.dwollaActions.dwollaCreateSuccess(data))
            .catch(err => of(this.dwollaActions.dwollaCreateFailure(err)))
        );

    @Effect() clearDwollaCreateError$ = this.update$
        .ofType(DwollaActions.CLEAR_DWOLLA_CREATE)
        .map(() => this.dwollaActions.clearDwollaCreate());


    @Effect() dwollaFunding$ = this.update$
        .ofType(DwollaActions.DWOLLA_FUNDING)
        .switchMap((data) => this.svc.dwollaFunding(data)
            .map(data => this.dwollaActions.dwollaFundingSuccess(data))
            .catch(err => of(this.dwollaActions.dwollaFundingFailure(err)))
        );

    @Effect() clearDwollaFundingError$ = this.update$
        .ofType(DwollaActions.CLEAR_DWOLLA_FUNDING)
        .map(() => this.dwollaActions.cleardwollaFunding());
}
