import '@ngrx/core/add/operator/select';
import { compose } from '@ngrx/core/compose';
import { combineReducers } from '@ngrx/store';
import userReducer, * as user from './user.reducer';
import authReducer, * as auth from './auth.reducer';
import dwollaReducer, * as dwolla from './dwolla.reducer';
import landloardReducer, * as landloard from './landloard.reducer';
import tenantReducer, * as tenant from './tenant.reducer';
import buildingsReducer, * as buildings from './buildings.reducer';
import appartementReducer, * as appartement from './appartement.reducer';
import tenancyReducer, * as tenancy from './tenancy.reducer';
import userSelectionReducer, * as userSelection from './user-selection.reducer';
import passwordChangeReducer, * as passwordChange from './password-change.reducer';
import registerReducer, * as register from './register.reducer';
import verifyCodeReducer, * as verifyCode from './verify-code.reducer';
import verifyNumberReducer, * as verifyNumber from './verify-number.reducer';

import acceptInvitationReducer, * as acceptInvitation from './accept-invitation.reducer';
import sendInvitationReducer, * as sendInvitation from './send-invitation.reducer';
import verifyInvitationReducer, * as verifyInvitation from './verify-invitation.reducer';

export interface AppState {
  user: user.UserState,
  auth: auth.AuthState,
  dwolla: dwolla.DwollaState,
  landloard: landloard.LandloardState,
  tenant: tenant.TenantState,
  buildings: buildings.BuildingState,
  appartement: appartement.AppartementState,
  tenancy: tenancy.TenancyState,
  userCategory: userSelection.userSelectionState,
  passwordChange: passwordChange.PasswordChangeState,
  register: register.UserRegisterState,
  verifyCode: verifyCode.VerifyCodeState,
  verifyNumber: verifyNumber.VerifyNumberState,
  acceptInvitation: acceptInvitation.acceptInvitationState,
  sendInvitation: sendInvitation.sendInvitationState,
  verifyInvitation: verifyInvitation.verifyInvitationState
}

export default compose(combineReducers)({
  user: userReducer,
  auth: authReducer,
  dwolla: dwollaReducer,
  landloard: landloardReducer,
  tenant: tenantReducer,
  buildings: buildingsReducer,
  appartement: appartementReducer,
  tenancy: tenancyReducer,
  userCategory: userSelectionReducer,
  passwordChange: passwordChangeReducer,
  register: registerReducer,
  verifyCode: verifyCodeReducer,
  verifyNumber: verifyNumberReducer,
  acceptInvite: acceptInvitationReducer,
  sendInvitate: sendInvitationReducer,
  verifyInvite: verifyInvitationReducer,

});