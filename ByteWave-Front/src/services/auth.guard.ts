import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivate } from '@angular/router';
import { AuthService } from 'src/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const expectedRoles = route.data['roles'] as Array<string>;
    const userRole = this.authService.getUserRole();

    if (this.authService.isLoggedIn() && (!expectedRoles || expectedRoles.includes(userRole!))) {
      return true;
    } else {
      this.router.navigate(['/notfound']);
      return false;
    }
  }
}
