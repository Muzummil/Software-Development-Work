import { Action } from "@ngrx/store";
import { UserActions } from "../actions/user.actions";

export type UserRegisterState = any;

const initialState: UserRegisterState = {
  register: {}
};

export default function (state = initialState, action: Action): UserRegisterState {

  switch (action.type) {

    case UserActions.REGISTER_SUCCESS:
      return Object.assign({}, state, { register: action.payload });

    case UserActions.CLEAR_REGISTER:
      return Object.assign({}, state, { register: {} });

    default:
      return state;
  }
}
