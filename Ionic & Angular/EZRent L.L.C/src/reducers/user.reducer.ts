import { Action } from "@ngrx/store";
import { UserActions } from "../actions/user.actions";

export type UserState = any;

const initialState: UserState = {
  user: {}
};

export default function (state = initialState, action: Action): UserState {

  switch (action.type) {
    case UserActions.GET_USER_SUCCESS:
      return Object.assign({}, state, { user: action.payload });

    case UserActions.CLEAR_USER_SUCCESS:
      return Object.assign({}, state, { user: {} });

    default:
      return state;
  }
}
