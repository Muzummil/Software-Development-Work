import { Action } from "@ngrx/store";
import { BuildingActions } from "../actions/buildings.actions";

export type BuildingState = any;

const initialState: BuildingState = {
  building: {},
  buildingID: {}
};

export default function (state = initialState, action: Action): BuildingState {

  switch (action.type) {
    case BuildingActions.ADD_BUILDING_SUCCESS:
      return Object.assign({}, state, { building: action.payload });

    case BuildingActions.CLEAR_ADD_BUILDING:
      return Object.assign({}, state, { building: {} });

    case BuildingActions.GET_BUILDING_BY_ID_SUCCESS:
      return Object.assign({}, state, { buildingID: action.payload });

    case BuildingActions.CLEAR_GET_BUILDING_BY_ID:
      return Object.assign({}, state, { buildingID: {} });

    case BuildingActions.GET_ALL_BUILDINGS_SUCCESS:
      return Object.assign({}, state, { building: action.payload });

    case BuildingActions.CLEAR_GET_ALL_BUILDINGS:
      return Object.assign({}, state, { building: {} });

    default:
      return state;
  }
}
