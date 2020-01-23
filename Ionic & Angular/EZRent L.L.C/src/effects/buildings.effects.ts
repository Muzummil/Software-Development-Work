
import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';

import { BuildingActions } from '../actions';
import { BuildingService } from '../services/buildings.service';

import { of } from 'rxjs/observable/of';

@Injectable()
export class BuildingEffects {
    constructor(
        private update$: Actions,
        private buildingActions: BuildingActions,
        private svc: BuildingService
    ) {

    }
    @Effect() addBuilding$ = this.update$
        .ofType(BuildingActions.ADD_BUILDING)
        .switchMap((data) => this.svc.addBuilding(data)
            .map(data => this.buildingActions.addBuildingSuccess(data))
            .catch(err => of(this.buildingActions.addBuildingFailure(err)))
        );

    @Effect() clearBuildingError$ = this.update$
        .ofType(BuildingActions.CLEAR_ADD_BUILDING)
        .map(() => this.buildingActions.clearAddBuilding());

    @Effect() getBuildingById$ = this.update$
        .ofType(BuildingActions.GET_BUILDING_BY_ID)
        .switchMap((data) => this.svc.getBuildingById(data)
            .map(data => this.buildingActions.getBuildingByIdSuccess(data))
            .catch(err => of(this.buildingActions.getBuildingByIdFailure(err)))
        );

    @Effect() clearBuildingByIdError$ = this.update$
        .ofType(BuildingActions.CLEAR_GET_BUILDING_BY_ID)
        .map(() => this.buildingActions.clearGetBuildingById());

    @Effect() getAllBuildings$ = this.update$
        .ofType(BuildingActions.GET_ALL_BUILDINGS)
        .switchMap((data) => this.svc.getAllBuildings()
            .map(data => this.buildingActions.getAllBuildingsSuccess(data))
            .catch(err => of(this.buildingActions.getAllBuildingsFailure(err)))
        );

    @Effect() clearAllBuildingsError$ = this.update$
        .ofType(BuildingActions.CLEAR_GET_ALL_BUILDINGS)
        .map(() => this.buildingActions.clearGetAllBuildings());
}
