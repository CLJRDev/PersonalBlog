import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  rememberDevice: boolean = false;

  formErrors = {
    username: '',
    password: ''
  }

  constructor(private authService: AuthService, private router: Router, private toastr: ToastrService) { }

  onSubmit() {
    if (this.loginValidation()) return

    this.authService.login(this.username, this.password).subscribe({
      next: res => {
        console.log(res);
        this.toastr.success(res.message, 'Login')
        localStorage.setItem('token', res.token);
        localStorage.setItem('fullname', res.user.fullname);
        localStorage.setItem('userId', res.user.id);
        this.router.navigate(['/admin']);
      },
      error: err => {
        console.error('Login failed:', err)
        this.toastr.error(err.error.message, 'Login')
      }
    })
  }

  loginValidation(): boolean {
    this.resetFormErrors()

    let result = false

    if (!this.username || this.username.trim() === '') {
      this.formErrors.username = 'Username is required'
      result = true
    }

    if (!this.password || this.password.trim() === '') {
      this.formErrors.password = 'Password is required'
      result = true
    }

    return result
  }

  clearError(field: keyof typeof this.formErrors): void {
    if (this.formErrors[field]) {
      this.formErrors[field] = '';
    }
  }

  resetFormErrors(): void {
    this.formErrors = {
      username: '',
      password: ''
    }
  }
}
