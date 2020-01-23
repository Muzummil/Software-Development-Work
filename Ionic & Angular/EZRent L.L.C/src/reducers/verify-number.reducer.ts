import { Action } from "@ngrx/store";
import { UserActions } from "../actions/user.actions";

export type VerifyNumberState = any;

const initialState: VerifyNumberState = {
  verifyNumber: {}
};

export default function (state = initialState, action: Action): VerifyNumberState {
  switch (action.type) {

    case UserActions.VERIFY_NUMBER_SUCCESS:
      return Object.assign({}, state, { verifyNumber: action.payload });

    case UserActions.CLEAR_VERIFY_NUMBER:
      return Object.assign({}, state, { verifyNumber: {} });

    default:
      return state;
  }
}
