import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { LoginMethods, User } from '@app/interfaces/user.interface';
import { ToastService } from '@app/services/toast/toast.service';
import { WithDestroy } from '@app/services/with-destory/with-destroy';
import { UpdateUserLoginMethod } from '@app/store/actions/user.action';
import { UserState } from '@app/store/states/user.state';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-profile-general',
  templateUrl: './profile-general.component.html',
  styleUrls: ['./profile-general.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileGeneralComponent extends WithDestroy implements OnInit {
  @Select(UserState.getLoggedInUser)
  user$: Observable<User>;

  userForm: FormGroup;
  loginWithGithub = new FormControl();
  loginWithGoogle = new FormControl();

  constructor(
    private store: Store,
    private fb: FormBuilder,
    private toast: ToastService
  ) {
    super();
  }

  ngOnInit(): void {
    this.initForm();
    this.listenToUserChange();
    this.listenToSocialLoginMethodsChanges();
  }

  initForm() {
    this.userForm = this.fb.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required]],
      github: [''],
      twitter: [''],
      website: [''],
    });
    this.userForm.get('email').disable();
  }

  saveUser() {}

  private listenToUserChange() {
    this.subs.add(
      this.user$
        .pipe(
          tap((user) => {
            if (user) {
              const { firstname, lastname, email, loginMethods } = user;
              this.userForm.patchValue({
                firstname,
                lastname,
                email,
              });
              this.loginWithGoogle.setValue(
                loginMethods.includes(LoginMethods.GOOGLE),
                { emitEvent: false }
              );
              this.loginWithGithub.setValue(
                loginMethods.includes(LoginMethods.GITHUB),
                { emitEvent: false }
              );
            }
          })
        )
        .subscribe()
    );
  }

  private listenToSocialLoginMethodsChanges() {
    this.subs.add(
      this.loginWithGoogle.valueChanges
        .pipe(
          switchMap((isEnabled) => {
            const user = this.store.selectSnapshot(UserState.getLoggedInUser);
            return this.store
              .dispatch(
                new UpdateUserLoginMethod(user.id, { GOOGLE: isEnabled })
              )
              .pipe(map(() => isEnabled));
          })
        )
        .subscribe((isEnabled) => {
          this.toast.showSuccessToast(
            `Login with Google is ${isEnabled ? 'enabled' : 'disabled'}`
          );
        })
    );
    this.subs.add(
      this.loginWithGithub.valueChanges
        .pipe(
          switchMap((isEnabled) => {
            const user = this.store.selectSnapshot(UserState.getLoggedInUser);
            return this.store
              .dispatch(
                new UpdateUserLoginMethod(user.id, { GITHUB: isEnabled })
              )
              .pipe(map(() => isEnabled));
          })
        )
        .subscribe((isEnabled) => {
          this.toast.showSuccessToast(
            `Login with Github is ${isEnabled ? 'enabled' : 'disabled'}`
          );
        })
    );
  }
}
