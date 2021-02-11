import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@app/services/auth/auth.service';
import { ToastService } from '@app/services/toast/toast.service';
import { GetLoggedInUser } from '@app/store/actions/user.action';
import { Store } from '@ngxs/store';
import { take } from 'rxjs/operators';

@Component({
  templateUrl: './login-handler.component.html',
  styleUrls: ['./login-handler.component.scss'],
})
export class LoginHandlerComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    private auth: AuthService,
    private toast: ToastService
  ) {}
  ngOnInit(): void {
    const query = this.route.snapshot.queryParams;
    if (query && query?.code === 'SUCCESS') {
      localStorage.setItem('token', query.token);
      this.store
        .dispatch(new GetLoggedInUser())
        .pipe(take(1))
        .subscribe(
          () => {
            this.router.navigate(['/']);
          },
          () => {
            this.router.navigate(['/auth/login']);
          }
        );
    } else {
      this.toast.showErrorToast(query.message);
      this.router.navigate(['/auth/login']);
    }
  }
}
