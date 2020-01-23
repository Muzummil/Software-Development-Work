import { Injectable } from "@angular/core";
import { Action } from "@ngrx/store";

@Injectable()
export class AppartementActions {

    // Add appartments
    static ADD_APPARTEMENT = "ADD_APPARTEMENT";
    addAppartement(payload: any): Action {
        return {
            type: AppartementActions.ADD_APPARTEMENT,
            payload: payload
        };
    }

    static ADD_APPARTEMENT_SUCCESS = "ADD_APPARTEMENT_SUCCESS";
    addAppartementSuccess(data: any): Action {
        return {
            type: AppartementActions.ADD_APPARTEMENT_SUCCESS,
            payload: data
        };
    }

    static ADD_APPARTEMENT_FAILURE = "ADD_APPARTEMENT_FAILURE";
    addAppartementFailure(data: any): Action {
        return {
            type: AppartementActions.ADD_APPARTEMENT_FAILURE,
            payload: data
        };
    }

    static CLEAR_ADD_APPARTEMENT = "CLEAR_ADD_APPARTEMENT";
    clearaddAppartement(): Action {
        return {
            type: AppartementActions.CLEAR_ADD_APPARTEMENT
        };
    }

    // get by ID
    static GET_APPARTEMENT_BY_ID = "GET_APPARTEMENT_BY_ID";
    getAppartementById(data: any): Action {
        return {
            type: AppartementActions.GET_APPARTEMENT_BY_ID,
            payload: data
        };
    }

    static GET_APPARTEMENT_BY_ID_SUCCESS = "GET_APPARTEMENT_BY_ID_SUCCESS";
    getAppartementByIdSuccess(data: any): Action {
        return {
            type: AppartementActions.GET_APPARTEMENT_BY_ID_SUCCESS,
            payload: data
        };
    }

    static GET_APPARTEMENT_BY_ID_FAILURE = "GET_APPARTEMENT_BY_ID_FAILURE";
    getAppartementByIdFailure(data: any): Action {
        return {
            type: AppartementActions.GET_APPARTEMENT_BY_ID_FAILURE,
            payload: data
        };
    }

    static CLEAR_GET_APPARTEMENT_BY_ID = "CLEAR_GET_APPARTEMENT_BY_ID";
    cleardGetAppartementById(): Action {
        return {
            type: AppartementActions.CLEAR_GET_APPARTEMENT_BY_ID
        };
    }

    // get by All Apartments
    static GET_All_Apartments = "GET_All_Apartments";
    getAllAppartement(): Action {
        return {
            type: AppartementActions.GET_All_Apartments
        };
    }

    static GET_All_Apartments_SUCCESS = "GET_All_Apartments_SUCCESS";
    getAllAppartementSuccess(data: any): Action {
        return {
            type: AppartementActions.GET_All_Apartments_SUCCESS,
            payload: data
        };
    }

    static GET_All_Apartments_FAILURE = "GET_All_Apartments_FAILURE";
    getAllAppartementFailure(data: any): Action {
        return {
            type: AppartementActions.GET_All_Apartments_FAILURE,
            payload: data
        };
    }

    static CLEAR_GET_All_Apartments = "CLEAR_GET_All_Apartments";
    cleardgetAllAppartement(): Action {
        return {
            type: AppartementActions.CLEAR_GET_All_Apartments
        };
    }

}
