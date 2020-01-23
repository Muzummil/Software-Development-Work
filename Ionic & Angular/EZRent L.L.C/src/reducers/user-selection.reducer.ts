import { Action } from "@ngrx/store";
import { UserSelectionActions } from "../actions/user-selection.actions";

export type userSelectionState = any;

const initialState: userSelectionState = {
  userSelected: {}
};

export default function (state = initialState, action: Action): userSelectionState {
  switch (action.type) {
    case UserSelectionActions.USER_SELECTION_SUCCESS:
      return Object.assign({}, state, { userSelected: action.payload });

    case UserSelectionActions.CLEAR_USER_SELECTION:
      return Object.assign({}, state, { userSelected: {} });
    default:
      return state;
  }
}
