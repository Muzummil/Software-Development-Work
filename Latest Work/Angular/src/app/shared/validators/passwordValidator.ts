import { FormGroup } from '@angular/forms';

export class PasswordValidator {

    public static passwordConfirm(group: FormGroup) {

        let newPassword = (group.root['value']) ? group.root['value']['password'] : '';
        let newPassword2 = group['value'];

        // If fail
        if (newPassword != newPassword2) {

            return {passwordConfirm: true};
        }

        // If Success
        return null;
    }

    public static passwordMissmatch(group: FormGroup) {

        let newPassword = (group.root['value']) ? group.root['value']['new_password'] : '';
        let newPassword2 = group['value'];

        // If fail
        if (newPassword != newPassword2) {

            return {passwordMissmatch: true};
        }

        // If Success
        return null;
    }

    public static complexPass(control) {
        const minlength = 8;
        if (control.value && control.value.length != 0 && control.value.length < minlength) {
            // If fail
            return {complexPass: {minlength}};
        }

        // If pass
        return null;

    }

}
