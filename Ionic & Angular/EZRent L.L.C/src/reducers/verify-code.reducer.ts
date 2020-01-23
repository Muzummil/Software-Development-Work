import { Action } from "@ngrx/store";
import { UserActions } from "../actions/user.actions";

export type VerifyCodeState = any;

const initialState: VerifyCodeState = {
  verifyCode: {}
};

export default function (state = initialState, action: Action): VerifyCodeState {

  switch (action.type) {

    case UserActions.VERIFY_CODE_SUCCESS:
      return Object.assign({}, state, { verifyCode: action.payload });

    case UserActions.CLEAR_VERIFY_CODE:
      return Object.assign({}, state, { verifyCode: {} });

    default:
      return state;
  }
}
