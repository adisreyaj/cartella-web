import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WithDestroy } from '@app/services/with-destroy/with-destroy';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

export enum ResetPasswordStages {
  email,
  otp,
  password,
}
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordComponent extends WithDestroy implements OnInit {
  resetForm: FormGroup;
  resetPasswordStages = ResetPasswordStages;
  stageValue = ResetPasswordStages.email;
  stageSubject = new BehaviorSubject<ResetPasswordStages>(this.stageValue);
  stage$ = this.stageSubject.pipe(tap((value) => (this.stageValue = value)));
  buttonText = {
    [ResetPasswordStages.email]: 'Send OTP',
    [ResetPasswordStages.otp]: 'Verify OTP',
    [ResetPasswordStages.password]: 'Update Password',
  };
  loadingSubject = new BehaviorSubject(false);
  loading$ = this.loadingSubject.pipe();
  validators = {
    email: [Validators.required, Validators.email, Validators.minLength(5)],
    otp: [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(8),
    ],
    password: [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(24),
    ],
  };
  constructor(private fb: FormBuilder) {
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
      case ResetPasswordStages.otp:
        this.verifyOtp();
        break;
      case ResetPasswordStages.password:
        this.updatePassword();
        break;
    }
  }

  private generateOtp() {
    this.stageSubject.next(ResetPasswordStages.otp);
  }

  private verifyOtp() {
    this.stageSubject.next(ResetPasswordStages.password);
  }

  private updatePassword() {}

  private updateFormValidators = (stage: ResetPasswordStages) => {
    switch (stage) {
      case ResetPasswordStages.email:
        this.resetForm.get('email').enable();
        this.resetForm.get('otp').disable();
        this.resetForm.get('password').disable();

        this.resetForm.get('email').setValidators(this.validators.email);
        this.resetForm.get('otp').setValidators([]);
        this.resetForm.get('password').setValidators([]);

        this.resetForm.get('email').updateValueAndValidity();
        this.resetForm.get('otp').updateValueAndValidity();
        this.resetForm.get('password').updateValueAndValidity();
        break;

      case ResetPasswordStages.otp:
        this.resetForm.get('email').disable();
        this.resetForm.get('otp').enable();
        this.resetForm.get('password').disable();

        this.resetForm.get('email').setValidators(this.validators.email);
        this.resetForm.get('otp').setValidators(this.validators.otp);
        this.resetForm.get('password').setValidators([]);

        this.resetForm.get('email').updateValueAndValidity();
        this.resetForm.get('otp').updateValueAndValidity();
        this.resetForm.get('password').updateValueAndValidity();
        break;

      case ResetPasswordStages.password:
        this.resetForm.get('email').disable();
        this.resetForm.get('otp').disable();
        this.resetForm.get('password').enable();

        this.resetForm.get('email').setValidators(this.validators.otp);
        this.resetForm.get('otp').setValidators(this.validators.otp);
        this.resetForm.get('password').setValidators(this.validators.password);

        this.resetForm.get('email').updateValueAndValidity();
        this.resetForm.get('otp').updateValueAndValidity();
        this.resetForm.get('password').updateValueAndValidity();
        break;
    }
  };

  private initForm() {
    this.resetForm = this.fb.group({
      email: ['', this.validators.email],
      otp: [''],
      password: [''],
    });
  }
}
