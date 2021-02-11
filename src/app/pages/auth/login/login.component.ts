import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '@app/services/toast/toast.service';
import { tap } from 'rxjs/operators';
import { AuthService } from '../../../shared/services/auth/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private toast: ToastService
  ) {
    this.initForm();
  }

  ngOnInit(): void {}

  signInWithCredentials() {
    if (this.loginForm.valid) {
      const value = this.loginForm.value;
      this.auth
        .singInWithUserCredentials(value)
        .pipe(
          tap((response) => {
            if (response) {
              localStorage.setItem('token', response.accessToken);
            }
          })
        )
        .subscribe(
          () => {
            this.router.navigate(['/']);
          },
          (error) => {
            this.toast.showErrorToast(error.error.message);
          }
        );
    }
  }

  signInWithGoogle() {
    this.auth.signInWithGoogle();
  }
  async signInWithGithub() {
    this.auth.signInWithGithub();
  }
  private initForm() {
    this.loginForm = this.fb.group({
      username: [
        '',
        [Validators.required, Validators.email, Validators.minLength(5)],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(24),
        ],
      ],
    });
  }
}
