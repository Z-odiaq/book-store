import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { UserService } from './services/user.Service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    console.log('AuthGuard#canActivate called', this.userService.admin.value);
    
    if ( this.userService.admin.value) {
      return true;
    }

    // Redirect unauthorized users to a different route (e.g., login page)
    return this.router.createUrlTree(['/login']);
  }
}
