import { Action } from "@ngrx/store";
import { TenantActions } from "../actions/tenant.actions";

export type TenantState = any;

const initialState: TenantState = {
  tenantBuildings: {},
  allTenant: {},
  apartmentTenant: {}

};

export default function (state = initialState, action: Action): TenantState {

  switch (action.type) {
    case TenantActions.GET_TENANT_BUILDINGS_SUCCESS:
      return Object.assign({}, state, { tenantBuildings: action.payload });

    case TenantActions.CLEAR_GET_TENANT_BUILDINGS:
      return Object.assign({}, state, { tenantBuildings: {} });

    case TenantActions.GET_TENANT_SUCCESS:
      return Object.assign({}, state, { allTenant: action.payload });

    case TenantActions.CLEAR_GET_TENANT:
      return Object.assign({}, state, { allTenant: {} });

    case TenantActions.GET_TENANT_APPARTMENT_ID_SUCCESS:
      return Object.assign({}, state, { apartmentTenant: action.payload });

    case TenantActions.CLEAR_GET_TENANT_APPARTMENT_ID:
      return Object.assign({}, state, { apartmentTenant: {} });

    default:
      return state;
  }
}
