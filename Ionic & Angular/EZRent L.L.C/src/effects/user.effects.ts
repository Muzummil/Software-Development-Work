
import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';
import { UserActions } from '../actions';
import { UserService } from '../services/user.service';

@Injectable()
export class UserEffects {
    constructor(
        private update$: Actions,
        private userActions: UserActions,
        private svc: UserService
    ) {

    }

    @Effect() register$ = this.update$
        .ofType(UserActions.REGISTER)
        .switchMap((data) => this.svc.register(data)
            .map(token => this.userActions.registerSuccess(token))
            .catch(err => of(this.userActions.registerFailure(err)))
        );

    @Effect() changePassword$ = this.update$
        .ofType(UserActions.CHANGE_PASSWORD)
        .switchMap((data) => this.svc.changePassword(data)
            .map(token => this.userActions.changePasswordSuccess(token))
            .catch(err => of(this.userActions.changePasswordFailure(err)))
        );

    @Effect() verifyNumber$ = this.update$
        .ofType(UserActions.VERIFY_NUMBER)
        .switchMap((data) => this.svc.verifyNumber(data)
            .map(token => this.userActions.verifyNumberSuccess(token))
            .catch(err => of(this.userActions.verifyNumberFailure(err)))
        );

    @Effect() verifyCode$ = this.update$
        .ofType(UserActions.VERIFY_CODE)
        .switchMap((data) => this.svc.verifyCode(data)
            .map(token => this.userActions.verifyCodeSuccess(token))
            .catch(err => of(this.userActions.verifyCodeFailure(err)))
        );

    @Effect() getUser$ = this.update$
        .ofType(UserActions.GET_USER)
        .switchMap(() => this.svc.getUser())
        .map(user => this.userActions.getUserSuccess(user));

    @Effect() clearUser$ = this.update$
        .ofType(UserActions.CLEAR_USER)
        .map(() => this.userActions.clearUserSuccess());

    @Effect() clearVerifyNumber$ = this.update$
        .ofType(UserActions.CLEAR_VERIFY_NUMBER)
        .map(() => this.userActions.clearVerifyNumber());

    @Effect() clearVerifyCode$ = this.update$
        .ofType(UserActions.CLEAR_VERIFY_CODE)
        .map(() => this.userActions.clearVerifyCode());

    @Effect() clearPassChange$ = this.update$
        .ofType(UserActions.CLEAR_PASSWORD)
        .map(() => this.userActions.clearChangePassword());

}