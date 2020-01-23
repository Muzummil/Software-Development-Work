import { Injectable } from "@angular/core";
import { Action } from "@ngrx/store";

@Injectable()
export class UserActions {

  //Register user
  static REGISTER = "REGISTER";
  register(payload: any): Action {
    return {
      type: UserActions.REGISTER,
      payload: payload
    };
  }

  static REGISTER_SUCCESS = "REGISTER_SUCCESS";
  registerSuccess(token: string): Action {
    return {
      type: UserActions.REGISTER_SUCCESS,
      payload: token
    };
  }

  static REGISTER_FAILURE = "REGISTER_FAILURE";
  registerFailure(data: any): Action {
    return {
      type: UserActions.REGISTER_FAILURE,
      payload: data
    };
  }

  //Change Password
  static CHANGE_PASSWORD = "CHANGE_PASSWORD";
  changePassword(payload: any): Action {
    return {
      type: UserActions.CHANGE_PASSWORD,
      payload: payload
    };
  }

  static CHANGE_PASSWORD_SUCCESS = "CHANGE_PASSWORD_SUCCESS";
  changePasswordSuccess(token: string): Action {
    return {
      type: UserActions.CHANGE_PASSWORD_SUCCESS,
      payload: token
    };
  }

  static CHANGE_PASSWORD_FAILURE = "CHANGE_PASSWORD_FAILURE";
  changePasswordFailure(data: any): Action {
    return {
      type: UserActions.CHANGE_PASSWORD_FAILURE,
      payload: data
    };
  }

  //Verify user number
  static VERIFY_NUMBER = "VERIFY_NUMBER";
  verifyNumber(payload: any): Action {
    return {
      type: UserActions.VERIFY_NUMBER,
      payload: payload
    };
  }

  static VERIFY_NUMBER_SUCCESS = "VERIFY_NUMBER_SUCCESS";
  verifyNumberSuccess(token: string): Action {
    return {
      type: UserActions.VERIFY_NUMBER_SUCCESS,
      payload: token
    };
  }

  static VERIFY_NUMBER_FAILURE = "VERIFY_NUMBER_FAILURE";
  verifyNumberFailure(data: any): Action {
    return {
      type: UserActions.VERIFY_NUMBER_FAILURE,
      payload: data
    };
  }


  //Verify user number code
  static VERIFY_CODE = "VERIFY_CODE";
  verifyCode(payload: any): Action {
    return {
      type: UserActions.VERIFY_CODE,
      payload: payload
    };
  }

  static VERIFY_CODE_SUCCESS = "VERIFY_CODE_SUCCESS";
  verifyCodeSuccess(token: string): Action {
    return {
      type: UserActions.VERIFY_CODE_SUCCESS,
      payload: token
    };
  }

  static VERIFY_CODE_FAILURE = "VERIFY_CODE_FAILURE";
  verifyCodeFailure(data: any): Action {
    return {
      type: UserActions.VERIFY_CODE_FAILURE,
      payload: data
    };
  }

  //Get User
  static GET_USER = "GET_USER";
  getUser(): Action {
    return {
      type: UserActions.GET_USER
    };
  }

  static GET_USER_SUCCESS = "GET_USER_SUCCESS";
  getUserSuccess(payload: any): Action {
    return {
      type: UserActions.GET_USER_SUCCESS,
      payload: payload
    };
  }

  static CLEAR_USER = "CLEAR_USER";
  clearUser(): Action {
    return {
      type: UserActions.CLEAR_USER
    };
  }

  static CLEAR_REGISTER = "CLEAR_REGISTER";
  clearRegister(): Action {
    return {
      type: UserActions.CLEAR_REGISTER
    };
  }

  static CLEAR_PASSWORD = "CLEAR_PASSWORD";
  clearChangePassword(): Action {
    return {
      type: UserActions.CLEAR_PASSWORD
    };
  }


  static CLEAR_USER_SUCCESS = "CLEAR_USER_SUCCESS";
  clearUserSuccess(): Action {
    return {
      type: UserActions.CLEAR_USER_SUCCESS
    };
  }

  static CLEAR_VERIFY_CODE = "CLEAR_VERIFY_CODE";
  clearVerifyCode(): Action {
    return {
      type: UserActions.CLEAR_VERIFY_CODE
    };
  }

  static CLEAR_VERIFY_NUMBER = "CLEAR_VERIFY_NUMBER";
  clearVerifyNumber(): Action {
    return {
      type: UserActions.CLEAR_VERIFY_NUMBER
    };
  }
}
