
import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';

import { AuthActions } from '../actions';
import { UserService } from '../services/user.service';

import { of } from 'rxjs/observable/of';

@Injectable()
export class AuthEffects {
    constructor(
        private update$: Actions,
        private authActions: AuthActions,
        private svc: UserService
    ) { }

    
    @Effect() login$ = this.update$
        .ofType(AuthActions.LOGIN)
        .switchMap((data) => this.svc.login(data)
            .map(token => this.authActions.loginSuccess(token))
            .catch(err => of(this.authActions.loginFailure(err)))
        );    
    @Effect() logout$ = this.update$
        .ofType(AuthActions.LOGOUT)
        .switchMap(() => this.svc.logout()
        ); 

    @Effect() clearError$ = this.update$
        .ofType(AuthActions.CLEAR_ERROR)
        .map(() => this.authActions.clearErrorSuccess());    

    @Effect() clearLogin$ = this.update$
        .ofType(AuthActions.CLEAR_LOGIN)
        .map(() => this.authActions.clearLoginSuccess());

}
