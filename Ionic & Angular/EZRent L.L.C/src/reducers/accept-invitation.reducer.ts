import { Action } from "@ngrx/store";
import { InvitationActions } from "../actions/tenant-invitation.action";

export type acceptInvitationState = any;

const initialState: acceptInvitationState = {
  acceptInvitation: {}
};

export default function (state = initialState, action: Action): acceptInvitationState {
  switch (action.type) {

    case InvitationActions.VERIFY_INVITATION_SUCCESS:
      return Object.assign({}, state, { acceptInvitation: action.payload });

    case InvitationActions.CLEAR_VERIFY_INVITATION:
      return Object.assign({}, state, { acceptInvitation: {} });

    default:
      return state;
  }
}
