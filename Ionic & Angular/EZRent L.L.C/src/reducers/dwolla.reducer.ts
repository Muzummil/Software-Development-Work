import { Action } from "@ngrx/store";
import { DwollaActions } from "../actions/dwolla.actions";

export type DwollaState = any;

const initialState: DwollaState = {
  dwolla: {},
  dwollaFunding: {}
};

export default function (state = initialState, action: Action): DwollaState {

  switch (action.type) {
    case DwollaActions.DWOLLA_CREATE_SUCCESS:
      return Object.assign({}, state, { dwolla: action.payload });

    case DwollaActions.CLEAR_DWOLLA_CREATE:
      return Object.assign({}, state, { dwolla: {} });

    case DwollaActions.DWOLLA_FUNDING_SUCCESS:
      return Object.assign({}, state, { dwollaFunding: action.payload });

    case DwollaActions.CLEAR_DWOLLA_FUNDING:
      return Object.assign({}, state, { dwollaFunding: {} });

    default:
      return state;
  }
}
