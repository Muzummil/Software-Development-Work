import { Injectable } from "@angular/core";
import { Action } from "@ngrx/store";

@Injectable()
export class LandloardActions {

    // Get all landlord buildings
    static LANDLOARD_BUILDING = "LANDLOARD_BUILDING";
    landloardBuilding(): Action {
        return {
            type: LandloardActions.LANDLOARD_BUILDING
        };
    }

    static LANDLOARD_BUILDING_SUCCESS = "LANDLOARD_BUILDING_SUCCESS";
    landloardBuildingSuccess(data: any): Action {
        return {
            type: LandloardActions.LANDLOARD_BUILDING_SUCCESS,
            payload: data
        };
    }

    static LANDLOARD_BUILDING_FAILURE = "LANDLOARD_BUILDING_FAILURE";
    landloardBuildingFailure(data: any): Action {
        return {
            type: LandloardActions.LANDLOARD_BUILDING_FAILURE,
            payload: data
        };
    }

    static CLEAR_LANDLOARD_BUILDING = "CLEAR_LANDLOARD_BUILDING";
    clearlandloardBuilding(): Action {
        return {
            type: LandloardActions.CLEAR_LANDLOARD_BUILDING
        };
    }

}
