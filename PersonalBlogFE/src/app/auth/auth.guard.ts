import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (): boolean => {

  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (token) {
    // Token exists, allow access
    return true;
  } else {
    // No token, redirect to login page
    router.navigate(['/auth/login']);
    return false;
  }
};
