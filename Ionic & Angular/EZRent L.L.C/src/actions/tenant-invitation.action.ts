import { Injectable } from "@angular/core";
import { Action } from "@ngrx/store";

@Injectable()
export class InvitationActions {
  //Verify user number
  static SEND_INVITATION = "SEND_INVITATION";
  sendInvitation(payload: any): Action {
    return {
      type: InvitationActions.SEND_INVITATION,
      payload: payload
    };
  }

  static SEND_INVITATION_SUCCESS = "SEND_INVITATION_SUCCESS";
  sendInvitationSuccess(token: string): Action {
    return {
      type: InvitationActions.SEND_INVITATION_SUCCESS,
      payload: token
    };
  }

  static SEND_INVITATION_FAILURE = "SEND_INVITATION_FAILURE";
  sendInvitationFailure(data: any): Action {
    return {
      type: InvitationActions.SEND_INVITATION_FAILURE,
      payload: data
    };
  }


  //Verify user number INVITATION
  static VERIFY_INVITATION = "VERIFY_INVITATION";
  verifyInvitaion(payload: any): Action {
    return {
      type: InvitationActions.VERIFY_INVITATION,
      payload: payload
    };
  }

  static VERIFY_INVITATION_SUCCESS = "VERIFY_INVITATION_SUCCESS";
  verifyInvitaionSuccess(token: string): Action {
    return {
      type: InvitationActions.VERIFY_INVITATION_SUCCESS,
      payload: token
    };
  }

  static VERIFY_INVITATION_FAILURE = "VERIFY_INVITATION_FAILURE";
  verifyInvitaionFailure(data: any): Action {
    return {
      type: InvitationActions.VERIFY_INVITATION_FAILURE,
      payload: data
    };
  }

  //Verify user number INVITATION
  static ACCEPT_INVITATION = "ACCEPT_INVITATION";
  acceptInvitaion(payload: any): Action {
    return {
      type: InvitationActions.ACCEPT_INVITATION,
      payload: payload
    };
  }

  static ACCEPT_INVITATION_SUCCESS = "ACCEPT_INVITATION_SUCCESS";
  acceptInvitaionSuccess(token: string): Action {
    return {
      type: InvitationActions.ACCEPT_INVITATION_SUCCESS,
      payload: token
    };
  }

  static ACCEPT_INVITATION_FAILURE = "ACCEPT_INVITATION_FAILURE";
  acceptInvitaionFailure(data: any): Action {
    return {
      type: InvitationActions.ACCEPT_INVITATION_FAILURE,
      payload: data
    };
  }

  //Clear
  static CLEAR_SEND_INVITATION = "CLEAR_SEND_INVITATION";
  clearSendInvitation(): Action {
    return {
      type: InvitationActions.CLEAR_SEND_INVITATION
    };
  }

  static CLEAR_VERIFY_INVITATION = "CLEAR_VERIFY_INVITATION";
  clearVerifyInvitaion(): Action {
    return {
      type: InvitationActions.CLEAR_VERIFY_INVITATION
    };
  }

  static CLEAR_ACCEPT_INVITATION = "CLEAR_ACCEPT_INVITATION";
  clearAcceptInvitation(): Action {
    return {
      type: InvitationActions.CLEAR_ACCEPT_INVITATION
    };
  }
}
