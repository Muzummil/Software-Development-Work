import { Action } from "@ngrx/store";
import { UserActions } from "../actions/user.actions";

export type PasswordChangeState = any;

const initialState: PasswordChangeState = {
  passwordChange: {}
};

export default function (state = initialState, action: Action): PasswordChangeState {

  switch (action.type) {

    case UserActions.CHANGE_PASSWORD_SUCCESS:
      return Object.assign({}, state, { passwordChange: action.payload });

    case UserActions.CLEAR_PASSWORD:
      return Object.assign({}, state, { passwordChange: {} });

    default:
      return state;
  }
}
