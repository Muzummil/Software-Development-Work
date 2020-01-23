
import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';

import { LandloardActions } from '../actions';
import { LandloardService } from '../services/landloard.service';

import { of } from 'rxjs/observable/of';

@Injectable()
export class LandloardEffects {
    constructor(
        private update$: Actions,
        private landloardActions: LandloardActions,
        private svc: LandloardService
    ) {

    }
    @Effect() landloardBuildings$ = this.update$
        .ofType(LandloardActions.LANDLOARD_BUILDING)
        .switchMap((data) => this.svc.landloardBuildings()
            .map(data => this.landloardActions.landloardBuildingSuccess(data))
            .catch(err => of(this.landloardActions.landloardBuildingFailure(err)))
        );

    @Effect() clearlandloardBuildingsError$ = this.update$
        .ofType(LandloardActions.CLEAR_LANDLOARD_BUILDING)
        .map(() => this.landloardActions.clearlandloardBuilding());
}
