import { Injectable } from '@angular/core';
import { CanLoad, Route } from '@angular/router';
import { ConfigService } from '../shared/config.service';

@Injectable()
export class CanLoadFolderGuard implements CanLoad {

    public canLoad(route: Route) {
        return (ConfigService.SHOW_FOLDERING === 'true');
    }
}
