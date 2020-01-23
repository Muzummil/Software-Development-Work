
import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';

import { TenancyActions } from '../actions';
import { TenancyService } from '../services/tenancy.service';

import { of } from 'rxjs/observable/of';

@Injectable()
export class TenancyEffects {
    constructor(
        private update$: Actions,
        private tenancyActions: TenancyActions,
        private svc: TenancyService
    ) {

    }
    @Effect() createTenancy$ = this.update$
        .ofType(TenancyActions.CREATE_TENANCY)
        .switchMap((data) => this.svc.createTenancy(data)
            .map(data => this.tenancyActions.createTenancySuccess(data))
            .catch(err => of(this.tenancyActions.createTenancyFailure(err)))
        );

    @Effect() clearCreateTenancyError$ = this.update$
        .ofType(TenancyActions.CLEAR_CREATE_TENANCY)
        .map(() => this.tenancyActions.clearCreateTenancy());

    @Effect() getTenancyById$ = this.update$
        .ofType(TenancyActions.GET_TENANCY_BY_ID)
        .switchMap((data) => this.svc.getTenancyById(data)
            .map(data => this.tenancyActions.getTenancyByIdSuccess(data))
            .catch(err => of(this.tenancyActions.getTenancyByIdFailure(err)))
        );

    @Effect() cleardGetTenancyByIdError$ = this.update$
        .ofType(TenancyActions.CLEAR_GET_TENANCY_BY_ID)
        .map(() => this.tenancyActions.cleardGetTenancyById());
}
