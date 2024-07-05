import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {AuthenticationServiceService} from "../services/AuthenticationService.service";

@Injectable({providedIn: 'root'})


export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationServiceService
    ) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
        const currentAccessToken = this.authenticationService.currentUserValue;
        let expectedRoleArray = route.data;
        let expectedRole;
        expectedRoleArray = expectedRoleArray['expectedRole'];
        // @ts-ignore
        if (currentAccessToken && expectedRoleArray.length) {
            // authorised so return true
            let i;
            // @ts-ignore
            for (i = 0; i < expectedRoleArray.length; i++) {
                if (expectedRoleArray[i] === currentAccessToken.user.roleId) {
                    expectedRole = currentAccessToken.user.roleId;
                }
            }
            if (this.authenticationService.isAuthenticated() && currentAccessToken.user.roleId === expectedRole) {
                return true;
            }
            // return true;
        } else {
            this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
            return false;
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
        return false;
    }

}
