import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '@app/services/toast/toast.service';
import { AuthService } from '../../../shared/services/auth/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUpComponent implements OnInit {
  signUpForm: FormGroup;
  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  signUpWithGoogle() {
    this.auth.signInWithGoogle();
  }
  signUpWithGithub() {
    this.auth.signInWithGithub();
  }

  signUpWithCredentials() {
    if (this.signUpForm.valid) {
      const value = this.signUpForm.value;
      this.auth.signUpUser(value).subscribe(
        () => {
          this.toast.showSuccessToast('Signed up successfully!');
          this.router.navigate(['/auth/login']);
        },
        (error) => {
          this.toast.showErrorToast(error.message);
        }
      );
    }
  }

  private initForm() {
    this.signUpForm = this.fb.group({
      firstname: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(50),
        ],
      ],
      lastname: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(50),
        ],
      ],
      email: [
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
