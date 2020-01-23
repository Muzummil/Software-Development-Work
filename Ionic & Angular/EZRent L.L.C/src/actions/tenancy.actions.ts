import { Injectable } from "@angular/core";
import { Action } from "@ngrx/store";

@Injectable()
export class TenancyActions {

    // create tenancy
    static CREATE_TENANCY = "CREATE_TENANCY";
    createTenancy(payload: any): Action {
        return {
            type: TenancyActions.CREATE_TENANCY,
            payload: payload
        };
    }

    static CREATE_TENANCY_SUCCESS = "CREATE_TENANCY_SUCCESS";
    createTenancySuccess(data: any): Action {
        return {
            type: TenancyActions.CREATE_TENANCY_SUCCESS,
            payload: data
        };
    }

    static CREATE_TENANCY_FAILURE = "CREATE_TENANCY_FAILURE";
    createTenancyFailure(data: any): Action {
        return {
            type: TenancyActions.CREATE_TENANCY_FAILURE,
            payload: data
        };
    }

    static CLEAR_CREATE_TENANCY = "CLEAR_CREATE_TENANCY";
    clearCreateTenancy(): Action {
        return {
            type: TenancyActions.CLEAR_CREATE_TENANCY
        };
    }

    // get tenancy by id
    static GET_TENANCY_BY_ID = "GET_TENANCY_BY_ID";
    getTenancyById(data: any): Action {
        return {
            type: TenancyActions.GET_TENANCY_BY_ID,
            payload: data
        };
    }

    static GET_TENANCY_BY_ID_SUCCESS = "GET_TENANCY_BY_ID_SUCCESS";
    getTenancyByIdSuccess(data: any): Action {
        return {
            type: TenancyActions.GET_TENANCY_BY_ID_SUCCESS,
            payload: data
        };
    }

    static GET_TENANCY_BY_ID_FAILURE = "GET_TENANCY_BY_ID_FAILURE";
    getTenancyByIdFailure(data: any): Action {
        return {
            type: TenancyActions.GET_TENANCY_BY_ID_FAILURE,
            payload: data
        };
    }

    static CLEAR_GET_TENANCY_BY_ID = "CLEAR_GET_TENANCY_BY_ID";
    cleardGetTenancyById(): Action {
        return {
            type: TenancyActions.CLEAR_GET_TENANCY_BY_ID
        };
    }

}
