import { Injectable } from "@angular/core";
import { Action } from "@ngrx/store";

@Injectable()
export class BuildingActions {

    // create buildings details
    static ADD_BUILDING = "ADD_BUILDING";
    addBuilding(payload: any): Action {
        return {
            type: BuildingActions.ADD_BUILDING,
            payload: payload
        };
    }

    static ADD_BUILDING_SUCCESS = "ADD_BUILDING_SUCCESS";
    addBuildingSuccess(data: any): Action {
        return {
            type: BuildingActions.ADD_BUILDING_SUCCESS,
            payload: data
        };
    }

    static ADD_BUILDING_FAILURE = "ADD_BUILDING_FAILURE";
    addBuildingFailure(data: any): Action {
        return {
            type: BuildingActions.ADD_BUILDING_FAILURE,
            payload: data
        };
    }

    static CLEAR_ADD_BUILDING = "CLEAR_ADD_BUILDING";
    clearAddBuilding(): Action {
        return {
            type: BuildingActions.CLEAR_ADD_BUILDING
        };
    }

    // get buildings by id
    static GET_BUILDING_BY_ID = "GET_BUILDING_BY_ID";
    getBuildingById(data: any): Action {
        return {
            type: BuildingActions.GET_BUILDING_BY_ID,
            payload: data
        };
    }

    static GET_BUILDING_BY_ID_SUCCESS = "GET_BUILDING_BY_ID_SUCCESS";
    getBuildingByIdSuccess(data: any): Action {
        return {
            type: BuildingActions.GET_BUILDING_BY_ID_SUCCESS,
            payload: data
        };
    }

    static GET_BUILDING_BY_ID_FAILURE = "GET_BUILDING_BY_ID_FAILURE";
    getBuildingByIdFailure(data: any): Action {
        return {
            type: BuildingActions.GET_BUILDING_BY_ID_FAILURE,
            payload: data
        };
    }

    static CLEAR_GET_BUILDING_BY_ID = "CLEAR_GET_BUILDING_BY_ID";
    clearGetBuildingById(): Action {
        return {
            type: BuildingActions.CLEAR_GET_BUILDING_BY_ID
        };
    }

    // get all buildings
    static GET_ALL_BUILDINGS = "GET_ALL_BUILDINGS";
    getAllBuildings(): Action {
        return {
            type: BuildingActions.GET_ALL_BUILDINGS
        };
    }

    static GET_ALL_BUILDINGS_SUCCESS = "GET_ALL_BUILDINGS_SUCCESS";
    getAllBuildingsSuccess(data: any): Action {
        return {
            type: BuildingActions.GET_ALL_BUILDINGS_SUCCESS,
            payload: data
        };
    }

    static GET_ALL_BUILDINGS_FAILURE = "GET_ALL_BUILDINGS_FAILURE";
    getAllBuildingsFailure(data: any): Action {
        return {
            type: BuildingActions.GET_ALL_BUILDINGS_FAILURE,
            payload: data
        };
    }

    static CLEAR_GET_ALL_BUILDINGS = "CLEAR_GET_ALL_BUILDINGS";
    clearGetAllBuildings(): Action {
        return {
            type: BuildingActions.CLEAR_GET_ALL_BUILDINGS
        };
    }
}
