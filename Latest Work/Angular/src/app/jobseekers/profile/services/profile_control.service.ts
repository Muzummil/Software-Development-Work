import { Injectable }   from '@angular/core';
import {FormBuilder} from '@angular/forms';

import { JobSeekerGeneralInfo } from '../models/JobSeekerGeneralInfo';

@Injectable()
export class ProfileControlService {
    constructor(public fb: FormBuilder) { }

    toControlGroup(jobSeekerGeneralInfo: JobSeekerGeneralInfo[]  ) {
        let group = {};



        return this.fb.group(group);
    }
}
