
import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';
import { InvitationActions } from '../actions';
import { TenantInvitationService } from '../services/tenant-invitation.service';

@Injectable()
export class TenantInvitationEffects {
    constructor(
        private update$: Actions,
        private invitationActions: InvitationActions,
        private svc: TenantInvitationService
    ) {

    }

    // @Effect() sendInvitation$ = this.update$
    //     .ofType(InvitationActions.SEND_INVITATION)
    //     .switchMap((data) => this.svc.sendInvite(data)
    //         .map(token => this.invitationActions.sendInvitationSuccess(token))
    //         .catch(err => of(this.invitationActions.sendInvitationFailure(err)))
    //     );

    @Effect() verifyInvitation$ = this.update$
        .ofType(InvitationActions.VERIFY_INVITATION)
        .switchMap((data) => this.svc.verifyInvitaion(data)
            .map(token => this.invitationActions.verifyInvitaionSuccess(token))
            .catch(err => of(this.invitationActions.verifyInvitaionFailure(err)))
        );

    @Effect() accpetInvitation$ = this.update$
        .ofType(InvitationActions.ACCEPT_INVITATION)
        .switchMap((data) => this.svc.acceptInvitaion(data)
            .map(token => this.invitationActions.acceptInvitaionSuccess(token))
            .catch(err => of(this.invitationActions.acceptInvitaionFailure(err)))
        );


    @Effect() clearVerifyInvitation$ = this.update$
        .ofType(InvitationActions.CLEAR_VERIFY_INVITATION)
        .map(() => this.invitationActions.clearVerifyInvitaion());

    @Effect() clearSendInvitation$ = this.update$
        .ofType(InvitationActions.CLEAR_SEND_INVITATION)
        .map(() => this.invitationActions.clearSendInvitation());

    @Effect() clearAccpetInvitation$ = this.update$
        .ofType(InvitationActions.CLEAR_ACCEPT_INVITATION)
        .map(() => this.invitationActions.clearAcceptInvitation());

}