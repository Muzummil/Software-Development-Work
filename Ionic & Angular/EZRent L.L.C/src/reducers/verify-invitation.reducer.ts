import { Action } from "@ngrx/store";
import { InvitationActions } from "../actions/tenant-invitation.action";

export type verifyInvitationState = any;

const initialState: verifyInvitationState = {
  verifyInvitation: {}
};

export default function (state = initialState, action: Action): verifyInvitationState {

  switch (action.type) {

    case InvitationActions.VERIFY_INVITATION_SUCCESS:
      return Object.assign({}, state, { verifyInvitation: action.payload });

    case InvitationActions.CLEAR_VERIFY_INVITATION:
      return Object.assign({}, state, { verifyInvitation: {} });

    default:
      return state;
  }
}
