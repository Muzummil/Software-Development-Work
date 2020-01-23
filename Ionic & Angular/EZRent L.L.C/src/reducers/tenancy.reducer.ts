import { Action } from "@ngrx/store";
import { TenancyActions } from "../actions/tenancy.actions";

export type TenancyState = any;

const initialState: TenancyState = {
  tenancy: {}
};

export default function (state = initialState, action: Action): TenancyState {

  switch (action.type) {
    case TenancyActions.CREATE_TENANCY_SUCCESS:
      return Object.assign({}, state, { tenancy: action.payload });

    case TenancyActions.CLEAR_CREATE_TENANCY:
      return Object.assign({}, state, { tenancy: {} });

    case TenancyActions.GET_TENANCY_BY_ID_SUCCESS:
      return Object.assign({}, state, { tenancy: action.payload });

    case TenancyActions.CLEAR_GET_TENANCY_BY_ID:
      return Object.assign({}, state, { tenancy: {} });

    default:
      return state;
  }
}
