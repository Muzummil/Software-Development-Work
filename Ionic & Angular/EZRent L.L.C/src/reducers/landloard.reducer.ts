import { Action } from "@ngrx/store";
import { LandloardActions } from "../actions/landloard.actions";

export type LandloardState = any;

const initialState: LandloardState = {
  landloard: {}
};

export default function (state = initialState, action: Action): LandloardState {

  switch (action.type) {
    case LandloardActions.LANDLOARD_BUILDING_SUCCESS:
      return Object.assign({}, state, { landloard: action.payload });

    case LandloardActions.CLEAR_LANDLOARD_BUILDING:
      return Object.assign({}, state, { landloard: {} });

    default:
      return state;
  }
}
