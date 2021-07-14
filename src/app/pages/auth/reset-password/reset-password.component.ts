import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { WithDestroy } from '@cartella/services/with-destroy/with-destroy';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ResetPasswordService } from './services/reset-password.service';

export enum ResetPasswordStages {
  email,
  password,
}
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordComponent extends WithDestroy implements OnInit {
  resetForm!: FormGroup;
  resetPasswordStages = ResetPasswordStages;
  stageValue = ResetPasswordStages.email;
  stageSubject = new BehaviorSubject<ResetPasswordStages>(this.stageValue);
  stage$ = this.stageSubject.pipe(tap((value) => (this.stageValue = value)));
  buttonText: { [key: number]: string } = {
    [ResetPasswordStages.email]: 'Send OTP',
    [ResetPasswordStages.password]: 'Update Password',
  };
  loadingSubject = new BehaviorSubject(false);
  loading$ = this.loadingSubject.pipe();
  validators = {
    email: [Validators.required, Validators.email, Validators.minLength(5)],
    otp: [Validators.required, Validators.minLength(4), Validators.maxLength(8)],
    password: [Validators.required, Validators.minLength(6), Validators.maxLength(24)],
  };
  constructor(private fb: FormBuilder, private router: Router, private resetPasswordService: ResetPasswordService) {
    super();
    this.initForm();
  }

  ngOnInit(): void {
    this.subs.add(this.stage$.pipe(tap(this.updateFormValidators)).subscribe());
  }

  handleSubmit() {
    switch (this.stageValue) {
      case ResetPasswordStages.email:
        this.generateOtp();
        break;
      case ResetPasswordStages.password:
        this.updatePassword();
        break;
    }
  }

  private generateOtp() {
    this.loadingSubject.next(true);
    const {
      valid,
      value: { email },
    } = this.resetForm;
    if (valid) {
      this.subs.add(
        this.resetPasswordService
          .generateOTP(email)
          .pipe(
            tap(() => {
              this.stageSubject.next(ResetPasswordStages.password);
            }),
          )
          .subscribe(
            () => {
              this.loadingSubject.next(false);
            },
            () => {
              this.loadingSubject.next(false);
              this.stageSubject.next(ResetPasswordStages.email);
            },
          ),
      );
    }
  }

  private updatePassword() {
    this.loadingSubject.next(true);
    const { valid } = this.resetForm;
    const value = this.resetForm.getRawValue();
    if (valid) {
      this.subs.add(
        this.resetPasswordService.changePassword(value).subscribe(
          () => {
            this.loadingSubject.next(false);
            this.router.navigate(['/auth/login']);
          },
          () => {
            this.loadingSubject.next(false);
            this.resetFormValues(true);
            this.stageSubject.next(ResetPasswordStages.email);
          },
        ),
      );
    }
  }

  private updateFormValidators = (stage: ResetPasswordStages) => {
    switch (stage) {
      case ResetPasswordStages.email:
        this.resetForm.get('email')?.enable();
        this.resetForm.get('otp')?.disable();
        this.resetForm.get('password')?.disable();

        this.resetForm.get('email')?.setValidators(this.validators.email);
        this.resetForm.get('otp')?.setValidators([]);
        this.resetForm.get('password')?.setValidators([]);

        this.updateFieldValidities();
        break;

      case ResetPasswordStages.password:
        this.resetFormValues();
        this.resetForm.get('email')?.disable();
        this.resetForm.get('otp')?.enable();
        this.resetForm.get('password')?.enable();

        this.resetForm.get('email')?.setValidators(this.validators.email);
        this.resetForm.get('otp')?.setValidators(this.validators.otp);
        this.resetForm.get('password')?.setValidators(this.validators.password);

        this.updateFieldValidities();
        break;
    }
  };

  private updateFieldValidities() {
    this.resetForm.get('email')?.updateValueAndValidity();
    this.resetForm.get('otp')?.updateValueAndValidity();
    this.resetForm.get('password')?.updateValueAndValidity();
  }

  private resetFormValues(resetAll = false) {
    if (resetAll) {
      this.resetForm.get('email')?.reset();
    }
    this.resetForm.get('otp')?.reset();
    this.resetForm.get('password')?.reset();
  }

  private initForm() {
    this.resetForm = this.fb.group({
      email: ['', this.validators.email],
      otp: [''],
      password: [''],
    });
  }
}
