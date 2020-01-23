import { Injectable } from "@angular/core";
import { Action } from "@ngrx/store";

@Injectable()
export class AuthActions {
  //Login
  static LOGIN = "LOGIN";
  login(payload: any): Action {
    return {
      type: AuthActions.LOGIN,
      payload: payload
    };
  }

  static LOGIN_SUCCESS = "LOGIN_SUCCESS";
  loginSuccess(token: string): Action {
    return {
      type: AuthActions.LOGIN_SUCCESS,
      payload: token
    };
  }

  static LOGIN_FAILURE = "LOGIN_FAILURE";
  loginFailure(data: any): Action {
    return {
      type: AuthActions.LOGIN_FAILURE,
      payload: data
    };
  }

  //Logout
  static LOGOUT = "LOGOUT";
  logout(): Action {
    return {
      type: AuthActions.LOGOUT
    };
  }

  static LOGOUT_SUCCESS = "LOGOUT_SUCCESS";
  logoutSuccess(): Action {
    return {
      type: AuthActions.LOGOUT_SUCCESS
    };
  }

  static LOGOUT_FAILURE = "LOGOUT_FAILURE";
  logoutFailure(): Action {
    return {
      type: AuthActions.LOGOUT_FAILURE
    };
  }

  static CLEAR_ERROR = "CLEAR_ERROR";
  clearError(): Action {
    return {
      type: AuthActions.CLEAR_ERROR
    };
  }

  static CLEAR_ERROR_SUCCESS = "CLEAR_ERROR_SUCCESS";
  clearErrorSuccess(): Action {
    return {
      type: AuthActions.CLEAR_ERROR_SUCCESS
    };
  }

  static CLEAR_LOGIN = "CLEAR_LOGIN";
  clearLogin(): Action {
    return {
      type: AuthActions.CLEAR_LOGIN
    };
  }

  static CLEAR_LOGIN_SUCCESS = "CLEAR_LOGIN_SUCCESS";
  clearLoginSuccess(): Action {
    return {
      type: AuthActions.CLEAR_LOGIN_SUCCESS
    };
  }
}
