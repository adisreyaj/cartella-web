/* eslint-disable @typescript-eslint/naming-convention */
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { LoginMethods, User } from '@cartella/interfaces/user.interface';
import { ToastService } from '@cartella/services/toast/toast.service';
import { WithDestroy } from '@cartella/services/with-destroy/with-destroy';
import {
  UpdateUser,
  UpdateUserLoginMethod,
} from '@cartella/store/actions/user.action';
import { UserState } from '@cartella/store/states/user.state';
import { Select, Store } from '@ngxs/store';
import { BehaviorSubject, Observable } from 'rxjs';
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

  savingSubject = new BehaviorSubject(false);
  saving$ = this.savingSubject.pipe();

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
      github: [
        '',
        Validators.pattern(
          /http(?:s)?:\/\/(?:www\.)?github\.com\/([a-zA-Z0-9_]+)/
        ),
      ],
      twitter: [
        '',
        Validators.pattern(
          /http(?:s)?:\/\/(?:www\.)?twitter\.com\/([a-zA-Z0-9_]+)/
        ),
      ],
      website: [''],
    });
    this.userForm.get('email').disable();
  }

  saveUser() {
    if (this.userForm.valid) {
      this.savingSubject.next(true);
      const sub = this.store
        .dispatch(
          new UpdateUser(
            this.store.selectSnapshot(UserState.getLoggedInUser).id,
            this.userForm.value
          )
        )
        .subscribe(
          () => {
            this.savingSubject.next(false);
            this.toast.showSuccessToast('Profile updated successfully');
            this.userForm.markAsPristine();
          },
          () => {
            this.savingSubject.next(false);
          }
        );
      this.subs.add(sub);
    }
  }

  private listenToUserChange() {
    this.subs.add(
      this.user$
        .pipe(
          tap((user) => {
            if (user) {
              const {
                firstname,
                lastname,
                email,
                loginMethods,
                github,
                twitter,
                website,
              } = user;
              this.userForm.patchValue({
                firstname,
                lastname,
                email,
                github,
                twitter,
                website,
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
