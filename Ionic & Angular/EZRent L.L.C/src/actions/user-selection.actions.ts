import { Injectable } from "@angular/core";
import { Action } from "@ngrx/store";

@Injectable()
export class UserSelectionActions {
  //Login
  static USER_SELECTION = "USER_SELECTION";
  userSelection(payload: any): Action {
    return {
      type: UserSelectionActions.USER_SELECTION,
      payload: payload
    };
  }

  static USER_SELECTION_SUCCESS = "USER_SELECTION_SUCCESS";
  userSelectionSuccess(token: string): Action {
    return {
      type: UserSelectionActions.USER_SELECTION_SUCCESS,
      payload: token
    };
  }

  static USER_SELECTION_FAILURE = "USER_SELECTION_FAILURE";
  userSelectionFailure(data: any): Action {
    return {
      type: UserSelectionActions.USER_SELECTION_FAILURE,
      payload: data
    };
  }

  static CLEAR_USER_SELECTION = "CLEAR_USER_SELECTION";
  clearUserSelection(): Action {
    return {
      type: UserSelectionActions.CLEAR_USER_SELECTION
    };
  }


}
