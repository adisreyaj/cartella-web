import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '@app/interfaces/user.interface';
import { UserState } from '@app/store/states/user.state';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  @Select(UserState.getLoggedInUser)
  user$: Observable<User>;

  userForm: FormGroup;
  private subs = new SubSink();
  constructor(private store: Store, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    this.listenToUserChange();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  initForm() {
    this.userForm = this.fb.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: [''],
      confirmPassword: [''],
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
              const { firstname, lastname, email } = user;
              this.userForm.patchValue({
                firstname,
                lastname,
                email,
              });
            }
          })
        )
        .subscribe()
    );
  }
}
