import { Action } from "@ngrx/store";
import { AuthActions } from "../actions/auth.actions";

export type AuthState = any;

const initialState: AuthState = {
  id_token: "",
  error: {}
};

export default function (state = initialState, action: Action): AuthState {
  switch (action.type) {
    case AuthActions.LOGIN_SUCCESS:
      return Object.assign({}, state, { id_token: action.payload, error: {} });
    case AuthActions.LOGIN_FAILURE:
      return Object.assign({}, state, { error: action.payload, id_token: "" });
    case AuthActions.CLEAR_ERROR_SUCCESS:
      return Object.assign({}, state, { error: {}, id_token: "" });
    case AuthActions.CLEAR_LOGIN_SUCCESS:
      return Object.assign({}, state, { id_token: "", error: {} });
    default:
      return state;
  }
}
