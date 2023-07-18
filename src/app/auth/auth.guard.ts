import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from "../shared/auth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    const currentUser = this.authService.currentUser;
    if (currentUser) {
      //check if the route is retricted by role
      if (next.data["roles"] && next.data["roles"].indexOf(currentUser.role) === -1) {
        //role not authorized
        this.router.navigate(["/login"])

      } else {
        return true;
      }
    }
    return false;
  }
}