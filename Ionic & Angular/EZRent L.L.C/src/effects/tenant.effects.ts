
import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';

import { TenantActions } from '../actions';
import { TenantService } from '../services/tenant.service';

import { of } from 'rxjs/observable/of';

@Injectable()
export class TenantEffects {
    constructor(
        private update$: Actions,
        private tenantActions: TenantActions,
        private svc: TenantService
    ) {

    }
    @Effect() getTenantBuildings$ = this.update$
        .ofType(TenantActions.GET_TENANT_BUILDINGS)
        .switchMap((data) => this.svc.getTenantBuildings()
            .map(data => this.tenantActions.getTenantBuildingsSuccess(data))
            .catch(err => of(this.tenantActions.getTenantBuildingsFailure(err)))
        );

    @Effect() clearTenantBuildingsError$ = this.update$
        .ofType(TenantActions.CLEAR_GET_TENANT_BUILDINGS)
        .map(() => this.tenantActions.cleargetTenantBuildings());

    @Effect() getAllTenant$ = this.update$
        .ofType(TenantActions.GET_TENANT)
        .switchMap((data) => this.svc.getAllTenant()
            .map(data => this.tenantActions.getAllTenantSuccess(data))
            .catch(err => of(this.tenantActions.getAllTenantFailure(err)))
        );

    @Effect() clearAllTenantError$ = this.update$
        .ofType(TenantActions.CLEAR_GET_TENANT)
        .map(() => this.tenantActions.cleargetAllTenant());

    @Effect() getAllTenantAppartment$ = this.update$
        .ofType(TenantActions.GET_TENANT_APPARTMENT_ID)
        .switchMap((data) => this.svc.getAllTenantApprtmentId(data)
            .map(data => this.tenantActions.getAllTenantAppartmentIDSuccess(data))
            .catch(err => of(this.tenantActions.getAllTenantAppartmentIDFailure(err)))
        );

    @Effect() cleargetAllTenantAppartment$ = this.update$
        .ofType(TenantActions.CLEAR_GET_TENANT_APPARTMENT_ID)
        .map(() => this.tenantActions.clearGetAllTenantAppartmentID());
}
