import { Action } from "@ngrx/store";
import { AppartementActions } from "../actions/appartement.actions";

export type AppartementState = any;

const initialState: AppartementState = {
  appartement: {},
  appartements: {}
};

export default function (state = initialState, action: Action): AppartementState {

  switch (action.type) {
    case AppartementActions.ADD_APPARTEMENT_SUCCESS:
      return Object.assign({}, state, { appartement: action.payload });

    case AppartementActions.CLEAR_ADD_APPARTEMENT:
      return Object.assign({}, state, { appartement: {} });

    case AppartementActions.GET_APPARTEMENT_BY_ID_SUCCESS:
      return Object.assign({}, state, { appartement: action.payload });

    case AppartementActions.CLEAR_GET_APPARTEMENT_BY_ID:
      return Object.assign({}, state, { appartement: {} });

    case AppartementActions.GET_All_Apartments_SUCCESS:
      return Object.assign({}, state, { appartements: action.payload });

    case AppartementActions.CLEAR_GET_All_Apartments:
      return Object.assign({}, state, { appartements: {} });

    default:
      return state;
  }
}
