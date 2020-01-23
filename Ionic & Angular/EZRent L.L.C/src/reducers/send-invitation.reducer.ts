import { Action } from "@ngrx/store";
import { InvitationActions } from "../actions/tenant-invitation.action";

export type sendInvitationState = any;

const initialState: sendInvitationState = {
  sendInvitation: {}
};

export default function (state = initialState, action: Action): sendInvitationState {

  switch (action.type) {

    case InvitationActions.SEND_INVITATION_SUCCESS:
      return Object.assign({}, state, { sendInvitation: action.payload });

    case InvitationActions.CLEAR_SEND_INVITATION:
      return Object.assign({}, state, { sendInvitation: {} });

    default:
      return state;
  }
}
