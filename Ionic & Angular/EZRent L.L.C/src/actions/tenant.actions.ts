import { Injectable } from "@angular/core";
import { Action } from "@ngrx/store";

@Injectable()
export class TenantActions {

    //  Get all tenant buildings
    static GET_TENANT_BUILDINGS = "GET_TENANT_BUILDINGS";
    getTenantBuildings(): Action {
        return {
            type: TenantActions.GET_TENANT_BUILDINGS
        };
    }

    static GET_TENANT_BUILDINGS_SUCCESS = "GET_TENANT_BUILDINGS_SUCCESS";
    getTenantBuildingsSuccess(data: any): Action {
        return {
            type: TenantActions.GET_TENANT_BUILDINGS_SUCCESS,
            payload: data
        };
    }

    static GET_TENANT_BUILDINGS_FAILURE = "GET_TENANT_BUILDINGS_FAILURE";
    getTenantBuildingsFailure(data: any): Action {
        return {
            type: TenantActions.GET_TENANT_BUILDINGS_FAILURE,
            payload: data
        };
    }

    static CLEAR_GET_TENANT_BUILDINGS = "CLEAR_GET_TENANT_BUILDINGS";
    cleargetTenantBuildings(): Action {
        return {
            type: TenantActions.CLEAR_GET_TENANT_BUILDINGS
        };
    }

    // get all tenants
    static GET_TENANT = "GET_TENANT";
    getAllTenant(): Action {
        return {
            type: TenantActions.GET_TENANT
        };
    }

    static GET_TENANT_SUCCESS = "GET_TENANT_SUCCESS";
    getAllTenantSuccess(data: any): Action {
        return {
            type: TenantActions.GET_TENANT_SUCCESS,
            payload: data
        };
    }

    static GET_TENANT_FAILURE = "GET_TENANT_FAILURE";
    getAllTenantFailure(data: any): Action {
        return {
            type: TenantActions.GET_TENANT_FAILURE,
            payload: data
        };
    }

    static CLEAR_GET_TENANT = "CLEAR_GET_TENANT";
    cleargetAllTenant(): Action {
        return {
            type: TenantActions.CLEAR_GET_TENANT
        };
    }


    // get all tenants by Apartment id
    static GET_TENANT_APPARTMENT_ID = "GET_TENANT_APPARTMENT_ID";
    getAllTenantAppartmentID(data: any): Action {
        return {
            type: TenantActions.GET_TENANT_APPARTMENT_ID,
            payload: data
        };
    }

    static GET_TENANT_APPARTMENT_ID_SUCCESS = "GET_TENANT_APPARTMENT_ID_SUCCESS";
    getAllTenantAppartmentIDSuccess(data: any): Action {
        return {
            type: TenantActions.GET_TENANT_APPARTMENT_ID_SUCCESS,
            payload: data
        };
    }

    static GET_TENANT_APPARTMENT_ID_FAILURE = "GET_TENANT_APPARTMENT_ID_FAILURE";
    getAllTenantAppartmentIDFailure(data: any): Action {
        return {
            type: TenantActions.GET_TENANT_APPARTMENT_ID_FAILURE,
            payload: data
        };
    }

    static CLEAR_GET_TENANT_APPARTMENT_ID = "CLEAR_GET_TENANT_APPARTMENT_ID";
    clearGetAllTenantAppartmentID(): Action {
        return {
            type: TenantActions.CLEAR_GET_TENANT_APPARTMENT_ID
        };
    }


}
