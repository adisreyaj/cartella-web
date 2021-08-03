import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, BaseStorageService, ToastService } from '@cartella/ui/services';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SubSink } from 'subsink';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;

  private loadingSubject = new BehaviorSubject<boolean>(false);
  readonly loading$ = this.loadingSubject.pipe();
  private subs = new SubSink();
  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private storageService: BaseStorageService,
    private toast: ToastService,
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.subs.add(this.storageService.flushAll().subscribe());
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  signInWithCredentials() {
    if (this.loginForm.valid) {
      const value = this.loginForm.value;
      this.loadingSubject.next(true);
      this.auth
        .singInWithUserCredentials(value)
        .pipe(
          tap((response) => {
            if (response) {
              localStorage.setItem('token', response.accessToken);
            }
          }),
        )
        .subscribe(
          () => {
            this.loadingSubject.next(false);
            this.router.navigate(['/']);
          },
          (error) => {
            this.loadingSubject.next(false);
            this.toast.showErrorToast(error.error.message);
          },
        );
    }
  }

  signInWithGoogle() {
    this.loadingSubject.next(true);
    this.auth.signInWithGoogle();
  }
  async signInWithGithub() {
    this.loadingSubject.next(true);
    this.auth.signInWithGithub();
  }
  private initForm() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email, Validators.minLength(5)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(24)]],
    });
  }
}
