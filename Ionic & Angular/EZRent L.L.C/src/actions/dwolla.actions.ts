import { Injectable } from "@angular/core";
import { Action } from "@ngrx/store";

@Injectable()
export class DwollaActions {

    // DWOLLA create custommer actions
    static DWOLLA_CREATE = "DWOLLA_CREATE";
    dwollaCreate(payload: any): Action {
        return {
            type: DwollaActions.DWOLLA_CREATE,
            payload: payload
        };
    }

    static DWOLLA_CREATE_SUCCESS = "DWOLLA_CREATE_SUCCESS";
    dwollaCreateSuccess(data: any): Action {
        return {
            type: DwollaActions.DWOLLA_CREATE_SUCCESS,
            payload: data
        };
    }

    static DWOLLA_CREATE_FAILURE = "DWOLLA_CREATE_FAILURE";
    dwollaCreateFailure(data: any): Action {
        return {
            type: DwollaActions.DWOLLA_CREATE_FAILURE,
            payload: data
        };
    }

    static CLEAR_DWOLLA_CREATE = "CLEAR_DWOLLA_CREATE";
    clearDwollaCreate(): Action {
        return {
            type: DwollaActions.CLEAR_DWOLLA_CREATE
        };
    }

    // DWOLLA create custommer actions
    static DWOLLA_FUNDING = "DWOLLA_FUNDING";
    dwollaFunding(payload: any): Action {
        return {
            type: DwollaActions.DWOLLA_FUNDING,
            payload: payload
        };
    }

    static DWOLLA_FUNDING_SUCCESS = "DWOLLA_FUNDING_SUCCESS";
    dwollaFundingSuccess(data: any): Action {
        return {
            type: DwollaActions.DWOLLA_FUNDING_SUCCESS,
            payload: data
        };
    }

    static DWOLLA_FUNDING_FAILURE = "DWOLLA_FUNDING_FAILURE";
    dwollaFundingFailure(data: any): Action {
        return {
            type: DwollaActions.DWOLLA_FUNDING_FAILURE,
            payload: data
        };
    }

    static CLEAR_DWOLLA_FUNDING = "CLEAR_DWOLLA_FUNDING";
    cleardwollaFunding(): Action {
        return {
            type: DwollaActions.CLEAR_DWOLLA_FUNDING
        };
    }

}
